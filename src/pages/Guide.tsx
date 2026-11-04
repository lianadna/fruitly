import { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Apple, Doodle, Slice } from '../components/Illustrations';
import { CtaBand } from '../components/CtaBand';
import { Drift, Lines, Reveal } from '../components/Reveal';

const howTo = [
  { title: 'Buka halaman Deteksi', text: 'Pilih Deteksi di menu atas, atau tekan Mulai deteksi.' },
  { title: 'Unggah foto', text: 'Pilih foto JPG, PNG, atau WEBP dengan ukuran maksimal 5 MB. Di ponsel, kamu bisa langsung ambil foto dengan kamera.' },
  { title: 'Tekan Periksa kesegaran', text: 'Tunggu sebentar sampai garis pindai selesai bergerak.' },
  { title: 'Baca hasilnya', text: 'Kamu akan melihat Segar atau Tidak segar, lengkap dengan persentase keyakinan.' },
];

const faqs = [
  { q: 'Apakah hasil Fruitly menjamin buah aman dimakan?', a: 'Tidak. Fruitly hanya menilai tampilan buah di foto. Aroma, rasa, dan kondisi bagian dalam tidak ikut dinilai, jadi tetap periksa langsung sebelum makan.' },
  { q: 'Buah apa saja yang bisa dicek?', a: 'Fruitly paling akurat untuk jenis buah yang ada di data latihnya. Buah lain tetap bisa dicoba, tapi hasilnya bisa kurang tepat.' },
  { q: 'Kenapa hasilnya tidak sesuai dugaanku?', a: 'Biasanya karena foto kurang jelas, terlalu gelap, atau buah tidak berada di tengah bingkai. Coba foto ulang dengan mengikuti tips di atas.' },
  { q: 'Format dan ukuran foto apa yang didukung?', a: 'JPG, PNG, dan WEBP dengan ukuran maksimal 5 MB.' },
];

function Frame({ good, caption, children }: { good: boolean; caption: string; children: React.ReactNode }) {
  return (
    <figure className={`tip-frame ${good ? 'is-good' : 'is-bad'}`}>
      <div className="tip-shot">
        {children}
        <span className="tip-badge" aria-label={good ? 'Contoh yang bagus' : 'Contoh yang sebaiknya dihindari'}>
          {good ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
        </span>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function Guide() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="guide-page">
      <section className="page-head">
        <Drift className="deco head-lemon" speed={0.1}><Slice kind="lemon" className="slice" /></Drift>
        <Drift className="deco head-strawberry" speed={0.06}><Doodle kind="strawberry" className="doodle" /></Drift>
        <div className="container">
          <h1 className="display-sm"><Lines lines={['Panduan']} /></h1>
          <Reveal as="p" className="lead" delay={240}>Cara memakai Fruitly dan tips supaya hasilnya lebih tepat.</Reveal>
        </div>
      </section>

      {/* ------------- Cara pakai ------------- */}
      <section className="section guide-how">
        <div className="container guide-how-grid">
          <div className="section-head">
            <h2 className="h2"><Lines lines={['Cara', 'memakainya']} /></h2>
          </div>
          <div className="how-wrap">
            <ol className="how-list">
              {howTo.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 110} className="how-item">
                  <span className="step-node">{i + 1}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ------------- Tips foto ------------- */}
      <section className="section guide-tips">
        <div className="container">
          <div className="section-head">
            <h2 className="h2"><Lines lines={['Tips', 'mengambil foto']} /></h2>
            <Reveal as="p" className="lead" delay={200}>Tiga hal ini paling berpengaruh pada hasil.</Reveal>
          </div>

          <div className="tips-grid">
            <Reveal variant="rise" className="tip">
              <span className="pill pill-red">Cahaya</span>
              <div className="tip-pair">
                <Frame good caption="Terang dan merata"><Apple state="fresh" className="tip-apple" /></Frame>
                <Frame good={false} caption="Gelap atau silau"><Apple state="fresh" className="tip-apple tip-apple-dark" /></Frame>
              </div>
            </Reveal>

            <Reveal variant="rise" delay={120} className="tip">
              <span className="pill pill-lime">Posisi</span>
              <div className="tip-pair">
                <Frame good caption="Di tengah, memenuhi bingkai"><Apple state="fresh" className="tip-apple" /></Frame>
                <Frame good={false} caption="Kecil dan terlalu jauh"><Apple state="fresh" className="tip-apple tip-apple-far" /></Frame>
              </div>
            </Reveal>

            <Reveal variant="rise" delay={240} className="tip">
              <span className="pill pill-red">Latar</span>
              <div className="tip-pair">
                <Frame good caption="Polos, satu buah"><Apple state="fresh" className="tip-apple" /></Frame>
                <Frame good={false} caption="Ramai, banyak benda">
                  <span className="tip-clutter" aria-hidden="true">
                    <Doodle kind="pear" className="doodle c1" /><Doodle kind="banana" className="doodle c2" /><Doodle kind="cherry" className="doodle c3" /><Doodle kind="strawberry" className="doodle c4" />
                  </span>
                  <Apple state="fresh" className="tip-apple tip-apple-mid" />
                </Frame>
              </div>
            </Reveal>
          </div>

          <ul className="extra-tips">
            {[
              'Tahan ponsel beberapa detik supaya fotonya tidak buram.',
              'Matikan filter dan mode kecantikan.',
              'Arahkan kamera ke sisi buah yang paling menunjukkan kondisinya, misalnya bagian yang ada bercak.',
            ].map((text, i) => (
              <Reveal as="li" key={text} delay={i * 110}><span className="rule rule-lime"><span /></span><span>{text}</span></Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------- Membaca hasil ------------- */}
      <section className="section guide-read">
        <div className="container">
          <div className="section-head">
            <h2 className="h2"><Lines lines={['Cara membaca', 'hasilnya']} /></h2>
          </div>
        </div>
        <div className="container two-col">
          <Reveal variant="left" className="text-block">
            <span className="pill pill-lime">Segar</span>
            <p>Buah di foto tampak baik: warna cerah, kulit mulus, tidak ada tanda kerusakan.</p>
          </Reveal>
          <Reveal variant="right" delay={140} className="text-block">
            <span className="pill pill-red">Tidak segar</span>
            <p>Ada tanda buah mulai rusak, seperti bercak gelap, warna kusam, atau kulit keriput.</p>
          </Reveal>
        </div>
        <div className="container">
          <Reveal className="note">
            <span className="rule rule-red"><span /></span>
            <p>Persentase menunjukkan seberapa yakin sistem dengan hasilnya. Kalau angkanya rendah, coba foto ulang dengan cahaya yang lebih baik.</p>
          </Reveal>
        </div>
      </section>

      {/* ------------- FAQ ------------- */}
      <section className="section guide-faq">
        <div className="container faq-wrap">
          <div className="section-head">
            <h2 className="h2"><Lines lines={['Pertanyaan', 'yang sering muncul']} /></h2>
          </div>
          <div className="faq-list">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={item.q} delay={i * 90} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                  <h3>
                    <button type="button" aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                      <span>{item.q}</span><ChevronDown size={22} />
                    </button>
                  </h3>
                  <div className="faq-answer" id={`faq-${i}`} role="region"><div><p>{item.a}</p></div></div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand title="Sudah siap? Coba dengan buahmu." text="Satu foto cukup untuk mulai." />
    </div>
  );
}
