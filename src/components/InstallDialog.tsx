import { useEffect, useRef, useState } from 'react';
import { Download, Share, SquarePlus } from 'lucide-react';
import { LogoMark } from './Illustrations';
import { promptInstall, useCanInstall } from '../lib/pwa';

type Props = {
  /** Dipanggil saat pengguna selesai memilih (install atau lanjut tanpa instalasi). */
  onDone: (installed: boolean) => void;
};

export function InstallDialog({ onDone }: Props) {
  const canInstall = useCanInstall();
  const [showSteps, setShowSteps] = useState(false);
  const [busy, setBusy] = useState(false);
  const primaryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    primaryRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onDone(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  const install = async () => {
    if (canInstall) {
      setBusy(true);
      const outcome = await promptInstall();
      setBusy(false);
      onDone(outcome === 'accepted');
      return;
    }
    setShowSteps(true); // iPhone/iPad: pasang lewat menu Bagikan
  };

  return (
    <div className="install-backdrop" role="presentation">
      <div className="install-card" role="dialog" aria-modal="true" aria-labelledby="install-title">
        <span className="install-icon"><LogoMark size={46} /></span>
        <h2 id="install-title">Pasang Fruitly di HP kamu</h2>
        <p>Buka Fruitly langsung dari layar utama, seperti aplikasi biasa.</p>

        {showSteps ? (
          <ol className="install-steps">
            <li><Share size={20} aria-hidden="true" /><span>Ketuk tombol <b>Bagikan</b> di Safari.</span></li>
            <li><SquarePlus size={20} aria-hidden="true" /><span>Pilih <b>Tambahkan ke Layar Utama</b>.</span></li>
          </ol>
        ) : (
          <button ref={primaryRef} type="button" className="btn btn-red btn-block" onClick={install} disabled={busy}>
            <Download size={20} /><span>Install Fruitly</span>
          </button>
        )}

        <button type="button" className="install-skip" onClick={() => onDone(false)}>
          {showSteps ? 'Lanjut ke kamera' : 'Lanjut tanpa instalasi'}
        </button>
      </div>
    </div>
  );
}
