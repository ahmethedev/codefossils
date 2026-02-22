import { useState, useEffect } from 'react';

const GA_ID = 'G-MHQMYX15P2';

function loadGA() {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_ID);
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') {
      loadGA();
    } else if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    loadGA();
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: '#1a1a2e', color: '#e0e0e0',
      padding: '14px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 16, flexWrap: 'wrap',
      fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif",
      boxShadow: '0 -2px 12px rgba(0,0,0,0.15)',
    }}>
      <span>We use cookies for analytics.</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={accept} style={{
          padding: '6px 16px', borderRadius: 6,
          background: '#6366f1', border: 'none', color: '#fff',
          fontSize: 13, cursor: 'pointer', fontFamily: "'IBM Plex Sans', sans-serif",
        }}>
          Accept
        </button>
        <button onClick={decline} style={{
          padding: '6px 16px', borderRadius: 6,
          background: 'transparent', border: '1px solid #555',
          color: '#aaa', fontSize: 13, cursor: 'pointer',
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}>
          Decline
        </button>
      </div>
    </div>
  );
}
