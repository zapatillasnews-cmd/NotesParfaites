export default function TagChip({ label, color, dark }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: dark ? `${color}22` : `${color}15`, color, border: `1px solid ${color}${dark ? '33' : '22'}`, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}
