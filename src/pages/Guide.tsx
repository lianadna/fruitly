import { useState } from 'react';
import { Check, ChevronDown, Focus, Image as ImageIcon, Sun, X } from 'lucide-react';
import { CtaBand } from '../components/CtaBand';
import { Reveal } from '../components/Reveal';
import { fruitPhotos, localPhotos } from '../lib/photos';

const howTo = [
  { title: 'Mulai pengecekan', text: 'Ketuk “Mulai cek buah”. Kalau mau memotret langsung, izinkan akses kamera saat diminta.' },
  { title: 'Ambil atau unggah foto', text: 'Ketuk tombol tengah untuk memotret atau tombol kiri untuk memilih foto dari galeri.' },
  { title: 'Tunggu sebentar', text: 'Fruitly langsung mengecek foto yang kamu pilih atau ambil.' },
  { title: 'Baca hasilnya', text: 'Hasilnya akan muncul sebagai Segar atau Tidak segar.' },
];

const tips = [
  {
    icon: Sun,
    title: 'Cahaya',
    instruction: 'Coba foto dekat jendela supaya buah kelihatan jelas.',
    photo: fruitPhotos.apple,
    goodCaption: 'Terang dan merata',
    badCaption: 'Terlalu gelap',
    example: 'dark',
  },
  {
    icon: Focus,
    title: 'Posisi',
    instruction: 'Dekatkan kamera sampai tekstur kulit buah terlihat jelas.',
    photo: fruitPhotos.orange,
    goodCaption: 'Buah memenuhi bingkai',
    badCaption: 'Buah terlalu jauh',
    example: 'far',
  },
  {
    icon: ImageIcon,
    title: 'Latar',
    instruction: 'Letakkan satu buah di permukaan yang polos.',
    photo: fruitPhotos.banana,
    badPhoto: localPhotos.table,
    goodCaption: 'Satu buah, latar polos',
    badCaption: 'Banyak benda di sekitar buah',
    example: 'busy',
  },
];

const faqs = [
  { q: 'Kalau hasilnya Segar, buahnya pasti aman dimakan?', a: 'Belum tentu. Fruitly cuma melihat bagian buah yang tampak di foto. Sebelum dimakan, cek juga aroma, tekstur, dan bagian dalamnya.' },
  { q: 'Buah apa saja yang bisa dicek?', a: 'Fruitly dibuat untuk mengecek apel, jeruk, dan pisang.' },
  { q: 'Kenapa hasilnya beda dari yang aku kira?', a: 'Coba cek fotonya. Kalau buram, gelap, atau buahnya terlalu kecil di layar, ambil ulang dari dekat di tempat yang lebih terang.' },
  { q: 'Foto apa yang bisa diunggah?', a: 'JPG, PNG, dan WEBP dengan ukuran maksimal 5 MB.' },
];

function Frame({ good, caption, photo, example = '' }: { good: boolean; caption: string; photo: string; example?: string }) {
  return (
    <figure className="tip-frame">
      <div className={`tip-shot ${example}`}>
        <img src={photo} alt="" loading="lazy" />
        <span className={`tip-badge ${good ? '' : 'is-bad'}`} aria-hidden="true">
          {good ? <Check size={17} strokeWidth={3} /> : <X size={17} strokeWidth={3} />}
        </span>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function Guide() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="fruitly-landing">
      <div className="container guide-start">
        <header className="guide-intro">
          <h1 className="content-title" id="guide-title">Panduan cek buah</h1>
          <p>Siapkan satu apel, jeruk, atau pisang yang ingin kamu cek.</p>
          <nav aria-label="Isi panduan">
            <ul className="guide-index">
              <li><a href="#cara-pakai">Langkah cek buah</a></li>
              <li><a href="#tips-foto">Tips foto</a></li>
              <li><a href="#baca-hasil">Cara membaca hasil</a></li>
              <li><a href="#faq">Tanya jawab</a></li>
            </ul>
          </nav>
        </header>

        <section className="guide-steps" id="cara-pakai" aria-labelledby="guide-steps-title">
          <h2 id="guide-steps-title">Langkah cek buah</h2>
          <ol className="lp-steps guide-step-list" role="list">
            {howTo.map(({ title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 80}>
                <span className="lp-step-icon" aria-hidden="true">{i + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </Reveal>
            ))}
          </ol>
        </section>
      </div>

      <section className="guide-tips" id="tips-foto" aria-labelledby="guide-tips-title">
        <div className="container">
          <div className="lp-head">
            <h2 className="lp-h2" id="guide-tips-title">Tips foto</h2>
          </div>
          <div className="guide-tip-grid">
            {tips.map(({ icon: Icon, title, instruction, photo, badPhoto, goodCaption, badCaption, example }, i) => (
              <Reveal as="article" variant="rise" key={title} delay={i * 85} className="content-card guide-tip">
                <h3><Icon size={22} aria-hidden="true" />{title}</h3>
                <p>{instruction}</p>
                <div className="tip-pair">
                  <Frame good caption={goodCaption} photo={photo} />
                  <Frame good={false} caption={badCaption} photo={badPhoto ?? photo} example={example} />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal as="p" className="lp-muted guide-tip-note">Hindari filter. Kalau ada bercak atau bagian yang keriput, pastikan bagian itu ikut terlihat.</Reveal>
        </div>
      </section>

      <section className="lp-results" id="baca-hasil" aria-labelledby="guide-results-title">
        <div className="container">
          <h2 className="lp-h2" id="guide-results-title">Cara membaca hasil</h2>
          <div className="lp-result-grid">
            <Reveal as="article" className="lp-result content-hover">
              <h3><span className="lp-status fresh" aria-hidden="true" />Segar</h3>
              <p>Buah terlihat segar di foto. Contohnya, warnanya masih cerah dan kulitnya mulus.</p>
            </Reveal>
            <Reveal as="article" delay={100} className="lp-result content-hover">
              <h3><span className="lp-status stale" aria-hidden="true" />Tidak segar</h3>
              <p>Ada tanda buah mulai rusak, misalnya bercak gelap, warna kusam, atau kulit keriput.</p>
            </Reveal>
          </div>
          <Reveal as="p" className="lp-muted guide-result-note">Angka persen menunjukkan seberapa yakin Fruitly dengan hasilnya. Kalau angkanya rendah, coba ambil foto yang lebih jelas.</Reveal>
        </div>
      </section>

      <section className="section" id="faq" aria-labelledby="faq-title">
        <div className="container faq-wrap">
          <h2 className="lp-h2" id="faq-title">Tanya jawab</h2>
          <div className="faq-list">
            {faqs.map(({ q, a }, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={q} delay={i * 70} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                  <h3>
                    <button type="button" aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                      <span>{q}</span><ChevronDown size={21} aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="faq-answer" id={`faq-${i}`} aria-hidden={!isOpen}><div><p>{a}</p></div></div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand title="Cek buahmu" text="Kamu bisa pakai kamera atau foto yang sudah ada di galeri." />
    </div>
  );
}
