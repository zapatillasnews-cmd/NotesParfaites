import { IcX } from '../icons';

export function Sheet({ t, dark, children, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: `rgba(0,0,0,${dark ? .5 : .35})`, zIndex: 200, backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: t.card, borderRadius: '22px 22px 0 0', boxShadow: `0 -6px 40px rgba(0,0,0,${dark ? .6 : .14})`, transition: 'background .3s' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: t.border2, margin: '12px auto 18px' }} />
        {children}
      </div>
    </>
  );
}

export function SheetHeader({ title, t, onClose }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 20 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, margin: 0 }}>{title}</h3>
      <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: t.card2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IcX s={14} c={t.text3} />
      </button>
    </div>
  );
}

export function Label({ children, t }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: t.text3, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 8 }}>{children}</div>;
}

export function TInput({ value, onChange, placeholder, t, autoFocus, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: `1.5px solid ${t.border2}`, outline: 'none', fontSize: 14, color: t.text, background: t.inputBg, fontFamily: 'inherit', boxSizing: 'border-box', transition: 'background .3s,border-color .3s' }}
    />
  );
}
