// notes-pages.jsx — HomePage, NotesPage, FoldersPage, SettingsPage

// ════════════════════════════════════════════════════════════
// HOME PAGE
// ════════════════════════════════════════════════════════════
const HomePage = ({ onNoteSelect, onNavigate }) => {
  const pinned = window.NOTES_DATA.filter(n => n.pinned);
  const recent = window.NOTES_DATA.filter(n => !n.pinned)[0];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F7F7F9' }}>
      {/* ── Header ── */}
      <div style={{ paddingTop: 62, padding: '62px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', margin: 0 }}>Accueil</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <IconBtn><IcSearch s={17} c="#4F46E5" /></IconBtn>
            <IconBtn onClick={() => onNavigate('folders')}><IcFolder s={17} c="#4F46E5" /></IconBtn>
            <IconBtn primary onClick={() => onNavigate('notes')}><IcPlus s={17} c="white" /></IconBtn>
          </div>
        </div>
      </div>

      {/* ── Scroll body ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }}>

        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          borderRadius: 20, padding: '20px 20px', marginBottom: 24,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute', top:-24, right:-24, width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }}/>
          <div style={{ position:'absolute', bottom:-32, right:32, width:72, height:72, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:11.5, fontWeight:600, letterSpacing:0.8, textTransform:'uppercase', margin:'0 0 6px' }}>Bienvenue</p>
          <h2 style={{ color:'white', fontSize:18, fontWeight:800, margin:'0 0 6px', lineHeight:1.25 }}>Organisez vos idées,<br/>retrouvez-les en un instant.</h2>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:12, margin:'0 0 16px', lineHeight:1.5 }}>
            Capturez tout ce qui compte dans un espace sobre et efficace.
          </p>
          <button
            onClick={() => onNavigate('notes')}
            style={{
              background:'white', color:'#4F46E5', border:'none', borderRadius:10,
              padding:'8px 18px', fontSize:12.5, fontWeight:700, cursor:'pointer',
            }}>
            Commencer →
          </button>
        </div>

        {/* Pinned grid */}
        <SectionHeader title="Épinglées" action="Voir tout" onAction={() => onNavigate('notes')} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
          {pinned.map(note => (
            <Card key={note.id} onClick={() => onNoteSelect(note)} style={{ padding:'14px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <NoteIcon note={note} size={26} />
                  <span style={{ fontSize:13, fontWeight:700, color:'#0F172A', lineHeight:1.2 }}>{note.title}</span>
                </div>
                <IcPin s={12} c="#CBD5E1" />
              </div>
              <p style={{
                fontSize:11.5, color:'#64748B', margin:0, lineHeight:1.55,
                display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden',
              }}>{note.preview}</p>
            </Card>
          ))}
        </div>

        {/* Single recent card */}
        {recent && (
          <Card onClick={() => onNoteSelect(recent)} style={{ padding:'14px', marginBottom:12 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <NoteIcon note={recent} size={26} />
                <span style={{ fontSize:13, fontWeight:700, color:'#0F172A' }}>{recent.title}</span>
              </div>
              <span style={{ fontSize:10, color:'#94A3B8' }}>{recent.date}</span>
            </div>
            <p style={{ fontSize:11.5, color:'#64748B', margin:'0 0 8px', lineHeight:1.55 }}>{recent.preview}</p>
            <div style={{ display:'flex', gap:5 }}>
              {recent.tags.slice(0,2).map(t => <TagChip key={t} label={t} color={recent.color} />)}
            </div>
          </Card>
        )}

        {/* Pro banner */}
        <Card style={{ padding:'13px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:42, height:42, borderRadius:12, flexShrink:0,
              background:'linear-gradient(135deg, #FF6B35 0%, #F7C59F 100%)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18,
            }}>%</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, fontWeight:700, color:'#0F172A' }}>Mode Pro Actif →</div>
              <div style={{ fontSize:11.5, color:'#94A3B8', marginTop:2 }}>Profitez de 30% sur votre premier achat</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// NOTES PAGE
// ════════════════════════════════════════════════════════════
const NotesPage = ({ onNoteSelect, onNewNote }) => {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const filterDefs = [
    { id:'all', label:'Toutes' },
    { id:'pinned', label:'Épinglées' },
    { id:'recent', label:'Récentes' },
  ];

  const visible = window.NOTES_DATA.filter(n => {
    const q = search.toLowerCase();
    const match = !q || n.title.toLowerCase().includes(q) || n.preview.toLowerCase().includes(q);
    const filt = filter === 'all' || (filter === 'pinned' && n.pinned) || filter === 'recent';
    return match && filt;
  });

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'#F7F7F9' }}>
      {/* Header */}
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', margin:0 }}>Notes</h1>
          <IconBtn primary onClick={onNewNote}><IcPlus s={17} c="white" /></IconBtn>
        </div>
        <SearchBar placeholder="Rechercher une note…" value={search} onChange={setSearch} />
        <div style={{ display:'flex', gap:8, marginBottom:16, overflowX:'auto' }}>
          {filterDefs.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding:'6px 16px', borderRadius:20, border:'none', cursor:'pointer',
              background: filter === f.id ? '#4F46E5' : 'white',
              color: filter === f.id ? 'white' : '#64748B',
              fontSize:12.5, fontWeight:600, whiteSpace:'nowrap',
              boxShadow:'0 1px 3px rgba(0,0,0,0.06)',
              transition:'all 0.15s',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 20px' }}>
        {visible.length === 0 ? (
          <div style={{ textAlign:'center', padding:'50px 0', color:'#94A3B8' }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:600 }}>Aucune note trouvée</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {visible.map(note => (
              <Card key={note.id} onClick={() => onNoteSelect(note)} style={{ padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12 }}>
                <NoteIcon note={note} size={42} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:'#0F172A' }}>{note.title}</span>
                    <span style={{ fontSize:10.5, color:'#94A3B8', flexShrink:0, marginLeft:8 }}>{note.date}</span>
                  </div>
                  <p style={{
                    fontSize:12.5, color:'#64748B', margin:'0 0 8px', lineHeight:1.5,
                    display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
                  }}>{note.preview}</p>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', alignItems:'center' }}>
                    {note.pinned && <IcPin s={11} c="#94A3B8" />}
                    {note.tags.slice(0,2).map(t => <TagChip key={t} label={t} color={note.color} />)}
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
const FoldersPage = ({ onNoteSelect }) => {
  const [activeFolder, setActiveFolder] = React.useState(null);

  if (activeFolder) {
    const fd = window.FOLDERS_DATA.find(f => f.name === activeFolder);
    const folderNotes = window.NOTES_DATA.filter(n => n.folder === activeFolder);
    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'#F7F7F9' }}>
        <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <button onClick={() => setActiveFolder(null)} style={{
              display:'flex', alignItems:'center', gap:5,
              background:'transparent', border:'none', cursor:'pointer',
            }}>
              <IcBack s={20} c="#0F172A" />
              <span style={{ fontSize:14, fontWeight:600, color:'#0F172A' }}>Dossiers</span>
            </button>
            <IconBtn primary><IcPlus s={17} c="white" /></IconBtn>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:fd.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <IcFolderNav s={20} c={fd.color} filled />
            </div>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:'#0F172A', margin:0 }}>{activeFolder}</h1>
              <span style={{ fontSize:12, color:'#94A3B8' }}>{folderNotes.length} note{folderNotes.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'0 20px 20px' }}>
          {folderNotes.length === 0 ? (
            <div style={{ textAlign:'center', padding:'50px 0', color:'#94A3B8' }}>
              <div style={{ fontSize:36, marginBottom:10 }}>📂</div>
              <div style={{ fontSize:14, fontWeight:600 }}>Dossier vide</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {folderNotes.map(note => (
                <Card key={note.id} onClick={() => onNoteSelect(note)} style={{ padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12 }}>
                  <NoteIcon note={note} size={40} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:'#0F172A' }}>{note.title}</span>
                      <span style={{ fontSize:10.5, color:'#94A3B8' }}>{note.date}</span>
                    </div>
                    <p style={{ fontSize:12.5, color:'#64748B', margin:0, lineHeight:1.5 }}>{note.preview}</p>
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
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'#F7F7F9' }}>
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', margin:0 }}>Dossiers</h1>
          <IconBtn primary><IcPlus s={17} c="white" /></IconBtn>
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 24px' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
          <Card style={{ padding:'18px 16px', background:'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
            <div style={{ fontSize:28, fontWeight:800, color:'white' }}>{window.NOTES_DATA.length}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', marginTop:3, fontWeight:500 }}>Notes au total</div>
          </Card>
          <Card style={{ padding:'18px 16px' }}>
            <div style={{ fontSize:28, fontWeight:800, color:'#0F172A' }}>{window.FOLDERS_DATA.length}</div>
            <div style={{ fontSize:12, color:'#94A3B8', marginTop:3, fontWeight:500 }}>Dossiers</div>
          </Card>
        </div>

        <SectionHeader title="Mes dossiers" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {window.FOLDERS_DATA.map(folder => (
            <Card key={folder.id} onClick={() => setActiveFolder(folder.name)} style={{ padding:'16px' }}>
              <div style={{
                width:40, height:40, borderRadius:12,
                background:folder.bg, marginBottom:10,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <IcFolderNav s={20} c={folder.color} filled />
              </div>
              <div style={{ fontSize:13.5, fontWeight:700, color:'#0F172A', marginBottom:3 }}>{folder.name}</div>
              <div style={{ fontSize:11.5, color:'#94A3B8', fontWeight:500 }}>{folder.count} notes</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ════════════════════════════════════════════════════════════
const SettingsPage = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifs, setNotifs] = React.useState(true);
  const [sync, setSync] = React.useState(true);

  const Toggle = ({ on, onChange }) => (
    <div onClick={() => onChange(!on)} style={{
      width:44, height:26, borderRadius:13,
      background: on ? '#4F46E5' : '#E2E8F0',
      position:'relative', cursor:'pointer',
      transition:'background 0.2s',
      flexShrink:0,
    }}>
      <div style={{
        position:'absolute', top:3, left: on ? 21 : 3,
        width:20, height:20, borderRadius:'50%',
        background:'white', boxShadow:'0 1px 4px rgba(0,0,0,0.18)',
        transition:'left 0.2s',
      }}/>
    </div>
  );

  const Row = ({ bg, emoji, label, right, last }) => (
    <div style={{
      display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
      borderBottom: last ? 'none' : '1px solid #F8FAFC',
    }}>
      <div style={{
        width:34, height:34, borderRadius:10, background:bg, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
      }}>{emoji}</div>
      <span style={{ flex:1, fontSize:14, fontWeight:500, color:'#0F172A' }}>{label}</span>
      {right}
    </div>
  );

  const groups = [
    { title:'Préférences', rows:[
      { bg:'#F1F5F9', emoji:'🌙', label:'Mode sombre', right:<Toggle on={darkMode} onChange={setDarkMode}/> },
      { bg:'#FEF3C7', emoji:'🔔', label:'Notifications', right:<Toggle on={notifs} onChange={setNotifs}/>, last:true },
    ]},
    { title:'Compte', rows:[
      { bg:'#EEF2FF', emoji:'☁️', label:'Synchronisation', right:<Toggle on={sync} onChange={setSync}/> },
      { bg:'#FEE2E2', emoji:'🔒', label:'Sécurité', right:<IcChevronRight s={15} c="#CBD5E1"/> },
      { bg:'#F0FDF4', emoji:'💾', label:'Stockage', right:<span style={{fontSize:12,color:'#94A3B8',fontWeight:500}}>2,3 GB utilisés</span>, last:true },
    ]},
    { title:'À propos', rows:[
      { bg:'#F5F3FF', emoji:'📱', label:"Version de l'app", right:<span style={{fontSize:12,color:'#94A3B8',fontWeight:500}}>v2.0.1</span> },
      { bg:'#FEF3C7', emoji:'💬', label:'Aide & Support', right:<IcChevronRight s={15} c="#CBD5E1"/>, last:true },
    ]},
  ];

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'#F7F7F9' }}>
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', margin:'0 0 20px' }}>Paramètres</h1>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 24px' }}>
        {/* Profile card */}
        <Card style={{ padding:'18px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:14 }}>
          <div style={{
            width:54, height:54, borderRadius:16, flexShrink:0,
            background:'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:22, color:'white', fontWeight:800,
          }}>A</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16, fontWeight:800, color:'#0F172A' }}>Alex Martin</div>
            <div style={{ fontSize:12.5, color:'#94A3B8', marginTop:2 }}>alex.martin@email.com</div>
          </div>
          <button style={{
            padding:'7px 14px', borderRadius:10, border:'1.5px solid #E2E8F0',
            background:'transparent', fontSize:12.5, fontWeight:700,
            color:'#4F46E5', cursor:'pointer',
          }}>Modifier</button>
        </Card>

        {/* Groups */}
        {groups.map(g => (
          <div key={g.title} style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#94A3B8', letterSpacing:0.8, textTransform:'uppercase', marginBottom:8, paddingLeft:4 }}>
              {g.title}
            </div>
            <Card>
              {g.rows.map((r, i) => <Row key={i} {...r} />)}
            </Card>
          </div>
        ))}

        {/* Logout */}
        <button style={{
          width:'100%', padding:'14px', borderRadius:16, border:'none',
          background:'#FEF2F2', color:'#DC2626', fontSize:14,
          fontWeight:700, cursor:'pointer', marginTop:4,
        }}>Déconnexion</button>
      </div>
    </div>
  );
};

Object.assign(window, { HomePage, NotesPage, FoldersPage, SettingsPage });
