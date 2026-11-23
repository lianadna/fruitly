import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { fruitPhotos } from '../lib/photos';
import { Reveal } from './Reveal';

export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section className="lp-finale content-cta">
      <div className="container lp-finale-grid">
        <Reveal variant="pop" className="content-cta-art">
          <img src={fruitPhotos.orange} alt="" loading="lazy" />
          <img src={fruitPhotos.apple} alt="" loading="lazy" />
        </Reveal>
        <Reveal className="lp-finale-copy">
          <h2 className="lp-h2 on-dark">{title}</h2>
          <p>{text}</p>
          <Link className="lp-pill lp-pill-white" to="/detect">Mulai cek buah<ArrowUpRight size={20} aria-hidden="true" /></Link>
        </Reveal>
      </div>
    </section>
  );
}
