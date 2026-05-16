// notes-components.jsx — Shared icons & UI components

// ─── Icons ───────────────────────────────────────────────────

const IcSearch = ({ s = 18, c = '#64748B' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const IcPlus = ({ s = 18, c = '#fff' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const IcFolder = ({ s = 18, c = '#64748B' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
  </svg>
);
const IcHome = ({ s = 22, c = '#94A3B8', filled = false }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"
      stroke={c} strokeWidth="2" strokeLinejoin="round" fill={filled ? c : 'none'}/>
    <path d="M9 22v-8h6v8" stroke={filled ? 'white' : c} strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);
const IcHash = ({ s = 22, c = '#94A3B8' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
    <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>
  </svg>
);
const IcFolderNav = ({ s = 22, c = '#94A3B8', filled = false }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
  </svg>
);
const IcUser = ({ s = 22, c = '#94A3B8' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const IcPin = ({ s = 13, c = '#CBD5E1' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round">
    <path d="M12 2l3 7h5l-4 4 1.5 7L12 17l-5.5 3L8 13 4 9h5L12 2z"/>
  </svg>
);
const IcBack = ({ s = 20, c = '#0F172A' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const IcClock = ({ s = 13, c = '#94A3B8' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
  </svg>
);
const IcChevronRight = ({ s = 15, c = '#CBD5E1' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);
const IcEdit = ({ s = 17, c = '#4F46E5' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
  </svg>
);
const IcTrash = ({ s = 17, c = '#EF4444' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
  </svg>
);
const IcCheck = ({ s = 13, c = '#4F46E5' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const IcStar = ({ s = 16, c = '#F59E0B', filled = false }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? c : 'none'} stroke={c} strokeWidth="2" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

// ─── Bottom Navigation ────────────────────────────────────────

const BottomNav = ({ active, onNavigate }) => {
  const items = [
    { id: 'home', label: 'Accueil', render: (c, f) => <IcHome s={22} c={c} filled={f} /> },
    { id: 'notes', label: 'Notes', render: (c) => <IcHash s={22} c={c} /> },
    { id: 'folders', label: 'Dossiers', render: (c, f) => <IcFolderNav s={22} c={c} filled={f} /> },
    { id: 'settings', label: 'Profil', render: (c) => <IcUser s={22} c={c} /> },
  ];
  return (
    <div style={{
      display: 'flex', background: '#FFFFFF',
      borderTop: '1px solid #F1F5F9',
      paddingBottom: 26, paddingTop: 10, flexShrink: 0,
    }}>
      {items.map(({ id, label, render }) => {
        const isActive = active === id;
        const color = isActive ? '#4F46E5' : '#94A3B8';
        return (
          <button key={id} onClick={() => onNavigate(id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 0',
          }}>
            {render(color, isActive)}
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, color, letterSpacing: 0.1 }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// ─── Note Color Icon ─────────────────────────────────────────

const NoteIcon = ({ note, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: Math.round(size * 0.3),
    background: note.colorLight,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, border: `1.5px solid ${note.color}25`,
  }}>
    <span style={{ fontSize: Math.round(size * 0.48), color: note.color, fontWeight: 800, lineHeight: 1 }}>
      {note.title.charAt(0).toUpperCase()}
    </span>
  </div>
);

// ─── Priority Badge ───────────────────────────────────────────

const PriorityBadge = ({ priority }) => {
  const map = {
    'Élevée': { bg: '#FEF2F2', color: '#DC2626' },
    'Moyenne': { bg: '#FFFBEB', color: '#D97706' },
    'Faible':  { bg: '#F0FDF4', color: '#16A34A' },
  };
  const s = map[priority] || map['Faible'];
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
      background: s.bg, color: s.color,
    }}>#{priority}</span>
  );
};

// ─── Tag Chip ─────────────────────────────────────────────────

const TagChip = ({ label, color = '#4F46E5' }) => (
  <span style={{
    fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
    background: `${color}15`, color, border: `1px solid ${color}28`,
    whiteSpace: 'nowrap', display: 'inline-block',
  }}>{label}</span>
);

// ─── Section Header ───────────────────────────────────────────

const SectionHeader = ({ title, action, onAction }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
    <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{title}</span>
    {action && (
      <span onClick={onAction} style={{ fontSize: 12, color: '#4F46E5', fontWeight: 600, cursor: 'pointer' }}>
        {action}
      </span>
    )}
  </div>
);

// ─── Search Bar ───────────────────────────────────────────────

const SearchBar = ({ placeholder = 'Rechercher...', value, onChange }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'white', borderRadius: 12, padding: '10px 14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9',
    marginBottom: 14,
  }}>
    <IcSearch s={16} c="#94A3B8" />
    <input value={value} onChange={e => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1, border: 'none', outline: 'none', fontSize: 14,
        color: '#0F172A', background: 'transparent',
        fontFamily: 'inherit',
      }}
    />
  </div>
);

// ─── Card wrapper ─────────────────────────────────────────────

const Card = ({ children, onClick, style = {} }) => (
  <div onClick={onClick} style={{
    background: 'white', borderRadius: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.03)',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  }}>
    {children}
  </div>
);

// ─── Icon Button ─────────────────────────────────────────────

const IconBtn = ({ onClick, children, primary = false, small = false }) => (
  <button onClick={onClick} style={{
    width: small ? 30 : 34, height: small ? 30 : 34,
    borderRadius: 10, border: 'none', cursor: 'pointer',
    background: primary ? '#4F46E5' : 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: primary ? '0 2px 8px rgba(79,70,229,0.3)' : '0 1px 3px rgba(0,0,0,0.07)',
    flexShrink: 0,
  }}>
    {children}
  </button>
);

Object.assign(window, {
  IcSearch, IcPlus, IcFolder, IcHome, IcHash, IcFolderNav,
  IcUser, IcPin, IcBack, IcClock, IcChevronRight, IcEdit, IcTrash, IcCheck, IcStar,
  BottomNav, NoteIcon, PriorityBadge, TagChip, SectionHeader, SearchBar, Card, IconBtn,
});
