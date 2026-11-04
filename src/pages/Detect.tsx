import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, CircleAlert, RotateCcw, ScanLine, X } from 'lucide-react';
import { isDemoMode, predictFruit } from '../services/prediction';
import type { FruitLabel, Prediction } from '../services/prediction';
import { AppleScan, ScanOverlay } from '../components/AppleScan';
import { Doodle, Slice } from '../components/Illustrations';
import { Drift, Lines, Reveal } from '../components/Reveal';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MIN_SCAN_MS = 1600; // supaya animasi pindai sempat terlihat walau hasilnya cepat

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** Angka yang naik pelan dari 0 ke nilai akhir. */
function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(value); return; }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setShown(value * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{shown.toFixed(1)}%</>;
}

export function Detect() {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Prediction | null>(null);
  const [fillBar, setFillBar] = useState(false);
  const [demoLabel, setDemoLabel] = useState<FruitLabel>('fresh');

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    setFillBar(false);
    if (!result) return;
    const id = window.setTimeout(() => setFillBar(true), 80);
    // Kalau panel hasil tidak terlihat penuh, gulung ke sana supaya hasilnya tidak terlewat.
    const panel = resultRef.current?.closest('.result-panel');
    if (panel) {
      const rect = panel.getBoundingClientRect();
      if (rect.top < 72 || rect.bottom > window.innerHeight) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return () => window.clearTimeout(id);
  }, [result]);

  const selectFile = (candidate?: File) => {
    setError(''); setResult(null);
    if (!candidate) return;
    if (!ALLOWED_TYPES.includes(candidate.type)) { setError('Format belum didukung. Pakai foto JPG, PNG, atau WEBP.'); return; }
    if (candidate.size > MAX_FILE_SIZE) { setError('Ukuran foto lebih dari 5 MB. Coba foto yang lebih kecil.'); return; }
    setFile(candidate);
  };
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => { selectFile(event.target.files?.[0]); event.target.value = ''; };
  const onDrop = (event: DragEvent<HTMLElement>) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files[0]); };
  const reset = () => { setFile(null); setError(''); setResult(null); setProcessing(false); };

  const analyze = async () => {
    if (!file || processing) return;
    setProcessing(true); setError(''); setResult(null);
    try {
      const [prediction] = await Promise.all([predictFruit(file, demoLabel), wait(MIN_SCAN_MS)]);
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Foto belum bisa diperiksa. Coba lagi sebentar lagi.');
    } finally {
      setProcessing(false);
    }
  };

  const fresh = result?.label === 'fresh';

  return (
    <div className="detect-page">
      <section className="page-head">
        <Drift className="deco head-orange" speed={0.12}><Slice kind="orange" className="slice" /></Drift>
        <Drift className="deco head-cherry" speed={0.06}><Doodle kind="cherry" className="doodle" /></Drift>
        <div className="container">
          <h1 className="display-sm"><Lines lines={['Deteksi kesegaran buah']} /></h1>
          <Reveal as="p" className="lead" delay={300}>Unggah satu foto buah. Hasilnya langsung tampil di sebelahnya.</Reveal>
        </div>
      </section>

      <section className="workspace">
        <div className="container workspace-grid">
          {/* ------------- Unggah ------------- */}
          <Reveal as="div" variant="left" className="panel upload-panel">
            <h2 className="panel-title">Foto buah</h2>

            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onInputChange} className="visually-hidden" aria-label="Pilih foto buah" tabIndex={-1} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={onInputChange} className="visually-hidden" aria-label="Ambil foto buah dengan kamera" tabIndex={-1} />

            {!file ? (
              <div
                className={`dropzone ${dragging ? 'is-dragging' : ''}`}
                role="button"
                tabIndex={0}
                aria-label="Pilih foto buah dari perangkat"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
                onDrop={onDrop}
              >
                <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
                <Doodle kind="apple" className="doodle dropzone-apple" />
                <h3><span className="hide-touch">Seret foto ke sini</span><span className="show-touch">Unggah foto buah</span></h3>
                <p><span className="hide-touch">atau pilih dari perangkatmu</span><span className="show-touch">dari galeri atau kamera</span></p>
                <div className="dropzone-actions">
                  <span className="btn btn-olive btn-sm"><span>Pilih foto</span></span>
                  <button type="button" className="btn btn-ghost btn-sm only-touch" onClick={(e) => { e.stopPropagation(); cameraRef.current?.click(); }}>
                    <Camera size={18} /><span>Ambil foto</span>
                  </button>
                </div>
                <small>JPG, PNG, atau WEBP. Maksimal 5 MB.</small>
              </div>
            ) : (
              <div className="preview">
                <div className={`preview-frame ${processing ? 'is-scanning' : ''}`}>
                  {preview && <img src={preview} alt="Foto buah yang diunggah" />}
                  <ScanOverlay active={processing} />
                  {!processing && <button type="button" onClick={reset} className="remove-image" aria-label="Hapus foto"><X size={18} /></button>}
                </div>
                <div className="preview-detail">
                  <div><b>{file.name}</b><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></div>
                  <button type="button" onClick={() => inputRef.current?.click()} className="link-button" disabled={processing}>Ganti foto</button>
                </div>
              </div>
            )}

            {error && <div className="error-message" role="alert"><CircleAlert size={18} /><span>{error}</span></div>}

            {isDemoMode && (
              <div className="demo-box">
                <div>
                  <b>Mode demo</b>
                  <p>Model belum terhubung. Pilih contoh hasil yang ingin ditampilkan.</p>
                </div>
                <div className="segmented" role="group" aria-label="Contoh hasil">
                  <button type="button" aria-pressed={demoLabel === 'fresh'} onClick={() => { setDemoLabel('fresh'); setResult(null); }}>Segar</button>
                  <button type="button" aria-pressed={demoLabel === 'stale'} onClick={() => { setDemoLabel('stale'); setResult(null); }}>Tidak segar</button>
                </div>
              </div>
            )}

            <button type="button" className="btn btn-red btn-block" onClick={analyze} disabled={!file || processing}>
              {processing ? <><span className="spinner" /><span>Memeriksa foto…</span></> : <><ScanLine size={20} /><span>Periksa kesegaran</span></>}
            </button>
          </Reveal>

          {/* ------------- Hasil ------------- */}
          <Reveal as="div" variant="right" delay={120} className="panel result-panel">
            <h2 className="panel-title">Hasil</h2>
            <section ref={resultRef} className="result-body" aria-live="polite" aria-label="Hasil pemeriksaan">
              {processing ? (
                <div className="result-loading">
                  <span className="skeleton skeleton-pill" />
                  <span className="skeleton skeleton-line" />
                  <span className="skeleton skeleton-line short" />
                  <span className="skeleton skeleton-bar" />
                  <p>Memeriksa warna dan tekstur…</p>
                </div>
              ) : result ? (
                <div className={`result-card ${fresh ? 'is-fresh' : 'is-stale'}`} key={`${result.label}-${result.confidence}`}>
                  {result.isDemo && <span className="demo-tag">Contoh hasil</span>}
                  <span className={`pill ${fresh ? 'pill-lime' : 'pill-red'} result-pill`}>{fresh ? 'Segar' : 'Tidak segar'}</span>
                  <h3>{fresh ? 'Buahmu tampak segar.' : 'Buahmu tampak tidak segar.'}</h3>
                  <p>
                    {result.isDemo
                      ? 'Ini hanya contoh tampilan. Hasil dari fotomu baru muncul setelah model terhubung.'
                      : fresh
                        ? 'Warna dan permukaan buah terlihat baik di foto ini.'
                        : 'Foto ini menunjukkan tanda buah sudah tidak segar, seperti bercak atau warna yang kusam.'}
                  </p>
                  <div className="meter">
                    <div className="meter-head"><span>Tingkat keyakinan{result.isDemo ? ' (contoh)' : ''}</span><b><CountUp value={result.confidence * 100} /></b></div>
                    <div className="meter-track"><span style={{ width: fillBar ? `${result.confidence * 100}%` : '0%' }} /></div>
                  </div>
                  <p className="result-note">Hasil ini perkiraan dari tampilan foto. Cek juga aroma dan teksturnya sebelum dimakan.</p>
                  <button className="link-button" type="button" onClick={reset}><RotateCcw size={16} /> Periksa foto lain</button>
                </div>
              ) : (
                <div className="result-empty">
                  <AppleScan className="apple-scan-compact" chip={false} />
                  <h3>Belum ada hasil</h3>
                  <p>Unggah foto, lalu tekan Periksa kesegaran.</p>
                </div>
              )}
            </section>
          </Reveal>
        </div>
      </section>

      <section className="detect-hint">
        <div className="container">
          <Reveal className="hint-row">
            <span className="rule rule-lime"><span /></span>
            <p>Hasilnya kurang pas? Coba foto ulang dengan cahaya cukup dan buah di tengah bingkai.</p>
            <Link className="text-link" to="/guide"><span>Lihat tips foto</span><ArrowRight size={18} /></Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
