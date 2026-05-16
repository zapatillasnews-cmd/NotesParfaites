// v3-components.jsx — Monochrome theme + shared primitives + NoteCard

// ── Theme ────────────────────────────────────────────────────
const getTheme = (dark) => ({
  bg:        dark ? '#0A0A0A' : '#F4F4F4',
  card:      dark ? '#141414' : '#FFFFFF',
  card2:     dark ? '#1C1C1C' : '#EEEEEE',
  text:      dark ? '#EDEDED' : '#111111',
  text2:     dark ? '#888888' : '#5A5A5A',
  text3:     dark ? '#4A4A4A' : '#AAAAAA',
  border:    dark ? '#1E1E1E' : '#E5E5E5',
  border2:   dark ? '#2A2A2A' : '#CECECE',
  inputBg:   dark ? '#141414' : '#FFFFFF',
  navBg:     dark ? '#0C0C0C' : '#FFFFFF',
  navBorder: dark ? '#181818' : '#E5E5E5',
  accent:    '#6366F1',
  accentBg:  dark ? 'rgba(99,102,241,0.18)' : '#EEF2FF',
  btnText:   '#FFFFFF',
  shadow:    dark
    ? '0 2px 16px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)',
  toolbarShadow: dark
    ? '0 -2px 20px rgba(0,0,0,0.7), 0 8px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)'
    : '0 -1px 10px rgba(0,0,0,0.04), 0 6px 22px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)',
});

