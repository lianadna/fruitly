import { ArrowDown, ArrowUpRight, Camera, Focus, ScanLine, Sun, Image as ImageIcon, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Drift, Lines, Reveal } from '../components/Reveal';
import { fruitPhotos, localPhotos } from '../lib/photos';

const steps = [
  { icon: Camera, title: 'Ambil atau unggah foto', text: 'Gunakan kamera atau pilih satu foto dari galeri.' },
  { icon: ScanLine, title: 'Tunggu pemindaian', text: 'Fruitly menganalisis pola yang terlihat pada foto.' },
  { icon: ClipboardCheck, title: 'Baca hasilnya', text: 'Lihat perkiraan kondisi buah dan tingkat keyakinan model.' },
];

const fruits = [
  { name: 'Apel', photo: fruitPhotos.apple, tone: 'pink', text: 'Hadapkan sisi yang ada bercaknya ke kamera.' },
  { name: 'Jeruk', photo: fruitPhotos.orange, tone: 'sun', text: 'Ambil foto yang menampilkan tekstur kulitnya.' },
  { name: 'Pisang', photo: fruitPhotos.banana, tone: 'lime', text: 'Ambil satu pisang supaya kulitnya terlihat jelas.' },
];

const tips = [
  { icon: Sun, title: 'Cari cahaya yang merata', text: 'Dekat jendela biasanya cukup terang tanpa menimbulkan silau.' },
  { icon: Focus, title: 'Penuhi bingkai', text: 'Dekatkan kamera dan pastikan buah terlihat tajam.' },
  { icon: ImageIcon, title: 'Pilih latar polos', text: 'Letakkan satu buah di permukaan yang bersih dan sederhana.' },
];

export function Home() {
  return (
    <div className="fruitly-landing">
      <section className="lp-hero" aria-labelledby="fruitly-title">
        <div className="container lp-hero-grid">
          <h1 id="fruitly-title" className="lp-hero-title">
            <Lines lines={['Masih segar?', 'Cek lewat foto.']} />
          </h1>
          <Reveal className="lp-hero-side" delay={160}>
            <p>Ragu dengan buah di meja? Ambil foto apel, jeruk, atau pisang. Fruitly akan memperkirakan apakah buahnya masih tampak segar.</p>
            <Link className="lp-pill lp-pill-white" to="/detect">Mulai cek buah <ArrowUpRight size={20} /></Link>
          </Reveal>
        </div>
        <div className="container lp-stage">
          <div className="lp-hero-art" aria-hidden="true">
            <Drift className="lp-art-apple" speed={0.13}><img src={fruitPhotos.apple} alt="" fetchPriority="high" /></Drift>
            <Drift className="lp-art-orange" speed={0.19}><img src={fruitPhotos.orange} alt="" /></Drift>
            <Drift className="lp-art-banana" speed={0.08}><img src={fruitPhotos.banana} alt="" /></Drift>
            <Drift className="lp-art-slice" speed={0.23}><img src={fruitPhotos.orange} alt="" /></Drift>
          </div>
          <a className="lp-discover" href="#cara-kerja"><ArrowDown size={18} /> Cara kerja</a>
          <div className="lp-glass">
            <ScanLine size={24} aria-hidden="true" />
            <div><strong>Satu foto, satu buah.</strong><p>Pakai kamera atau foto dari galeri.</p></div>
          </div>
        </div>
      </section>

      <section className="lp-statement" aria-label="Tentang Fruitly">
        <div className="container">
          <Reveal as="p" className="lp-statement-text">
            Warna kulit, tekstur, dan bercak bisa jadi <em>petunjuk kesegaran.</em> Fruitly membantumu membaca petunjuk itu dari <em>satu foto.</em>
          </Reveal>
        </div>
      </section>

      <section id="cara-kerja" className="lp-how container">
        <div className="lp-how-card">
          <Reveal className="lp-how-photo" variant="pop">
            <img src={localPhotos.flatLay} alt="Irisan jeruk dan buah naga di atas permukaan merah muda" loading="lazy" />
            <span className="lp-sticker"><Camera size={20} /> Mulai dari satu foto</span>
          </Reveal>
          <div className="lp-how-copy">
            <h2 className="lp-h2"><Lines lines={['Dari foto', 'ke hasil.']} /></h2>
            <ol className="lp-steps">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} as="li" delay={i * 90}>
                  <span className="lp-step-icon"><Icon size={22} aria-hidden="true" /></span>
                  <div><b>{title}</b><small>{text}</small></div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container lp-fruits">
        <div className="lp-head">
          <h2 className="lp-h2"><Lines lines={['Buah apa yang', 'mau kamu cek?']} /></h2>
          <Reveal as="p" className="lp-muted lp-head-note">Mulai dengan apel, jeruk, atau pisang. Foto satu buah setiap kali agar permukaan kulitnya terlihat jelas.</Reveal>
        </div>
        <div className="lp-fruit-grid">
          {fruits.map((fruit, i) => (
            <Reveal as="article" key={fruit.name} variant="rise" delay={i * 100} className={`lp-fruit tone-${fruit.tone}`}>
              <h3>{fruit.name}</h3>
              <p>{fruit.text}</p>
              <img src={fruit.photo} alt={fruit.name} loading="lazy" />
              <Link className="lp-fruit-btn" to="/detect" aria-label={`Cek kesegaran ${fruit.name.toLowerCase()}`}><ArrowUpRight size={23} /></Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="lp-results">
        <div className="container">
          <h2 className="lp-h2"><Lines lines={['Apa arti hasilnya?']} /></h2>
          <div className="lp-result-grid">
            <Reveal as="article" className="lp-result"><h3><span className="lp-status fresh" />Segar</h3><p>Buah pada foto terlihat segar berdasarkan pola yang dikenali model.</p></Reveal>
            <Reveal as="article" className="lp-result" delay={110}><h3><span className="lp-status stale" />Tidak segar</h3><p>Model menemukan pola yang mirip dengan tanda buah mulai rusak, seperti bercak gelap atau kulit keriput.</p></Reveal>
          </div>
          <Reveal as="p" className="lp-muted lp-result-note">Hasil hanya berdasarkan tampilan foto. Periksa kondisi buah secara langsung sebelum memakannya.</Reveal>
        </div>
      </section>

      <section className="container lp-tips">
        <div className="lp-head">
          <h2 className="lp-h2"><Lines lines={['Biar fotonya', 'lebih jelas.']} /></h2>
          <Link to="/guide" className="lp-link">Buka panduan foto <ArrowUpRight size={19} /></Link>
        </div>
        <div className="lp-tip-grid">
          {tips.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="article" key={title} delay={i * 100} className="lp-tip-card">
              <Icon size={25} aria-hidden="true" /><h3>{title}</h3><p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="lp-finale">
        <div className="container lp-finale-grid">
          <Reveal variant="pop" className="lp-finale-photo"><img src={localPhotos.table} alt="Jeruk, pisang dan buah lain di meja" loading="lazy" /></Reveal>
          <Reveal className="lp-finale-copy">
            <h2 className="lp-h2 on-dark">Sudah ada buahnya?</h2>
            <p>Ambil foto atau pilih dari galeri untuk mulai cek kesegarannya.</p>
            <Link to="/detect" className="lp-pill lp-pill-white">Mulai cek buah <ArrowUpRight size={20} /></Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
