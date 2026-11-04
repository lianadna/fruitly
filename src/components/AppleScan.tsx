import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Apple } from './Illustrations';
import { prefersReducedMotion } from '../lib/motion';

/** Bingkai sudut + garis pindai. Dipakai di atas ilustrasi maupun foto pengguna. */
export function ScanOverlay({ active }: { active: boolean }) {
  return (
    <div className={`scan-overlay ${active ? 'is-active' : ''}`} aria-hidden="true">
      <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
      <span className="scan-line" />
    </div>
  );
}

type State = 'fresh' | 'stale';

/**
 * Apel yang dipindai berulang. Putaran: pindai -> hasil contoh -> ganti apel.
 * Hanya ilustrasi, bukan hasil dari model.
 */
export function AppleScan({ className = '', chip = true }: { className?: string; chip?: boolean }) {
  const [state, setState] = useState<State>('fresh');
  const [phase, setPhase] = useState<'scan' | 'result'>('scan');

  useEffect(() => {
    if (prefersReducedMotion()) { setPhase('result'); return; }
    let timer = 0;
    const run = (next: State) => {
      setState(next);
      setPhase('scan');
      timer = window.setTimeout(() => {
        setPhase('result');
        timer = window.setTimeout(() => run(next === 'fresh' ? 'stale' : 'fresh'), 3800);
      }, 3000);
    };
    timer = window.setTimeout(() => run('fresh'), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const fresh = state === 'fresh';
  return (
    <div className={`apple-scan ${className}`} data-phase={phase} data-state={state} aria-hidden="true">
      <div className="apple-scan-frame">
        <Apple state="fresh" className="apple-img apple-img-fresh" />
        <Apple state="stale" className="apple-img apple-img-stale" />
        <ScanOverlay active={phase === 'scan'} />
        <span className="spot spot-a" /><span className="spot spot-b" /><span className="spot spot-c" />
      </div>
      {chip && (
      <div className="scan-chip">
        <span className="scan-chip-icon">{fresh ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}</span>
        <span className="scan-chip-text">
          <b>{fresh ? 'Segar' : 'Tidak segar'}</b>
          <small>Contoh tampilan hasil</small>
        </span>
        <span className="scan-chip-meter"><span style={{ width: fresh ? '96%' : '91%' }} /></span>
      </div>
      )}
    </div>
  );
}
