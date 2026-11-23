import { useSyncExternalStore } from 'react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const SKIP_KEY = 'fruitly:install-skipped';

let deferred: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

/** Dipanggil sekali di main.tsx, supaya event install tidak terlewat sebelum halaman kamera terbuka. */
export function initPwa() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferred = event as InstallPromptEvent;
    emit();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    emit();
  });

  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
    });
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

/** true kalau browser siap menampilkan dialog install bawaan (Chrome/Edge/Samsung Internet di Android). */
export function useCanInstall() {
  return useSyncExternalStore(subscribe, () => deferred !== null, () => false);
}

export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  const event = deferred;
  if (!event) return 'unavailable';
  deferred = null;
  emit();
  await event.prompt();
  const { outcome } = await event.userChoice;
  return outcome;
}

/** true kalau Fruitly sedang dibuka dari ikon di layar utama. */
export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** iPhone/iPad tidak punya dialog install otomatis, jadi perlu petunjuk manual. */
export function isIos() {
  const ua = navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function installWasSkipped() {
  try { return sessionStorage.getItem(SKIP_KEY) === '1'; } catch { return false; }
}

export function rememberInstallSkipped() {
  try { sessionStorage.setItem(SKIP_KEY, '1'); } catch { /* abaikan */ }
}
