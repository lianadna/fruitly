import { Apple, Doodle, Slice } from '../components/Illustrations';
import { CtaBand } from '../components/CtaBand';
import { Drift, Lines, Reveal } from '../components/Reveal';

const pipeline = [
  { title: 'Foto masuk', text: 'Gambar yang kamu unggah dibaca oleh sistem.', tone: 'red' },
  { title: 'Disiapkan', text: 'Ukurannya diseragamkan dan nilai warnanya diatur supaya cocok dengan model.', tone: 'lime' },
  { title: 'Dianalisis', text: 'Model mencari pola di gambar: tepi, warna, tekstur, sampai bercak kecil.', tone: 'red' },
  { title: 'Hasil keluar', text: 'Model memilih segar atau tidak segar, lalu menampilkan persentase keyakinannya.', tone: 'lime' },
];

const limits = [
  'Hasil hanya berdasarkan tampilan foto. Aroma, rasa, dan bagian dalam buah tidak ikut dinilai.',
  'Foto yang buram, gelap, atau terlalu jauh bisa membuat hasil kurang tepat.',
  'Fruitly bukan penentu aman atau tidaknya buah untuk dimakan.',
];

export function About() {
  return (
    <div className="about-page">
      <section className="page-head page-head-blob">
        <div className="head-blob" aria-hidden="true" />
        <Drift className="deco head-melon" speed={0.1}><Slice kind="watermelon" className="slice" /></Drift>
        <Drift className="deco head-pineapple" speed={0.07}><Doodle kind="pineapple" className="doodle" /></Drift>
        <div className="container">
          <h1 className="display-sm"><Lines lines={['Tentang', 'Fruitly']} /></h1>
          <Reveal as="p" className="lead" delay={300}>Fruitly adalah aplikasi web untuk mengecek kesegaran buah dari foto. Unggah gambar, dan sistem akan memberi tahu apakah buah tampak segar atau tidak.</Reveal>
        </div>
      </section>

      <section className="section about-why">
        <div className="container two-col">
          <Reveal variant="left" className="text-block">
            <span className="pill pill-red">Kenapa ada Fruitly</span>
            <p>Menilai kesegaran buah biasanya mengandalkan mata dan tangan. Fruitly menawarkan cara yang lebih praktis: cukup foto, lalu lihat hasilnya.</p>
            <span className="rule rule-red"><span /></span>
          </Reveal>
          <Reveal variant="right" delay={140} className="text-block">
            <span className="pill pill-lime">Untuk siapa</span>
            <p>Siapa saja yang ingin cek buah sebelum membeli, menyimpan, atau memakannya. Tidak perlu pasang aplikasi tambahan, cukup buka lewat browser.</p>
            <span className="rule rule-olive"><span /></span>
          </Reveal>
        </div>
      </section>

      <section className="section steps about-flow">
        <div className="container">
          <div className="section-head">
            <h2 className="h2"><Lines lines={['Dari foto', 'sampai hasil']} /></h2>
            <Reveal as="p" className="lead" delay={200}>Empat tahap berjalan otomatis setiap kali kamu mengambil atau mengunggah foto.</Reveal>
          </div>
          <div className="steps-wrap">
            <Reveal variant="draw" className="rule rule-red steps-line"><span /></Reveal>
            <ol className="steps-list steps-4">
              {pipeline.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 140} className="step">
                  <span className="step-node">{i + 1}</span>
                  <span className={`pill pill-${step.tone}`}>{step.title}</span>
                  <p>{step.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section cnn">
        <div className="container cnn-grid">
          <Reveal variant="left" className="cnn-visual">
            <div className="kernel-demo" aria-hidden="true">
              <Apple state="fresh" className="kernel-apple" />
              <span className="kernel-grid" />
              <span className="kernel-row"><span className="kernel-box" /></span>
            </div>
            <p className="caption">Filter kecil bergeser di atas gambar untuk mencari pola.</p>
          </Reveal>
          <div className="cnn-copy">
            <h2 className="h2"><Lines lines={['Apa itu', 'CNN?']} /></h2>
            <Reveal as="p" className="lead" delay={200}>CNN (Convolutional Neural Network) adalah jenis model deep learning yang dirancang untuk memahami gambar.</Reveal>
            <Reveal as="p" delay={300}>Model belajar dari banyak contoh foto buah segar dan tidak segar. Lama-lama ia bisa membedakan keduanya sendiri, misalnya lewat warna yang pudar, kulit yang keriput, atau bercak gelap.</Reveal>
            <Reveal as="p" delay={380}>Sumber data latih: <a className="inline-link" href="https://www.kaggle.com/datasets/swoyam2609/fresh-and-stale-classification/data" target="_blank" rel="noreferrer">Fresh and Stale Classification di Kaggle</a>.</Reveal>
          </div>
        </div>
      </section>

      <section className="section limits">
        <div className="container">
          <div className="section-head">
            <h2 className="h2"><Lines lines={['Yang perlu', 'kamu tahu']} /></h2>
          </div>
          <div className="limits-grid">
            {limits.map((text, i) => (
              <Reveal key={text} delay={i * 130} className="limit">
                <span className="rule rule-lime"><span /></span>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Sudah paham? Coba dengan fotomu." text="Pilih satu buah dan lihat hasilnya." />
    </div>
  );
}
