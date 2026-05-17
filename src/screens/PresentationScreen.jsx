import { useState, useEffect } from 'react';

function parseSlides(html) {
  if (!html) return ['<p>Aucun contenu</p>'];
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
  const [touchStart, setTouchStart] = useState(null);

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
  const bg     = dark ? '#0d0d14' : '#12121e';

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: bg, display: 'flex', flexDirection: 'column' }}
      onTouchStart={e => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={e => {
        if (touchStart === null) return;
        const dx = e.changedTouches[0].clientX - touchStart;
        if (Math.abs(dx) > 50) {
          if (dx < 0) setIdx(i => Math.min(i + 1, slides.length - 1));
          else        setIdx(i => Math.max(i - 1, 0));
        }
        setTouchStart(null);
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 12px', flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.35)', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.25)', fontWeight: 500 }}>{idx + 1} / {slides.length}</span>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontFamily: 'inherit' }}>×</button>
        </div>
      </div>

      {/* Slide */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 48px 24px', overflow: 'hidden' }}>
        <div
          dangerouslySetInnerHTML={{ __html: slides[idx] }}
          style={{ fontSize: 20, lineHeight: 1.75, color: 'rgba(255,255,255,.9)', fontFamily: "'Plus Jakarta Sans',sans-serif", maxWidth: 640, width: '100%', textAlign: 'center' }}
        />
      </div>

      {/* Progress dots */}
      <div style={{ flexShrink: 0, padding: '0 24px 32px', display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)}
            style={{ height: 4, flex: 1, maxWidth: 36, borderRadius: 2, background: i === idx ? accent : 'rgba(255,255,255,.18)', transition: 'background .2s', cursor: 'pointer' }} />
        ))}
      </div>

      {/* Nav arrows */}
      {idx > 0 && (
        <button onClick={() => setIdx(i => i - 1)}
          style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: 10, width: 42, height: 42, fontSize: 22, color: 'rgba(255,255,255,.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
      )}
      {idx < slides.length - 1 && (
        <button onClick={() => setIdx(i => i + 1)}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: 10, width: 42, height: 42, fontSize: 22, color: 'rgba(255,255,255,.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
      )}
    </div>
  );
}
