// v2-pages.jsx — HomePage, NotesPage, FoldersPage, SettingsPage + AddFolderModal

// ── Helper ─────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 5)  return 'Bonne nuit';
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
};

const todayLabel = () => new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' });

// ════════════════════════════════════════════════════════════
// ADD FOLDER MODAL (bottom sheet)
// ════════════════════════════════════════════════════════════
const AddFolderModal = ({ dark, t, onClose, onAdd }) => {
  const [name, setName]   = React.useState('');
  const [color, setColor] = React.useState('#6366F1');

  const palette = [
    { color:'#6366F1', bg:'#EEF2FF' },
    { color:'#10B981', bg:'#DCFCE7' },
    { color:'#F59E0B', bg:'#FEF3C7' },
    { color:'#EC4899', bg:'#FDF2F8' },
    { color:'#8B5CF6', bg:'#F5F3FF' },
    { color:'#14B8A6', bg:'#CCFBF1' },
    { color:'#EF4444', bg:'#FEF2F2' },
    { color:'#3B82F6', bg:'#EFF6FF' },
  ];
  const active = palette.find(p => p.color === color) || palette[0];

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', zIndex:200, backdropFilter:'blur(3px)', WebkitBackdropFilter:'blur(3px)' }}/>

      {/* Sheet */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:201, background:t.card, borderRadius:'22px 22px 0 0', padding:'14px 20px 44px', boxShadow:`0 -4px 40px rgba(0,0,0,${dark?'0.5':'0.12'})`, transition:'background 0.3s' }}>

        {/* Drag handle */}
        <div style={{ width:36, height:4, borderRadius:2, background:t.border2, margin:'0 auto 20px' }}/>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ fontSize:18, fontWeight:800, color:t.text, margin:0 }}>Nouveau dossier</h3>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:8, border:'none', background:t.card2, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <IcX s={14} c={t.text3}/>
          </button>
        </div>

        {/* Preview */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22, padding:'14px 16px', borderRadius:14, background:t.card2, border:`1px solid ${t.border}` }}>
          <div style={{ width:46, height:46, borderRadius:14, background:active.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <IcFolderNav s={22} c={color} filled/>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:name ? t.text : t.text3, marginBottom:2 }}>{name || 'Nom du dossier'}</div>
            <div style={{ fontSize:12, color:t.text3 }}>0 note</div>
          </div>
        </div>

        {/* Name input */}
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:11, fontWeight:700, color:t.text3, textTransform:'uppercase', letterSpacing:0.7, display:'block', marginBottom:8 }}>Nom</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex : Recettes, Voyage…"
            autoFocus
            style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:`1.5px solid ${t.border2}`, outline:'none', fontSize:14, color:t.text, background:t.inputBg, fontFamily:'inherit', boxSizing:'border-box', transition:'background 0.3s, border-color 0.3s' }}
          />
        </div>

        {/* Color picker */}
        <div style={{ marginBottom:24 }}>
          <label style={{ fontSize:11, fontWeight:700, color:t.text3, textTransform:'uppercase', letterSpacing:0.7, display:'block', marginBottom:10 }}>Couleur</label>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {palette.map(p => (
              <div key={p.color} onClick={() => setColor(p.color)} style={{ width:38, height:38, borderRadius:11, background:p.bg, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:`2.5px solid ${color===p.color ? p.color : 'transparent'}`, transition:'border 0.15s', boxSizing:'border-box' }}>
                <div style={{ width:16, height:16, borderRadius:5, background:p.color }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:'13px', borderRadius:12, border:`1.5px solid ${t.border2}`, background:'transparent', fontSize:14, fontWeight:700, color:t.text2, cursor:'pointer', fontFamily:'inherit' }}>
            Annuler
          </button>
          <button
            onClick={() => { if (name.trim()) { onAdd({ name: name.trim(), color, bg: active.bg }); onClose(); } }}
            style={{ flex:1, padding:'13px', borderRadius:12, border:'none', background:name.trim() ? color : t.border2, fontSize:14, fontWeight:700, color:'white', cursor:'pointer', fontFamily:'inherit', transition:'background 0.2s', opacity:name.trim()?1:0.6 }}
          >
            Créer
          </button>
        </div>
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════
// HOME PAGE
// ════════════════════════════════════════════════════════════
const HomePage = ({ dark, t, onNoteSelect, onNavigate, notes }) => {
  const pinned = notes.filter(n => n.pinned);
  const recent = notes.filter(n => !n.pinned).slice(0, 3);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.bg, transition:'background 0.3s' }}>
      {/* Header */}
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <div>
            <p style={{ fontSize:12, color:t.text3, fontWeight:500, margin:'0 0 3px', textTransform:'capitalize' }}>{todayLabel()}</p>
            <h1 style={{ fontSize:24, fontWeight:800, color:t.text, margin:0 }}>{getGreeting()}, Alex 👋</h1>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <IconBtn t={t}><IcSearch s={16} c={t.text2}/></IconBtn>
            <IconBtn primary t={t} onClick={() => onNavigate('notes')}><IcPlus s={16} c="white"/></IconBtn>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display:'flex', gap:10, marginBottom:22 }}>
          {[
            { label:'Notes', value: notes.length },
            { label:'Épinglées', value: pinned.length },
          ].map(s => (
            <div key={s.label} style={{ flex:1, background:t.card, borderRadius:14, padding:'12px 14px', boxShadow:t.shadow, transition:'background 0.3s' }}>
              <div style={{ fontSize:22, fontWeight:800, color:t.text }}>{s.value}</div>
              <div style={{ fontSize:11.5, color:t.text3, fontWeight:500, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
          <div style={{ flex:1, background:'linear-gradient(135deg,#6366F1,#7C3AED)', borderRadius:14, padding:'12px 14px', boxShadow:'0 4px 14px rgba(99,102,241,0.35)' }}>
            <div style={{ fontSize:22, fontWeight:800, color:'white' }}>{window.V2_FOLDERS?.length || 0}</div>
            <div style={{ fontSize:11.5, color:'rgba(255,255,255,0.65)', fontWeight:500, marginTop:2 }}>Dossiers</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 24px' }}>
        {/* Pinned */}
        {pinned.length > 0 && (
          <>
            <SectionHeader title="Épinglées" action="Voir tout" onAction={() => onNavigate('notes')} t={t}/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:22 }}>
              {pinned.map(note => (
                <Card key={note.id} onClick={() => onNoteSelect(note)} t={t} style={{ padding:'14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                    <NoteIcon note={note} size={26}/>
                    <span style={{ fontSize:13, fontWeight:700, color:t.text, lineHeight:1.2, flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{note.title}</span>
                    <IcPin s={11} c={t.text3}/>
                  </div>
                  <p style={{ fontSize:11.5, color:t.text2, margin:0, lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{note.preview}</p>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Recent */}
        {recent.length > 0 && (
          <>
            <SectionHeader title="Récentes" t={t}/>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {recent.map(note => (
                <Card key={note.id} onClick={() => onNoteSelect(note)} t={t} style={{ padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12 }}>
                  <NoteIcon note={note} size={40}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:t.text }}>{note.title}</span>
                      <span style={{ fontSize:10.5, color:t.text3, flexShrink:0, marginLeft:8 }}>{note.date}</span>
                    </div>
                    <p style={{ fontSize:12, color:t.text2, margin:'0 0 7px', lineHeight:1.55, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{note.preview}</p>
                    <div style={{ display:'flex', gap:5 }}>
                      {note.tags.slice(0,2).map(tag => <TagChip key={tag} label={tag} color={note.color} dark={dark}/>)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// NOTES PAGE
// ════════════════════════════════════════════════════════════
const NotesPage = ({ dark, t, onNoteSelect, onNewNote, notes }) => {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const filters = [
    { id:'all',    label:'Toutes' },
    { id:'pinned', label:'Épinglées' },
    { id:'recent', label:'Récentes' },
  ];

  const visible = notes.filter(n => {
    const q = search.toLowerCase();
    const match = !q || n.title.toLowerCase().includes(q) || n.preview.toLowerCase().includes(q);
    const filt  = filter === 'all' || (filter === 'pinned' && n.pinned) || filter === 'recent';
    return match && filt;
  });

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.bg, transition:'background 0.3s' }}>
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:t.text, margin:0 }}>Notes</h1>
          <IconBtn primary t={t} onClick={onNewNote}><IcPlus s={16} c="white"/></IconBtn>
        </div>
        <SearchBar placeholder="Rechercher une note…" value={search} onChange={setSearch} t={t}/>
        <div style={{ display:'flex', gap:8, marginBottom:16, overflowX:'auto' }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding:'6px 16px', borderRadius:20, border:'none', cursor:'pointer', background:filter===f.id ? t.accent : t.card, color:filter===f.id ? 'white' : t.text2, fontSize:12.5, fontWeight:600, whiteSpace:'nowrap', boxShadow:t.shadow, transition:'all 0.15s', fontFamily:'inherit' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 20px' }}>
        {visible.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:t.text3 }}>
            <div style={{ fontSize:38, marginBottom:10, opacity:0.5 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:600 }}>Aucune note trouvée</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {visible.map(note => (
              <Card key={note.id} onClick={() => onNoteSelect(note)} t={t} style={{ padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12 }}>
                <NoteIcon note={note} size={42}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:t.text }}>{note.title}</span>
                    <span style={{ fontSize:10.5, color:t.text3, flexShrink:0, marginLeft:8 }}>{note.date}</span>
                  </div>
                  <p style={{ fontSize:12.5, color:t.text2, margin:'0 0 8px', lineHeight:1.55, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{note.preview}</p>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', alignItems:'center' }}>
                    {note.pinned && <IcPin s={11} c={t.text3}/>}
                    {note.tags.slice(0,2).map(tag => <TagChip key={tag} label={tag} color={note.color} dark={dark}/>)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// FOLDERS PAGE
// ════════════════════════════════════════════════════════════
const FoldersPage = ({ dark, t, onNoteSelect, folders, onOpenAddFolder, notes }) => {
  const [activeFolder, setActiveFolder] = React.useState(null);

  if (activeFolder) {
    const fd = folders.find(f => f.name === activeFolder);
    const folderNotes = notes.filter(n => n.folder === activeFolder);
    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.bg, transition:'background 0.3s' }}>
        <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
            <button onClick={() => setActiveFolder(null)} style={{ display:'flex', alignItems:'center', gap:4, background:'transparent', border:'none', cursor:'pointer', padding:0 }}>
              <IcBack s={20} c={t.text}/>
            </button>
            <div style={{ width:38, height:38, borderRadius:12, background:fd?.bg||'#EEF2FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <IcFolderNav s={19} c={fd?.color||'#6366F1'} filled/>
            </div>
            <div>
              <h1 style={{ fontSize:20, fontWeight:800, color:t.text, margin:0 }}>{activeFolder}</h1>
              <span style={{ fontSize:12, color:t.text3 }}>{folderNotes.length} note{folderNotes.length!==1?'s':''}</span>
            </div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'0 20px 20px' }}>
          {folderNotes.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:t.text3 }}>
              <div style={{ fontSize:38, marginBottom:10, opacity:0.5 }}>📂</div>
              <div style={{ fontSize:14, fontWeight:600 }}>Dossier vide</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {folderNotes.map(note => (
                <Card key={note.id} onClick={() => onNoteSelect(note)} t={t} style={{ padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12 }}>
                  <NoteIcon note={note} size={40}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:t.text }}>{note.title}</span>
                      <span style={{ fontSize:10.5, color:t.text3 }}>{note.date}</span>
                    </div>
                    <p style={{ fontSize:12.5, color:t.text2, margin:0, lineHeight:1.55 }}>{note.preview}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.bg, transition:'background 0.3s' }}>
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:t.text, margin:0 }}>Dossiers</h1>
          <IconBtn primary t={t} onClick={onOpenAddFolder}><IcPlus s={16} c="white"/></IconBtn>
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 24px' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:22 }}>
          <div style={{ background:'linear-gradient(135deg,#6366F1,#7C3AED)', borderRadius:16, padding:'18px 16px', boxShadow:'0 4px 16px rgba(99,102,241,0.35)' }}>
            <div style={{ fontSize:28, fontWeight:800, color:'white' }}>{notes.length}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', marginTop:3, fontWeight:500 }}>Notes au total</div>
          </div>
          <Card t={t} style={{ padding:'18px 16px' }}>
            <div style={{ fontSize:28, fontWeight:800, color:t.text }}>{folders.length}</div>
            <div style={{ fontSize:12, color:t.text3, marginTop:3, fontWeight:500 }}>Dossiers</div>
          </Card>
        </div>

        <SectionHeader title="Mes dossiers" t={t}/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {folders.map(folder => (
            <Card key={folder.id} onClick={() => setActiveFolder(folder.name)} t={t} style={{ padding:'16px' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:folder.bg, marginBottom:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <IcFolderNav s={20} c={folder.color} filled/>
              </div>
              <div style={{ fontSize:13.5, fontWeight:700, color:t.text, marginBottom:3 }}>{folder.name}</div>
              <div style={{ fontSize:11.5, color:t.text3, fontWeight:500 }}>{folder.count} note{folder.count!==1?'s':''}</div>
            </Card>
          ))}

          {/* Add folder ghost card */}
          <div onClick={onOpenAddFolder} style={{ borderRadius:16, border:`2px dashed ${t.border2}`, padding:'16px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, minHeight:110 }}>
            <div style={{ width:36, height:36, borderRadius:11, background:t.card2, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <IcPlus s={16} c={t.text3}/>
            </div>
            <span style={{ fontSize:12.5, fontWeight:600, color:t.text3 }}>Nouveau</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// SETTINGS PAGE (stripped — personal use)
// ════════════════════════════════════════════════════════════
const SettingsPage = ({ dark, t, onToggleDark }) => {
  const [notifs, setNotifs] = React.useState(true);
  const [sync,   setSync]   = React.useState(true);

  const Toggle = ({ on, onChange }) => (
    <div onClick={() => onChange(!on)} style={{ width:44, height:26, borderRadius:13, background:on?'#6366F1':'#CBD5E1', position:'relative', cursor:'pointer', transition:'background 0.25s', flexShrink:0 }}>
      <div style={{ position:'absolute', top:3, left:on?21:3, width:20, height:20, borderRadius:'50%', background:'white', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.2s' }}/>
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom:18 }}>
      <div style={{ fontSize:11, fontWeight:700, color:t.text3, textTransform:'uppercase', letterSpacing:0.8, marginBottom:8, paddingLeft:4 }}>{title}</div>
      <div style={{ background:t.card, borderRadius:16, overflow:'hidden', boxShadow:t.shadow, transition:'background 0.3s' }}>{children}</div>
    </div>
  );

  const Row = ({ emoji, bg, label, right, last }) => (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom:last?'none':`1px solid ${t.border}` }}>
      <div style={{ width:34, height:34, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{emoji}</div>
      <span style={{ flex:1, fontSize:14, fontWeight:500, color:t.text }}>{label}</span>
      {right}
    </div>
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.bg, transition:'background 0.3s' }}>
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:t.text, margin:'0 0 22px' }}>Paramètres</h1>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 32px' }}>

        <Section title="Affichage">
          <Row emoji="🌙" bg={dark?'#1E1E2E':'#F1F5F9'} label="Mode sombre"
            right={<Toggle on={dark} onChange={onToggleDark}/>} last/>
        </Section>

        <Section title="Notifications">
          <Row emoji="🔔" bg="#FEF3C7" label="Notifications push"
            right={<Toggle on={notifs} onChange={setNotifs}/>} last/>
        </Section>

        <Section title="Données">
          <Row emoji="☁️" bg="#EEF2FF" label="Synchronisation"
            right={<Toggle on={sync} onChange={setSync}/>}/>
          <Row emoji="💾" bg="#F0FDF4" label="Stockage utilisé"
            right={<span style={{ fontSize:12.5, color:t.text3, fontWeight:500 }}>2,3 Go</span>}/>
          <Row emoji="🔒" bg="#FEE2E2" label="Sécurité"
            right={<IcChevronR s={14} c={t.text3}/>} last/>
        </Section>

      </div>
    </div>
  );
};

Object.assign(window, { AddFolderModal, HomePage, NotesPage, FoldersPage, SettingsPage });
