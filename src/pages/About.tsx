import { Camera, CircleAlert, ClipboardCheck, ScanLine, SlidersHorizontal, Sun } from 'lucide-react';
import { CtaBand } from '../components/CtaBand';
import { Reveal } from '../components/Reveal';
import { fruitPhotos } from '../lib/photos';

const pipeline = [
  { icon: Camera, title: 'Pilih foto', text: 'Ambil foto dari kamera atau pilih dari galeri.' },
  { icon: SlidersHorizontal, title: 'Ukuran foto disesuaikan', text: 'Fruitly mengubah ukuran foto sebelum membacanya.' },
  { icon: ScanLine, title: 'Kulit buah diperiksa', text: 'Fruitly melihat warna, tekstur kulit, dan bercak pada buah.' },
  { icon: ClipboardCheck, title: 'Hasil muncul', text: 'Kamu akan melihat hasil Segar atau Tidak segar beserta persentase keyakinannya.' },
];

const limits = [
  { icon: Camera, title: 'Yang terlihat di foto', text: 'Fruitly hanya bisa menilai bagian buah yang terlihat di foto.' },
  { icon: Sun, title: 'Foto yang jelas membantu', text: 'Kalau fotonya gelap, buram, atau terlalu jauh, coba ambil ulang.' },
  { icon: CircleAlert, title: 'Cek buah secara langsung', text: 'Sebelum dimakan, cek juga aroma, tekstur, dan bagian dalam buah.' },
];

export function About() {
  return (
    <div className="fruitly-landing">
      <header className="about-intro">
        <div className="container">
          <h1 className="content-title" id="about-title">Tentang Fruitly</h1>
          <p>Dengan Fruitly, kamu bisa cek perkiraan kesegaran apel, jeruk, atau pisang lewat foto.</p>
        </div>
      </header>

      <section className="section about-flow" id="cara-kerja" aria-labelledby="about-flow-title">
        <div className="container">
          <div className="lp-head">
            <h2 className="lp-h2" id="about-flow-title">Cara kerja Fruitly</h2>
          </div>
          <ol className="about-flow-list" role="list">
            {pipeline.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} variant="up" delay={i * 80} className="content-card about-flow-card">
                <div className="about-flow-meta">
                  <span className="content-icon"><Icon size={23} aria-hidden="true" /></span>
                  <span aria-hidden="true">{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container" aria-labelledby="cnn-title">
        <div className="lp-how-card">
          <Reveal as="figure" variant="pop" className="cnn-visual">
            <div className="kernel-demo" aria-hidden="true">
              <img src={fruitPhotos.apple} alt="" className="kernel-apple" loading="lazy" />
              <span className="kernel-grid" />
              <span className="kernel-row"><span className="kernel-box" /></span>
            </div>
            <figcaption>Ilustrasi cara Fruitly memeriksa foto bagian demi bagian.</figcaption>
          </Reveal>
          <div className="cnn-copy">
            <h2 className="lp-h2" id="cnn-title">Apa yang Fruitly lihat?</h2>
            <Reveal as="p">Fruitly memakai model bernama CNN (Convolutional Neural Network). Model ini belajar dari contoh foto buah segar dan tidak segar.</Reveal>
            <Reveal as="p" delay={90}>Beberapa ciri yang bisa dikenali antara lain warna kusam, kulit keriput, dan bercak gelap.</Reveal>
            <Reveal delay={160}>
              <a className="lp-link" href="https://www.kaggle.com/datasets/swoyam2609/fresh-and-stale-classification/data" target="_blank" rel="noreferrer">Lihat data latih di Kaggle</a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="limits-title">
        <div className="container">
          <div className="lp-head">
            <h2 className="lp-h2" id="limits-title">Batas pengecekan</h2>
          </div>
          <div className="lp-tip-grid">
            {limits.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="article" key={title} delay={i * 90} className="lp-tip-card content-hover">
                <Icon size={24} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Punya buah yang mau dicek?" text="Ambil foto buahnya atau pilih yang sudah ada di galeri." />
    </div>
  );
}
