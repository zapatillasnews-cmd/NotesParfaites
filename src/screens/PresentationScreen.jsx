import { useState, useEffect } from 'react';

function parseSlides(html) {
  if (!html) return ['<p style="opacity:.5">Aucun contenu</p>'];
  if (html.includes('---')) {
    const parts = html.split(/---+/).map(s => s.trim()).filter(Boolean);
    if (parts.length > 1) return parts;
  }
  const parts = html.split(/(?=<h1[^>]*>)/i);
  const slides = parts.map(s => s.trim()).filter(Boolean);
  return slides.length > 0 ? slides : [html];
}

export default function PresentationScreen({ note, onClose, dark }) {
  const slides = parseSlides(note.body || '');
  const [idx, setIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setIdx(i => Math.min(i + 1, slides.length - 1));
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   setIdx(i => Math.max(i - 1, 0));
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length, onClose]);

  const accent = note.color || '#6366F1';
  const bg = '#0d0d18';

  useEffect(() => {
    let meta = document.querySelector('meta[name="theme-color"]');
    const oldVal = meta ? meta.getAttribute('content') : null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', bg);
    return () => {
      if (meta && oldVal) meta.setAttribute('content', oldVal);
    };
  }, []);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: bg, display: 'flex', flexDirection: 'column', touchAction: 'pan-y' }}
      onTouchStart={e => { setTouchStartX(e.touches[0].clientX); setTouchStartY(e.touches[0].clientY); }}
      onTouchEnd={e => {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
          if (dx < 0) setIdx(i => Math.min(i + 1, slides.length - 1));
          else        setIdx(i => Math.max(i - 1, 0));
        }
        setTouchStartX(null);
        setTouchStartY(null);
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 0', flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.3)', maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.22)', fontWeight: 500 }}>{idx + 1} / {slides.length}</span>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: 9, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'rgba(255,255,255,.55)', cursor: 'pointer', fontFamily: 'inherit', touchAction: 'manipulation' }}>×</button>
        </div>
      </div>

      {/* Slide content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 52px' }}>
        <div
          dangerouslySetInnerHTML={{ __html: slides[idx] }}
          style={{ fontSize: 20, lineHeight: 1.78, color: 'rgba(255,255,255,.88)', fontFamily: "'Plus Jakarta Sans',sans-serif", maxWidth: 620, width: '100%', textAlign: 'center' }}
        />
      </div>

      {/* Progress dots */}
      {slides.length > 1 && (
        <div style={{ flexShrink: 0, padding: '0 28px 32px', display: 'flex', gap: 5, justifyContent: 'center', alignItems: 'center' }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)}
              style={{ height: 4, flex: 1, maxWidth: 32, borderRadius: 2, background: i === idx ? accent : 'rgba(255,255,255,.15)', transition: 'background .2s', cursor: 'pointer' }} />
          ))}
        </div>
      )}

      {/* Nav arrows */}
      {idx > 0 && (
        <button onClick={() => setIdx(i => i - 1)}
          style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.07)', border: 'none', borderRadius: 11, width: 44, height: 44, fontSize: 24, color: 'rgba(255,255,255,.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation' }}>‹</button>
      )}
      {idx < slides.length - 1 && (
        <button onClick={() => setIdx(i => i + 1)}
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.07)', border: 'none', borderRadius: 11, width: 44, height: 44, fontSize: 24, color: 'rgba(255,255,255,.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation' }}>›</button>
      )}
    </div>
  );
}
