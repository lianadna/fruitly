import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Detect } from './pages/Detect';
import { About } from './pages/About';
import { Guide } from './pages/Guide';

export default function App() {
  // Halaman kamera tampil layar penuh, jadi navbar dan footer disembunyikan di sana.
  const { pathname } = useLocation();
  const isCamera = pathname.replace(/\/+$/, '') === '/detect';

  return (
    <>
      <a className="skip-link" href="#main-content">Langsung ke konten</a>
      <ScrollToTop />
      {!isCamera && <Navbar />}
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/classify" element={<Navigate to="/detect" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isCamera && <Footer />}
    </>
  );
}
