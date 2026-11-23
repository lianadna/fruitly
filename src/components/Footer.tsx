import { Link } from 'react-router-dom';
import { LogoMark } from './Illustrations';

export function Footer() {
  return (
    <footer className="ft">
      <div className="container ft-inner">
        <div className="ft-brand">
          <Link to="/" className="ft-logo" aria-label="Fruitly, ke beranda"><LogoMark size={30} /><span>Fruitly</span></Link>
          <p>Cek kesegaran buah lewat satu foto.</p>
        </div>
        <nav className="ft-cols" aria-label="Tautan footer">
          <div>
            <h2>Halaman</h2>
            <Link to="/">Beranda</Link>
            <Link to="/about">Tentang</Link>
            <Link to="/guide">Panduan</Link>
          </div>
          <div>
            <h2>Fruitly</h2>
            <Link to="/detect">Mulai cek buah</Link>
            <Link to="/guide">Tips foto</Link>
          </div>
        </nav>
      </div>
      <div className="container ft-bottom"><span>© 2026 Fruitly. Hasil hanya perkiraan dari foto.</span></div>
    </footer>
  );
}