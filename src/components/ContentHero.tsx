import { ArrowDown } from 'lucide-react';
import { fruitPhotos } from '../lib/photos';
import { Drift, Lines, Reveal } from './Reveal';

type ContentHeroProps = {
  page: 'about' | 'guide';
  lines: string[];
  description: string;
  jumpTo: string;
  jumpLabel: string;
};

export function ContentHero({ page, lines, description, jumpTo, jumpLabel }: ContentHeroProps) {
  const fruit = page === 'about' ? fruitPhotos.apple : fruitPhotos.banana;

  return (
    <section className="lp-hero content-hero" aria-labelledby={`${page}-title`}>
      <div className="container content-hero-grid">
        <div className="content-hero-copy">
          <h1 id={`${page}-title`} className="lp-hero-title"><Lines lines={lines} /></h1>
          <Reveal delay={140}>
            <p>{description}</p>
            <a href={jumpTo} className="lp-pill lp-pill-white">{jumpLabel}<ArrowDown size={19} aria-hidden="true" /></a>
          </Reveal>
        </div>
        <div className={`content-hero-art is-${page}`} aria-hidden="true">
          <div className="content-hero-ring" />
          <Drift className="content-hero-orange" speed={0.16}><img src={fruitPhotos.orange} alt="" /></Drift>
          <Drift className="content-hero-fruit" speed={0.08}><img src={fruit} alt="" fetchPriority="high" /></Drift>
        </div>
      </div>
    </section>
  );
}
