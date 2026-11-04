import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { prefersReducedMotion, registerDrift } from '../lib/motion';

export function useInView<T extends HTMLElement>(threshold = 0.2, observeParent = false) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) { setSeen(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold, rootMargin: '0px 0px -8% 0px' });
    // Elemen yang seluruhnya terpotong clip-path dianggap tak terlihat, jadi garis "draw" mengamati induknya.
    io.observe(observeParent ? el.parentElement ?? el : el);
    return () => io.disconnect();
  }, [threshold, observeParent]);
  return [ref, seen] as const;
}

type Variant = 'up' | 'left' | 'right' | 'pop' | 'draw' | 'rise' | 'fade';
type RevealProps = {
  as?: 'div' | 'section' | 'p' | 'li' | 'span' | 'article' | 'figure';
  variant?: Variant;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/** Memunculkan elemen saat masuk layar. Tiap varian punya karakter gerak sendiri. */
export function Reveal({ as = 'div', variant = 'up', delay = 0, className = '', style, children }: RevealProps) {
  const Tag = as as ElementType;
  const [ref, seen] = useInView<HTMLElement>(variant === 'draw' ? 0.25 : 0.2, variant === 'draw');
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${seen ? 'is-in' : ''} ${className}`.trim()}
      style={{ '--d': `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Judul yang naik baris demi baris dari balik garis potong. */
export function Lines({ lines, delay = 0 }: { lines: ReactNode[]; delay?: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.3);
  return (
    <span ref={ref} className={`lines ${seen ? 'is-in' : ''}`}>
      {lines.map((line, i) => (
        <span className="line" key={i}>
          <span className="line-in" style={{ '--d': `${delay + i * 120}ms` } as CSSProperties}>{line}</span>
        </span>
      ))}
    </span>
  );
}

/** Pembungkus dekorasi yang bergeser pelan mengikuti scroll. */
export function Drift({ speed = 0.1, className = '', children, style }: { speed?: number; className?: string; children?: ReactNode; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? registerDrift(ref.current, speed) : undefined), [speed]);
  return <div ref={ref} className={`drift ${className}`} style={style}>{children}</div>;
}
