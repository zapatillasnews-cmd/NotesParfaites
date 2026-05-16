import { IcSearch } from '../icons';

export default function SearchBar({ placeholder = 'Rechercher…', value, onChange, t }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.card, borderRadius: 12, padding: '10px 14px', boxShadow: t.shadow, border: `1px solid ${t.border}`, marginBottom: 14, transition: 'background .3s' }}>
      <IcSearch s={16} c={t.text3} />
      <input
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: t.text, background: 'transparent', fontFamily: 'inherit' }}
      />
    </div>
  );
}
