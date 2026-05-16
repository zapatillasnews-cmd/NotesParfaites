// v2-components.jsx — Theme + shared UI (dark-mode aware)

// ── Theme ─────────────────────────────────────────────────────
const getTheme = (dark) => ({
  bg:          dark ? '#0D0D13' : '#F7F7F9',
  card:        dark ? '#1A1A25' : '#FFFFFF',
  card2:       dark ? '#222232' : '#F8FAFC',
  text:        dark ? '#EDEDF0' : '#0F172A',
  text2:       dark ? '#8B8FA8' : '#64748B',
  text3:       dark ? '#55576A' : '#94A3B8',
  border:      dark ? '#252538' : '#F1F5F9',
  border2:     dark ? '#2A2A3C' : '#E2E8F0',
  inputBg:     dark ? '#1A1A25' : '#FFFFFF',
  navBg:       dark ? '#15151F' : '#FFFFFF',
  navBorder:   dark ? '#252538' : '#F1F5F9',
  accent:      '#6366F1',
  accentLight: dark ? 'rgba(99,102,241,0.16)' : '#EEF2FF',
  shadow:      dark
    ? '0 2px 10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 1px 4px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.03)',
});

// ── SVG Icons ─────────────────────────────────────────────────
const IcSearch   = ({s=18,c='#64748B'}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const IcPlus     = ({s=18,c='#fff'})   => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>);
const IcFolder   = ({s=18,c='#64748B'}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>);
const IcHome     = ({s=22,c='#94A3B8',filled=false}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" stroke={c} strokeWidth="2" strokeLinejoin="round" fill={filled ? c : 'none'}/><path d="M9 22v-8h6v8" stroke={filled ? 'white' : c} strokeWidth="2" strokeLinejoin="round"/></svg>);
const IcHash     = ({s=22,c='#94A3B8'}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/></svg>);
const IcFolderNav= ({s=22,c='#94A3B8',filled=false}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill={filled?c:'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>);
const IcSettings = ({s=22,c='#94A3B8'}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>);
const IcPin      = ({s=13,c='#CBD5E1'}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round"><path d="M12 2l3 7h5l-4 4 1.5 7L12 17l-5.5 3L8 13 4 9h5L12 2z"/></svg>);
const IcBack     = ({s=20,c='#0F172A'}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>);
const IcClock    = ({s=13,c='#94A3B8'}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>);
const IcChevronR = ({s=15,c='#CBD5E1'}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>);
const IcTrash    = ({s=16,c='#EF4444'}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>);
const IcCheck    = ({s=14,c='#6366F1'}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>);
const IcX        = ({s=16,c='#94A3B8'}) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>);

// ── Bottom Nav ─────────────────────────────────────────────────
const BottomNav = ({ active, onNavigate, dark, t }) => {
  const items = [
    { id:'home',     label:'Accueil',  icon:(c,f) => <IcHome s={22} c={c} filled={f}/> },
    { id:'notes',    label:'Notes',    icon:(c)   => <IcHash s={22} c={c}/> },
    { id:'folders',  label:'Dossiers', icon:(c,f) => <IcFolderNav s={22} c={c} filled={f}/> },
    { id:'settings', label:'Réglages', icon:(c)   => <IcSettings s={22} c={c}/> },
  ];
  return (
    <div style={{ display:'flex', background:t.navBg, borderTop:`1px solid ${t.navBorder}`, paddingBottom:26, paddingTop:10, flexShrink:0, transition:'background 0.3s, border-color 0.3s' }}>
      {items.map(({ id, label, icon }) => {
        const isActive = active === id;
        const color = isActive ? t.accent : t.text3;
        return (
          <button key={id} onClick={() => onNavigate(id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, border:'none', background:'transparent', cursor:'pointer', padding:'4px 0' }}>
            {icon(color, isActive)}
            <span style={{ fontSize:10, fontWeight:isActive?700:400, color, letterSpacing:0.1 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ── Note Color Icon ────────────────────────────────────────────
const NoteIcon = ({ note, size=36 }) => (
  <div style={{ width:size, height:size, borderRadius:Math.round(size*0.3), background:note.colorLight, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:`1.5px solid ${note.color}25` }}>
    <span style={{ fontSize:Math.round(size*0.48), color:note.color, fontWeight:800, lineHeight:1 }}>{note.title.charAt(0).toUpperCase()}</span>
  </div>
);

// ── Tag Chip ───────────────────────────────────────────────────
const TagChip = ({ label, color='#6366F1', dark }) => (
  <span style={{ fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:20, background:dark?`${color}22`:`${color}15`, color, border:`1px solid ${color}${dark?'35':'28'}`, whiteSpace:'nowrap', display:'inline-block' }}>{label}</span>
);

// ── Section Header ─────────────────────────────────────────────
const SectionHeader = ({ title, action, onAction, t }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
    <span style={{ fontSize:15, fontWeight:700, color:t.text }}>{title}</span>
    {action && <span onClick={onAction} style={{ fontSize:12, color:t.accent, fontWeight:600, cursor:'pointer' }}>{action}</span>}
  </div>
);

// ── Search Bar ─────────────────────────────────────────────────
const SearchBar = ({ placeholder='Rechercher…', value, onChange, t }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8, background:t.card, borderRadius:12, padding:'10px 14px', boxShadow:t.shadow, border:`1px solid ${t.border}`, marginBottom:14, transition:'background 0.3s, border-color 0.3s' }}>
    <IcSearch s={16} c={t.text3}/>
    <input value={value} onChange={e => onChange && onChange(e.target.value)} placeholder={placeholder}
      style={{ flex:1, border:'none', outline:'none', fontSize:14, color:t.text, background:'transparent', fontFamily:'inherit' }}/>
  </div>
);

// ── Card ───────────────────────────────────────────────────────
const Card = ({ children, onClick, t, style={} }) => (
  <div onClick={onClick} style={{ background:t.card, borderRadius:16, boxShadow:t.shadow, cursor:onClick?'pointer':'default', transition:'background 0.3s', ...style }}>
    {children}
  </div>
);

// ── Icon Button ────────────────────────────────────────────────
const IconBtn = ({ onClick, children, primary=false, t, small=false }) => (
  <button onClick={onClick} style={{ width:small?30:34, height:small?30:34, borderRadius:10, border:'none', cursor:'pointer', background:primary?t.accent:t.card, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:primary?`0 2px 8px ${t.accent}50`:t.shadow, flexShrink:0, transition:'background 0.3s' }}>
    {children}
  </button>
);

Object.assign(window, {
  getTheme,
  IcSearch, IcPlus, IcFolder, IcHome, IcHash, IcFolderNav, IcSettings,
  IcPin, IcBack, IcClock, IcChevronR, IcTrash, IcCheck, IcX,
  BottomNav, NoteIcon, TagChip, SectionHeader, SearchBar, Card, IconBtn,
});
