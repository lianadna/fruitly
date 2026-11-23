import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { initPwa } from './lib/pwa';
import './styles/base.css';
import './styles/layout.css';
import './styles/motion.css';
import './styles/home.css';
import './styles/detect.css';
import './styles/content.css';

initPwa();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
