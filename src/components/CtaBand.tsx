import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Slice } from './Illustrations';
import { Drift, Reveal } from './Reveal';

export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section className="section cta">
      <div className="container">
        <Reveal variant="pop" className="cta-card">
          <Drift className="deco cta-kiwi" speed={0.1}><Slice kind="kiwi" className="slice" /></Drift>
          <Drift className="deco cta-lemon" speed={0.14}><Slice kind="lemon" className="slice" /></Drift>
          <div className="cta-copy">
            <h2 className="h2 on-dark">{title}</h2>
            <p>{text}</p>
            <Link className="btn btn-lime" to="/detect"><span>Mulai deteksi</span><ArrowUpRight size={20} /></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
