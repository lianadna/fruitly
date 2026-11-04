import { useId } from 'react';
import type { CSSProperties } from 'react';

/* ------------------------------------------------------------------ */
/*  Apel utama. Dipakai di hero, halaman deteksi, dan panduan.          */
/*  state="fresh"  -> apel mulus                                        */
/*  state="stale"  -> kulit kusam, bercak cokelat, sedikit keriput      */
/* ------------------------------------------------------------------ */
type AppleProps = { state?: 'fresh' | 'stale'; className?: string; style?: CSSProperties; title?: string };

export function Apple({ state = 'fresh', className, style, title }: AppleProps) {
  const uid = useId().replace(/:/g, '');
  const id = `apple-${state}-${uid}`;
  const stale = state === 'stale';
  return (
    <svg className={className} style={style} viewBox="0 0 400 420" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="32%" r="78%">
          {stale ? (
            <>
              <stop offset="0" stopColor="#C25A4A" />
              <stop offset=".55" stopColor="#984033" />
              <stop offset="1" stopColor="#4F1A15" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#F2554A" />
              <stop offset=".5" stopColor="#D32B25" />
              <stop offset="1" stopColor="#8E1512" />
            </>
          )}
        </radialGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={stale ? '#9A9B4A' : '#B4D14E'} />
          <stop offset="1" stopColor={stale ? '#5F6128' : '#64800B'} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d="M200 112C176 92 128 90 96 120C54 160 50 250 86 322C112 372 150 398 184 392C196 390 204 384 216 392C250 400 290 372 316 322C352 252 346 160 304 120C272 90 224 92 200 112Z" />
        </clipPath>
      </defs>

      {/* bayangan di bawah */}
      <ellipse cx="200" cy="404" rx="108" ry="10" fill="#000" opacity=".18" />

      {/* batang + daun */}
      <path d="M200 116C198 86 206 62 224 40" fill="none" stroke="#5A3A1E" strokeWidth="11" strokeLinecap="round" />
      <path className="apple-leaf" d="M214 78C230 34 282 24 318 42C306 86 258 104 214 78Z" fill={`url(#${id}-leaf)`} />
      <path d="M226 74C256 62 286 54 308 48" fill="none" stroke={stale ? '#D8D99A' : '#E4F2A0'} strokeWidth="3.5" strokeLinecap="round" opacity=".8" />

      {/* badan apel */}
      <path d="M200 112C176 92 128 90 96 120C54 160 50 250 86 322C112 372 150 398 184 392C196 390 204 384 216 392C250 400 290 372 316 322C352 252 346 160 304 120C272 90 224 92 200 112Z" fill={`url(#${id}-body)`} />

      {stale && <path d="M200 112C176 92 128 90 96 120C54 160 50 250 86 322C112 372 150 398 184 392C196 390 204 384 216 392C250 400 290 372 316 322C352 252 346 160 304 120C272 90 224 92 200 112Z" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="2.5" />}

      <g clipPath={`url(#${id}-clip)`}>
        {/* cekungan di atas batang */}
        <path d="M168 116C186 134 214 134 234 116" fill="none" stroke="#000" strokeWidth="10" opacity=".16" strokeLinecap="round" />
        {/* sorot cahaya */}
        <path d="M92 168C98 144 118 128 140 124" fill="none" stroke="#fff" strokeWidth="16" strokeLinecap="round" opacity={stale ? 0.2 : 0.5} />
        <ellipse cx="116" cy="214" rx="9" ry="24" fill="#fff" opacity={stale ? 0.12 : 0.32} transform="rotate(8 116 214)" />
        {/* sisi gelap kanan */}
        <path d="M330 170C350 250 320 340 262 386C300 372 346 300 340 214Z" fill="#000" opacity=".16" />

        {stale && (
          <g>
            <ellipse cx="258" cy="236" rx="38" ry="30" fill="#3A1A10" opacity=".62" />
            <ellipse cx="262" cy="240" rx="22" ry="17" fill="#241008" opacity=".5" />
            <ellipse cx="140" cy="300" rx="26" ry="20" fill="#3A1A10" opacity=".55" />
            <ellipse cx="226" cy="338" rx="16" ry="12" fill="#2C140B" opacity=".5" />
            <ellipse cx="170" cy="180" rx="12" ry="9" fill="#3A1A10" opacity=".45" />
            <path d="M120 240C150 252 180 250 206 262M230 190C252 200 284 198 300 214" fill="none" stroke="#2A100A" strokeWidth="2.4" strokeLinecap="round" opacity=".35" />
          </g>
        )}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Irisan buah berbentuk lingkaran, gaya datar seperti referensi.      */
/* ------------------------------------------------------------------ */
type SliceKind = 'lemon' | 'kiwi' | 'watermelon' | 'orange';
type SliceProps = { kind: SliceKind; className?: string; style?: CSSProperties };

function Segments({ n, r1, r2, stroke, w }: { n: number; r1: number; r2: number; stroke: string; w: number }) {
  return (
    <g stroke={stroke} strokeWidth={w} strokeLinecap="round">
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return <line key={i} x1={100 + Math.cos(a) * r1} y1={100 + Math.sin(a) * r1} x2={100 + Math.cos(a) * r2} y2={100 + Math.sin(a) * r2} />;
      })}
    </g>
  );
}

