import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { LogoMark } from './Illustrations';

const links = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/about', label: 'Tentang', end: false },
  { to: '/guide', label: 'Panduan', end: false },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="logo" aria-label="Fruitly, ke beranda" onClick={() => setOpen(false)}>
          <LogoMark size={32} />
          <span>Fruitly</span>
        </Link>

        <nav id="menu-utama" className="header-nav" aria-label="Navigasi utama">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
              {link.label}
            </NavLink>
          ))}
          <Link className="btn btn-olive nav-cta-mobile" to="/detect" onClick={() => setOpen(false)}>
            <span>Mulai cek buah</span><ArrowUpRight size={18} />
          </Link>
        </nav>

        <Link className="btn btn-olive btn-sm header-cta" to="/detect">
          <span>Mulai cek buah</span><ArrowUpRight size={18} />
        </Link>

        <button type="button" className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} aria-controls="menu-utama">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