// ── Icons ────────────────────────────────────────────────────
const IcSearch   = ({s=18,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const IcPlus     = ({s=18,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>);
const IcHome     = ({s=22,c,filled=false})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" stroke={c} strokeWidth="2" strokeLinejoin="round" fill={filled?c:'none'}/><path d="M9 22v-8h6v8" stroke={filled?'#fff':c} strokeWidth="2" strokeLinejoin="round"/></svg>);
const IcHash     = ({s=22,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/></svg>);
const IcFolderN  = ({s=22,c,filled=false})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill={filled?c:'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>);
const IcGear     = ({s=22,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>);
const IcPin      = ({s=13,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round"><path d="M12 2l3 7h5l-4 4 1.5 7L12 17l-5.5 3L8 13 4 9h5L12 2z"/></svg>);
const IcBack     = ({s=20,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>);
const IcClock    = ({s=13,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>);
const IcChevronR = ({s=14,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>);
const IcX        = ({s=14,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const IcBell     = ({s=16,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>);
const IcLock     = ({s=22,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>);
const IcDownload = ({s=16,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const IcUpload   = ({s=16,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>);
const IcTrash    = ({s=14,c})=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>);

// ── Long-press hook ───────────────────────────────────────────
const useLongPress = (onLongPress, ms = 620) => {
  const timer = React.useRef(null);
  const fired = React.useRef(false);
  const [active, setActive] = React.useState(false);

  const start = React.useCallback((e) => {
    if (e.pointerType === 'touch') e.preventDefault();
    fired.current = false;
    setActive(true);
    timer.current = setTimeout(() => {
      fired.current = true;
      setActive(false);
      onLongPress();
    }, ms);
  }, [onLongPress, ms]);

  const cancel = React.useCallback(() => {
    clearTimeout(timer.current);
    setActive(false);
  }, []);

  return {
    active,
    handlers: { onPointerDown: start, onPointerUp: cancel, onPointerLeave: cancel, onPointerCancel: cancel },
    didFire: () => fired.current,
  };
};

// ── Bottom Nav ────────────────────────────────────────────────
const BottomNav = ({ active, onNavigate, t }) => {
  const items = [
    { id:'home',     label:'Accueil',  icon:(c,f)=><IcHome s={22} c={c} filled={f}/> },
    { id:'notes',    label:'Notes',    icon:(c)  =><IcHash s={22} c={c}/> },
    { id:'folders',  label:'Dossiers', icon:(c,f)=><IcFolderN s={22} c={c} filled={f}/> },
    { id:'settings', label:'Réglages', icon:(c)  =><IcGear s={22} c={c}/> },
  ];
  return (
    <div style={{ display:'flex', background:t.navBg, borderTop:`1px solid ${t.navBorder}`, paddingBottom:26, paddingTop:10, flexShrink:0, transition:'background .3s,border-color .3s' }}>
      {items.map(({ id, label, icon }) => {
        const on = active === id;
        const c  = on ? t.accent : t.text3;
        return (
          <button key={id} onClick={() => onNavigate(id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, border:'none', background:'transparent', cursor:'pointer', padding:'4px 0' }}>
            {icon(c, on)}
            <span style={{ fontSize:10, fontWeight:on?700:400, color:c, letterSpacing:.1 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ── Note Icon ─────────────────────────────────────────────────
const NoteIcon = ({ note, size=36 }) => (
  <div style={{ width:size, height:size, borderRadius:Math.round(size*.3), background:note.colorLight, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:`1.5px solid ${note.color}28` }}>
    <span style={{ fontSize:Math.round(size*.46), color:note.color, fontWeight:800, lineHeight:1 }}>{note.title.charAt(0).toUpperCase()}</span>
  </div>
);

// ── Tag Chip ──────────────────────────────────────────────────
const TagChip = ({ label, color, dark }) => (
  <span style={{ fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:20, background:dark?`${color}22`:`${color}15`, color, border:`1px solid ${color}${dark?'33':'22'}`, whiteSpace:'nowrap' }}>{label}</span>
);

// ── Search Bar ────────────────────────────────────────────────
const SearchBar = ({ placeholder='Rechercher…', value, onChange, t }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8, background:t.card, borderRadius:12, padding:'10px 14px', boxShadow:t.shadow, border:`1px solid ${t.border}`, marginBottom:14, transition:'background .3s' }}>
    <IcSearch s={16} c={t.text3}/>
    <input value={value} onChange={e=>onChange&&onChange(e.target.value)} placeholder={placeholder}
      style={{ flex:1, border:'none', outline:'none', fontSize:14, color:t.text, background:'transparent', fontFamily:'inherit' }}/>
  </div>
);

// ── Shared Card ───────────────────────────────────────────────
const Card = ({ children, onClick, t, style={} }) => (
  <div onClick={onClick} style={{ background:t.card, borderRadius:16, boxShadow:t.shadow, cursor:onClick?'pointer':'default', transition:'background .3s', ...style }}>
    {children}
  </div>
);

// ── Icon Button ───────────────────────────────────────────────
const IconBtn = ({ onClick, children, primary=false, t, style={} }) => (
  <button onClick={onClick} style={{ width:34, height:34, borderRadius:10, border:'none', cursor:'pointer', background:primary?t.accent:t.card, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:t.shadow, flexShrink:0, transition:'background .3s', ...style }}>
    {children}
  </button>
);

// ── Section Header ────────────────────────────────────────────
const SectionHeader = ({ title, action, onAction, t }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
    <span style={{ fontSize:14, fontWeight:700, color:t.text, letterSpacing:-.1 }}>{title}</span>
    {action && <span onClick={onAction} style={{ fontSize:12, color:t.text2, fontWeight:600, cursor:'pointer' }}>{action}</span>}
  </div>
);

// ── Note Card (with long-press to pin) ────────────────────────
const NoteCard = ({ note, onOpen, onTogglePin, t, dark, compact=false }) => {
  const lp = useLongPress(() => onTogglePin(note.id));

  return (
    <div
      {...lp.handlers}
      onClick={() => { if (!lp.didFire()) onOpen(note); }}
      style={{
        background: t.card, borderRadius:16, boxShadow:t.shadow,
        padding: compact ? '13px' : '14px 16px',
        display:'flex', alignItems:'flex-start',
        gap: compact ? 8 : 12,
        cursor:'pointer',
        transform: lp.active ? 'scale(0.97)' : 'scale(1)',
        transition:'transform .12s, background .3s',
        userSelect:'none', WebkitUserSelect:'none',
        position:'relative',
      }}
    >
      <NoteIcon note={note} size={compact ? 26 : 42}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
          <span style={{ fontSize: compact ? 13 : 14, fontWeight:700, color:t.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1, minWidth:0, marginRight:6 }}>{note.title}</span>
          {!compact && <span style={{ fontSize:10.5, color:t.text3, flexShrink:0 }}>{note.date}</span>}
        </div>
        <p style={{ fontSize: compact ? 11.5 : 12.5, color:t.text2, margin:'0 0 '+(compact?0:8)+'px', lineHeight:1.55, display:'-webkit-box', WebkitLineClamp: compact ? 3 : 2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{note.preview || note.body}</p>
        {!compact && (
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', alignItems:'center' }}>
            {note.pinned && <IcPin s={11} c={t.text3}/>}
            {note.tags.slice(0,2).map(tag=><TagChip key={tag} label={tag} color={note.color} dark={dark}/>)}
          </div>
        )}
      </div>
      {compact && note.pinned && (
        <div style={{ position:'absolute', top:10, right:10 }}><IcPin s={11} c={t.text3}/></div>
      )}
    </div>
  );
};

Object.assign(window, {
  getTheme, useLongPress,
  IcSearch, IcPlus, IcHome, IcHash, IcFolderN, IcGear, IcPin, IcBack,
  IcClock, IcChevronR, IcX, IcBell, IcLock, IcDownload, IcUpload, IcTrash,
  BottomNav, NoteIcon, TagChip, SearchBar, Card, IconBtn, SectionHeader, NoteCard,
});
