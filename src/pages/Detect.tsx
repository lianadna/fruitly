import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Camera, CircleAlert, RotateCcw, Upload, X } from 'lucide-react';
import { predictFruit } from '../services/prediction';
import type { FruitCheckResult } from '../services/prediction';
import { ScanOverlay } from '../components/AppleScan';
import { InstallDialog } from '../components/InstallDialog';
import { LogoMark } from '../components/Illustrations';
import { installWasSkipped, isIos, isStandalone, rememberInstallSkipped, useCanInstall } from '../lib/pwa';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MIN_SCAN_MS = 1600; // supaya animasi pindai sempat terlihat walau hasilnya cepat
const MAX_CAPTURE = 1280; // sisi terpanjang hasil jepretan, supaya ukuran file tetap kecil

type Facing = 'environment' | 'user';
type CamState = 'starting' | 'live' | 'blocked' | 'unsupported';

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

/** Ikon balik kamera (dua panah melingkar di sekitar lensa). */
function FlipIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
      <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
      <circle cx="12" cy="12" r="3" />
      <path d="m18 22-3-3 3-3" />
      <path d="m6 2 3 3-3 3" />
    </svg>
  );
}

export function Detect() {
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const runRef = useRef(0);

  const [facing, setFacing] = useState<Facing>('environment');
  const [camState, setCamState] = useState<CamState>('starting');
  const [attempt, setAttempt] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<FruitCheckResult | null>(null);
  const [fillBar, setFillBar] = useState(false);

  /* ---------- Dialog install ---------- */
  const canInstall = useCanInstall();
  const [installDone, setInstallDone] = useState(() => installWasSkipped());
  const installAvailable = !isStandalone() && (canInstall || isIos());
  const installOpen = installAvailable && !installDone;
  const finishInstall = useCallback(() => { rememberInstallSkipped(); setInstallDone(true); }, []);

  /* ---------- Layar penuh: kunci gulir halaman ---------- */
  useEffect(() => {
    document.documentElement.classList.add('cam-lock');
    return () => document.documentElement.classList.remove('cam-lock');
  }, []);

  /* ---------- Kamera ---------- */
  useEffect(() => {
    if (file || installOpen) return;
    if (!navigator.mediaDevices?.getUserMedia) { setCamState('unsupported'); return; }
    let cancelled = false;
    setCamState('starting');
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((track) => track.stop()); return; }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) { video.srcObject = stream; video.play().catch(() => {}); }
        setCamState('live');
      })
      .catch(() => { if (!cancelled) setCamState('blocked'); });
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [facing, file, installOpen, attempt]);

  /* ---------- Pratinjau foto ---------- */
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    setFillBar(false);
    if (!result || result.label === 'no-fruit') return;
    const id = window.setTimeout(() => setFillBar(true), 80);
    return () => window.clearTimeout(id);
  }, [result]);

  /* ---------- Analisis ---------- */
  const analyze = async (target: File) => {
    const run = ++runRef.current;
    setProcessing(true); setError(''); setResult(null);
    try {
      const [prediction] = await Promise.all([predictFruit(target), wait(MIN_SCAN_MS)]);
      if (run === runRef.current) setResult(prediction);
    } catch (err) {
      if (run === runRef.current) setError(err instanceof Error ? err.message : 'Foto belum bisa diperiksa. Coba lagi sebentar lagi.');
    } finally {
      if (run === runRef.current) setProcessing(false);
    }
  };

  const selectFile = (candidate?: File) => {
    setError(''); setResult(null);
    if (!candidate) return;
    if (!ALLOWED_TYPES.includes(candidate.type)) { setError('Format belum didukung. Pakai foto JPG, PNG, atau WEBP.'); return; }
    if (candidate.size > MAX_FILE_SIZE) { setError('Ukuran foto lebih dari 5 MB. Coba foto yang lebih kecil.'); return; }
    setFile(candidate);
    void analyze(candidate);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => { selectFile(event.target.files?.[0]); event.target.value = ''; };

  const reset = () => { runRef.current += 1; setFile(null); setResult(null); setError(''); setProcessing(false); };

  /** Ambil bagian video yang ada di dalam bingkai, persis seperti yang terlihat pengguna. */
  const capture = () => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !frame || camState !== 'live' || !video.videoWidth) return;

    const vr = video.getBoundingClientRect();
    const fr = frame.getBoundingClientRect();
    const scale = Math.max(vr.width / video.videoWidth, vr.height / video.videoHeight); // object-fit: cover
    const offX = (vr.width - video.videoWidth * scale) / 2;
    const offY = (vr.height - video.videoHeight * scale) / 2;
    const sx = Math.max(0, (fr.left - vr.left - offX) / scale);
    const sy = Math.max(0, (fr.top - vr.top - offY) / scale);
    const sw = Math.min(video.videoWidth - sx, fr.width / scale);
    const sh = Math.min(video.videoHeight - sy, fr.height / scale);

    const out = Math.min(MAX_CAPTURE, Math.round(Math.max(sw, sh)));
    const canvas = document.createElement('canvas');
    canvas.width = out; canvas.height = out;
    canvas.getContext('2d')?.drawImage(video, sx, sy, sw, sh, 0, 0, out, out);
    canvas.toBlob((blob) => {
      if (!blob) { setError('Foto belum bisa diambil. Coba lagi.'); return; }
      selectFile(new File([blob], `fruitly-${Date.now()}.jpg`, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.92);
  };

  const fresh = result?.label === 'fresh';
  const noFruit = result?.label === 'no-fruit';
  const hasPhoto = file !== null;
  const camBlocked = camState === 'blocked' || camState === 'unsupported';

  return (
    <div className="cam-page">
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onInputChange} className="visually-hidden" aria-label="Pilih foto buah dari galeri" tabIndex={-1} />

      {/* ---------- Layar kamera / foto ---------- */}
      <div className="cam-stage">
        <video ref={videoRef} className={`cam-video ${facing === 'user' ? 'is-mirrored' : ''} ${camState === 'live' && !hasPhoto ? 'is-live' : ''}`} playsInline muted autoPlay aria-label="Pratinjau kamera" />

        {!hasPhoto && (
          <div className="cam-guide">
            {camBlocked ? (
              <div className="cam-message" role="status">
                <Camera size={34} aria-hidden="true" />
                <h2>Kamera belum bisa dibuka</h2>
                <p>{camState === 'unsupported'
                  ? 'Browser ini tidak mendukung kamera. Kamu tetap bisa unggah foto dari galeri.'
                  : 'Izinkan akses kamera di pengaturan browser, atau unggah foto dari galeri.'}</p>
                {camState === 'blocked' && <button type="button" className="btn btn-lime btn-sm" onClick={() => setAttempt((n) => n + 1)}><span>Coba lagi</span></button>}
              </div>
            ) : (
              <>
                <div ref={frameRef} className="cam-frame" aria-hidden="true">
                  <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
                </div>
                <p className="cam-hint">Taruh buah di tengah bingkai</p>
              </>
            )}
          </div>
        )}

        {hasPhoto && (
          <div className="cam-photo">
            <div className="cam-photo-frame">
              {preview && <img src={preview} alt="Foto yang diperiksa" className={processing ? 'is-scanning' : ''} />}
              <ScanOverlay active={processing} />
            </div>
          </div>
        )}
      </div>

      {/* ---------- Logo ---------- */}
      <header className="cam-top">
        <Link to="/" className="cam-logo" aria-label="Fruitly, ke beranda">
          <LogoMark size={30} />
          <span>Fruitly</span>
        </Link>
      </header>

      {/* ---------- Tombol kamera ---------- */}
      {!hasPhoto && (
        <div className="cam-bottom">
          {error && (
            <div className="cam-toast" role="alert">
              <CircleAlert size={18} /><span>{error}</span>
              <button type="button" onClick={() => setError('')} aria-label="Tutup pesan"><X size={16} /></button>
            </div>
          )}
          <div className="cam-controls">
            <button type="button" className="cam-side" onClick={() => fileRef.current?.click()}>
              <span className="cam-side-icon"><Upload size={24} /></span>
              <span className="cam-side-label">Unggah</span>
            </button>

            <button type="button" className="cam-shutter" onClick={capture} disabled={camState !== 'live'} aria-label="Ambil foto">
              <span><Camera size={30} /></span>
            </button>

            <button type="button" className="cam-side" onClick={() => setFacing((f) => (f === 'environment' ? 'user' : 'environment'))} disabled={camState === 'unsupported'}>
              <span className="cam-side-icon"><FlipIcon /></span>
              <span className="cam-side-label">Balik</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------- Hasil ---------- */}
      {hasPhoto && (
        <section className="cam-sheet" aria-live="polite" aria-label="Hasil pemeriksaan">
          {processing ? (
            <div className="sheet-loading">
              <span className="spinner" />
              <div><b>Memeriksa foto…</b><p>Mencari buah dan mengecek kesegarannya.</p></div>
            </div>
          ) : result && result.label !== 'no-fruit' ? (
            <div className={`result-card ${fresh ? 'is-fresh' : 'is-stale'}`} key={`${result.label}-${result.confidence}`}>
              <span className={`pill ${fresh ? 'pill-lime' : 'pill-red'} result-pill`}>{fresh ? 'Segar' : 'Tidak segar'}</span>
              <h3>{fresh ? 'Buahmu tampak segar.' : 'Buahmu tampak tidak segar.'}</h3>
              <div className="meter">
                <div className="meter-head"><span>Tingkat keyakinan</span><b><CountUp value={result.confidence * 100} /></b></div>
                <div className="meter-track"><span style={{ width: fillBar ? `${result.confidence * 100}%` : '0%' }} /></div>
              </div>
              <p className="result-note">Hasil ini perkiraan dari tampilan foto. Cek juga aroma dan teksturnya sebelum dimakan.</p>
              <button type="button" className="btn btn-olive btn-block" onClick={reset}><RotateCcw size={18} /><span>Foto lagi</span></button>
            </div>
          ) : (
            <div className="sheet-error" role={noFruit ? undefined : 'alert'}>
              <div className="error-message">
                <CircleAlert size={18} aria-hidden="true" />
                <span>{noFruit ? 'Buah tidak terdeteksi. Coba foto satu apel, jeruk, atau pisang dari dekat.' : error || 'Foto belum bisa diperiksa.'}</span>
              </div>
              <div className="sheet-actions">
                {!noFruit && <button type="button" className="btn btn-olive btn-sm" onClick={() => file && void analyze(file)}><span>Coba lagi</span></button>}
                <button type="button" className={`btn btn-sm ${noFruit ? 'btn-olive' : 'btn-ghost'}`} onClick={reset}><span>Foto lagi</span></button>
              </div>
            </div>
          )}
        </section>
      )}

      {installOpen && <InstallDialog onDone={finishInstall} />}
    </div>
  );
}
