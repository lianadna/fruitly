import { Link } from 'react-router-dom';
import { LogoMark } from './Illustrations';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="logo"><LogoMark size={30} /><span>Fruitly</span></Link>
          <p>Cek kesegaran buah lewat satu foto.</p>
        </div>
        <nav className="footer-links" aria-label="Tautan footer">
          <Link to="/">Beranda</Link>
          <Link to="/detect">Coba Fruitly</Link>
          <Link to="/about">Tentang</Link>
          <Link to="/guide">Panduan</Link>
        </nav>
      </div>
      <div className="container footer-bottom"><span>© 2026 Fruitly</span></div>
    </footer>
  );
}
