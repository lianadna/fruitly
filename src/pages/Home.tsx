import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { AppleScan } from '../components/AppleScan';
import { Apple, Doodle, Slice } from '../components/Illustrations';
import { CtaBand } from '../components/CtaBand';
import { Drift, Lines, Reveal } from '../components/Reveal';

const steps = [
  { title: 'Unggah foto', text: 'Pilih foto dari galeri, atau ambil langsung dengan kamera ponsel.', tone: 'red' },
  { title: 'Tunggu sebentar', text: 'Fruitly memeriksa warna, tekstur, dan bercak yang terlihat di foto.', tone: 'lime' },
  { title: 'Lihat hasilnya', text: 'Hasil segar atau tidak segar muncul, lengkap dengan persentase keyakinan.', tone: 'red' },
];

export function Home() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero">
        <div className="hero-arc" aria-hidden="true" />

        <Drift className="deco hero-lemon" speed={0.1}><Slice kind="lemon" className="slice" /></Drift>
        <Drift className="deco hero-orange" speed={0.16}><Slice kind="orange" className="slice" /></Drift>
        <Drift className="deco hero-kiwi" speed={0.08}><Slice kind="kiwi" className="slice" /></Drift>
        <Drift className="deco hero-cherry" speed={0.05}><Doodle kind="cherry" className="doodle" /></Drift>
        <Drift className="deco hero-banana" speed={0.12}><Doodle kind="banana" className="doodle" /></Drift>

        <div className="container hero-inner">
          <div className="hero-copy">
            <h1 className="display"><Lines lines={['Buahnya', 'masih', 'segar?']} delay={80} /></h1>
            <Reveal as="p" className="lead" delay={460}>Foto buahnya, unggah ke Fruitly, lalu lihat hasilnya: segar atau tidak.</Reveal>
            <Reveal className="hero-actions" delay={580}>
              <Link className="btn btn-red" to="/detect"><span>Coba Fruitly</span><ArrowUpRight size={20} /></Link>
              <Link className="btn btn-ghost" to="/guide"><span>Baca panduan</span></Link>
            </Reveal>
          </div>

          <div className="hero-stage">
            <AppleScan />
          </div>
        </div>

        <Reveal variant="draw" className="rule rule-red hero-rule" delay={700}><span /></Reveal>
      </section>

      {/* ---------------- Dua hasil ---------------- */}
      <section className="section compare">
        <Drift className="deco compare-lemon" speed={0.1}><Slice kind="lemon" className="slice" /></Drift>
        <div className="container">
          <div className="section-head">
            <h2 className="h2"><Lines lines={['Segar atau', 'tidak segar']} /></h2>
            <Reveal as="p" className="lead" delay={200}>Fruitly melihat warna, tekstur, dan bercak pada foto, lalu memberi satu dari dua hasil.</Reveal>
          </div>

          <div className="compare-grid">
            <Reveal as="article" variant="rise" className="compare-item is-fresh">
              <div className="compare-visual">
                <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
                <Apple state="fresh" className="compare-apple" title="Apel segar dengan kulit mulus" />
                <span className="pill pill-lime">Segar</span>
              </div>
              <p>Warna cerah dan merata, kulit mulus dan mengilap, tidak ada bagian yang lembek.</p>
            </Reveal>

            <Reveal as="article" variant="rise" delay={140} className="compare-item is-stale">
              <div className="compare-visual">
                <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
                <Apple state="stale" className="compare-apple" title="Apel tidak segar dengan bercak cokelat" />
                <span className="pill pill-red">Tidak segar</span>
              </div>
              <p>Ada bercak cokelat atau hitam, warna tampak kusam, kulit keriput atau mulai lembek.</p>
            </Reveal>
          </div>

          <Reveal className="note">
            <span className="rule rule-lime"><span /></span>
            <p>Hasil ini perkiraan awal dari tampilan foto. Sebelum dimakan, tetap cek aroma dan teksturnya langsung.</p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Cara kerja ---------------- */}
      <section className="section steps">
        <div className="steps-blob" aria-hidden="true" />
        <Drift className="deco steps-melon" speed={0.12}><Slice kind="watermelon" className="slice" /></Drift>
        <Drift className="deco steps-pear" speed={0.06}><Doodle kind="pear" className="doodle" /></Drift>

        <div className="container">
          <div className="section-head">
            <h2 className="h2"><Lines lines={['Cukup tiga', 'langkah']} /></h2>
          </div>

          <div className="steps-wrap">
            <Reveal variant="draw" className="rule rule-red steps-line"><span /></Reveal>
            <ol className="steps-list">
              {steps.map((step, i) => (
                <Reveal as="li" key={step.title} variant="up" delay={i * 160} className="step">
                  <span className="step-node">{i + 1}</span>
                  <span className={`pill pill-${step.tone}`}>{step.title}</span>
                  <p>{step.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <CtaBand title="Ragu sama buah di dapurmu?" text="Foto sekarang dan lihat hasilnya." />
    </>
  );
}
