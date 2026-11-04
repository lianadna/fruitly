/** Pengguna yang mematikan animasi di sistemnya tidak akan melihat gerakan dekoratif. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type DriftItem = { el: HTMLElement; speed: number };
const items = new Set<DriftItem>();
let ticking = false;
let bound = false;

function update() {
  ticking = false;
  const vh = window.innerHeight;
  const reads = [...items].map((item) => {
    const host = item.el.parentElement ?? item.el;
    const rect = host.getBoundingClientRect();
    return { item, rect };
  });
  for (const { item, rect } of reads) {
    if (rect.bottom < -300 || rect.top > vh + 300) continue;
    const offset = rect.top + rect.height / 2 - vh / 2;
    item.el.style.setProperty('--drift', `${(offset * item.speed).toFixed(1)}px`);
  }
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(update);
}

/** Menggeser elemen sedikit saat scroll supaya dekorasi terasa berlapis (parallax). */
export function registerDrift(el: HTMLElement, speed: number) {
  if (prefersReducedMotion()) return () => {};
  const item = { el, speed };
  items.add(item);
  if (!bound) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    bound = true;
  }
  onScroll();
  return () => {
    items.delete(item);
    if (items.size === 0 && bound) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      bound = false;
    }
  };
}
