export default function IconBtn({ onClick, children, primary = false, t, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: primary ? t.accent : t.card, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.shadow, flexShrink: 0, transition: 'background .3s', ...style }}
    >
      {children}
    </button>
  );
}