export function Slice({ kind, className, style }: SliceProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" aria-hidden="true">
      {kind === 'lemon' && (
        <>
          <circle cx="100" cy="100" r="98" fill="#F9E53A" />
          <circle cx="100" cy="100" r="86" fill="#FFF3B0" />
          <circle cx="100" cy="100" r="78" fill="#FCEB3F" />
          <Segments n={10} r1={16} r2={76} stroke="#FFF3B0" w={5} />
          <circle cx="100" cy="100" r="20" fill="#FFF3B0" />
          <path d="M44 62C58 42 84 30 106 30" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
          <path d="M160 150C150 164 134 172 120 174" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".9" />
        </>
      )}
      {kind === 'orange' && (
        <>
          <circle cx="100" cy="100" r="98" fill="#2F8F1F" />
          <circle cx="100" cy="100" r="88" fill="#FFF0C9" />
          <circle cx="100" cy="100" r="80" fill="#FF9A1F" />
          <Segments n={9} r1={14} r2={78} stroke="#FFE2A8" w={5} />
          <circle cx="100" cy="100" r="16" fill="#FFE2A8" />
          <path d="M40 66C54 44 80 32 104 32" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
          <path d="M162 148C152 164 136 172 120 175" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".9" />
        </>
      )}
      {kind === 'kiwi' && (
        <>
          <circle cx="100" cy="100" r="98" fill="#A85F5A" />
          <circle cx="100" cy="100" r="90" fill="#C6E534" />
          <circle cx="100" cy="100" r="82" fill="#B3D81E" />
          <g stroke="#7FA010" strokeWidth="3.5" strokeLinecap="round" opacity=".75">
            {Array.from({ length: 28 }, (_, i) => {
              const a = (i / 28) * Math.PI * 2;
              return <line key={i} x1={100 + Math.cos(a) * 34} y1={100 + Math.sin(a) * 34} x2={100 + Math.cos(a) * 76} y2={100 + Math.sin(a) * 76} />;
            })}
          </g>
          <circle cx="100" cy="100" r="30" fill="#7B9A12" />
          <g fill="#3F5008">
            {Array.from({ length: 16 }, (_, i) => {
              const a = (i / 16) * Math.PI * 2;
              return <ellipse key={i} cx={100 + Math.cos(a) * 25} cy={100 + Math.sin(a) * 25} rx="3" ry="5" transform={`rotate(${(a * 180) / Math.PI + 90} ${100 + Math.cos(a) * 25} ${100 + Math.sin(a) * 25})`} />;
            })}
          </g>
          <circle cx="100" cy="100" r="15" fill="#FBF3B8" />
          <path d="M42 64C56 44 82 33 104 33" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
          <path d="M160 148C150 162 136 170 120 173" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".9" />
        </>
      )}
      {kind === 'watermelon' && (
        <>
          <circle cx="100" cy="100" r="98" fill="#2E8B1E" />
          <circle cx="100" cy="100" r="90" fill="#B8E26A" />
          <circle cx="100" cy="100" r="82" fill="#FFF6EC" />
          <circle cx="100" cy="100" r="76" fill="#FF5B4A" />
          <g fill="#3A1A14">
            {[[78, 62, 20], [128, 70, -25], [140, 112, 70], [112, 140, 10], [66, 120, -60], [100, 96, 30], [84, 92, -10]].map(([x, y, r], i) => (
              <ellipse key={i} cx={x} cy={y} rx="3" ry="6.5" transform={`rotate(${r} ${x} ${y})`} />
            ))}
          </g>
          <path d="M42 64C56 44 82 32 104 32" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
          <path d="M160 148C150 162 136 170 120 173" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".9" />
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Doodle garis tangan, gaya outline merah seperti referensi.          */
/* ------------------------------------------------------------------ */
type DoodleKind = 'cherry' | 'strawberry' | 'pear' | 'apple' | 'pineapple' | 'banana' | 'leaf';
type DoodleProps = { kind: DoodleKind; className?: string; style?: CSSProperties };

export function Doodle({ kind, className, style }: DoodleProps) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" aria-hidden="true" {...common}>
      {kind === 'cherry' && (
        <>
          <circle cx="32" cy="68" r="18" />
          <circle cx="68" cy="72" r="17" />
          <path d="M32 50C34 34 42 22 56 12M68 55C66 38 62 24 56 12" />
          <path d="M56 12C66 8 78 12 82 20C72 24 62 20 56 12Z" />
          <path d="M24 62C26 58 29 56 33 56" opacity=".6" />
        </>
      )}
      {kind === 'strawberry' && (
        <>
          <path d="M50 92C26 86 14 62 16 44C18 32 30 28 50 32C70 28 82 32 84 44C86 62 74 86 50 92Z" />
          <path d="M34 28L42 18L50 26L58 18L66 28M50 26V14" />
          <g strokeWidth="2.6">
            <path d="M32 48l1 5M46 44l1 5M60 48l1 5M70 58l1 5M24 62l1 5M38 62l1 5M52 60l1 5M44 76l1 5M58 74l1 5" />
          </g>
        </>
      )}
      {kind === 'pear' && (
        <>
          <path d="M50 24C42 34 40 44 34 54C24 66 22 82 36 90C48 96 66 94 74 82C82 70 76 58 66 50C58 44 58 34 50 24Z" />
          <path d="M50 24C50 16 52 10 58 6" />
          <path d="M54 12C60 4 70 4 74 8C70 16 60 18 54 12Z" />
          <path d="M40 66C38 74 42 82 48 85" opacity=".6" />
        </>
      )}
      {kind === 'apple' && (
        <>
          <path d="M50 30C40 20 22 24 16 40C8 60 22 88 40 90C46 90 48 86 52 87C58 90 62 90 66 88C82 80 94 54 84 38C78 26 60 20 50 30Z" />
          <path d="M50 30C50 20 52 14 58 8" />
          <path d="M54 18C60 8 72 8 76 12C72 22 62 24 54 18Z" />
          <path d="M26 46C28 40 32 36 38 34" opacity=".6" />
        </>
      )}
      {kind === 'pineapple' && (
        <>
          <path d="M50 38C30 38 22 58 24 72C26 86 38 94 50 94C62 94 74 86 76 72C78 58 70 38 50 38Z" />
          <path d="M50 38C44 28 38 18 34 8C42 12 47 18 50 26C53 18 58 12 66 8C62 18 56 28 50 38Z" /><path d="M50 30C46 20 46 10 50 0C54 10 54 20 50 30Z" />
          <path d="M30 56L68 90M44 44L76 78M26 74L46 92M56 42L78 62M32 48L64 86" opacity=".7" />
        </>
      )}
      {kind === 'banana' && (
        <>
          <path d="M22 18C20 10 28 6 34 8L38 22C40 50 56 76 82 84C88 86 90 92 84 94C52 98 20 70 22 18Z" />
          <path d="M34 8L36 2L42 4L38 22" />
          <path d="M36 28C40 54 56 74 78 82" opacity=".6" />
        </>
      )}
      {kind === 'leaf' && (
        <>
          <path d="M16 84C14 44 40 16 86 12C88 56 62 84 16 84Z" />
          <path d="M16 84C36 64 56 44 76 24" />
        </>
      )}
    </svg>
  );
}

/* Logo kecil: apel + daun. */
export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 13C17 9 9 10 7 17C4 26 10 36 17 36C19 36 19.5 34.5 21 35C23 36 25 36 27 35C34 31 37 22 33 16C30 10 23 9 20 13Z" fill="#D3202A" />
      <path d="M20 13C20 9 21 6 24 3" stroke="#5A3A1E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M22 8C25 3 31 3 33 5C31 9 26 11 22 8Z" fill="#93B22D" />
      <path d="M11 19C12 16.5 14 15.5 16 15" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".6" fill="none" />
    </svg>
  );
}
