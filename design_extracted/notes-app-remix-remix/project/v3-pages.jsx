// v3-pages.jsx — HomePage, NotesPage (with # tags), FoldersPage (subfolders), SettingsPage

const todayFR = () => new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
const greet   = () => { const h=new Date().getHours(); return h<5?'Bonne nuit':h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir'; };

// ════════════════════════════════════════════════════════════
// HOME PAGE
// ════════════════════════════════════════════════════════════
const HomePage = ({ dark, t, notes, onNoteSelect, onNavigate, onTogglePin }) => {
  const pinned = notes.filter(n=>n.pinned);
  const recent = notes.filter(n=>!n.pinned).slice(0,3);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.bg, transition:'background .3s' }}>
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <p style={{ fontSize:12, color:t.text3, fontWeight:500, margin:'0 0 3px', textTransform:'capitalize' }}>{todayFR()}</p>
            <h1 style={{ fontSize:23, fontWeight:800, color:t.text, margin:0 }}>{greet()}, Alex 👋</h1>
          </div>
          <IconBtn primary t={t} onClick={()=>onNavigate('notes')} style={{ marginTop:4 }}>
            <IcPlus s={16} c={t.btnText}/>
          </IconBtn>
        </div>

        {/* Stats strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:22 }}>
          {[{v:notes.length,l:'Notes'},{v:pinned.length,l:'Épinglées'},{v:window.V3_FOLDERS?.length||0,l:'Dossiers'}].map(s=>(
            <div key={s.l} style={{ background:t.card, borderRadius:14, padding:'12px 14px', boxShadow:t.shadow, transition:'background .3s' }}>
              <div style={{ fontSize:22, fontWeight:800, color:t.text }}>{s.v}</div>
              <div style={{ fontSize:11, color:t.text3, fontWeight:500, marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 24px' }}>
        {/* Pinned grid */}
        {pinned.length>0 && (
          <>
            <SectionHeader title="Épinglées" action="Voir tout" onAction={()=>onNavigate('notes')} t={t}/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:22 }}>
              {pinned.map(note=>(
                <NoteCard key={note.id} note={note} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark} compact/>
              ))}
            </div>
          </>
        )}

        {/* Recent list */}
        {recent.length>0 && (
          <>
            <SectionHeader title="Récentes" t={t}/>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {recent.map(note=>(
                <NoteCard key={note.id} note={note} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark}/>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// NOTES PAGE  (with # tag browser)
// ════════════════════════════════════════════════════════════
const NotesPage = ({ dark, t, notes, onNoteSelect, onNewNote, onTogglePin }) => {
  const [search,    setSearch]    = React.useState('');
  const [filter,    setFilter]    = React.useState('all');
  const [tagFilter, setTagFilter] = React.useState(null);
  const [showTags,  setShowTags]  = React.useState(false);

  // Collect all unique tags
  const allTags = React.useMemo(()=>[...new Set(notes.flatMap(n=>n.tags))], [notes]);

  const visible = notes.filter(n=>{
    const q = search.toLowerCase();
    const matchQ = !q || n.title.toLowerCase().includes(q) || (n.body||'').toLowerCase().includes(q) || n.tags.some(t=>t.toLowerCase().includes(q));
    const matchF = filter==='all' || (filter==='pinned'&&n.pinned) || filter==='recent';
    const matchT = !tagFilter || n.tags.includes(tagFilter);
    return matchQ && matchF && matchT;
  });

  const filters = [{id:'all',l:'Toutes'},{id:'pinned',l:'Épinglées'},{id:'recent',l:'Récentes'}];

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.bg, transition:'background .3s' }}>
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:t.text, margin:0 }}>Notes</h1>
          <div style={{ display:'flex', gap:8 }}>
            {/* # Tag toggle */}
            <IconBtn t={t} onClick={()=>{ setShowTags(s=>!s); setTagFilter(null); }}
              style={{ background:showTags?t.accent:t.card }}>
              <IcHash s={16} c={showTags?t.btnText:t.text2}/>
            </IconBtn>
            <IconBtn primary t={t} onClick={onNewNote}><IcPlus s={16} c={t.btnText}/></IconBtn>
          </div>
        </div>
        <SearchBar placeholder="Rechercher…" value={search} onChange={v=>{setSearch(v);setTagFilter(null);}} t={t}/>

        {/* Tag browser (shown when # is active) */}
        {showTags && (
          <div style={{ marginBottom:14 }}>
            <p style={{ fontSize:11, fontWeight:700, color:t.text3, textTransform:'uppercase', letterSpacing:.8, margin:'0 0 8px' }}>Tags</p>
            <div style={{ display:'flex', gap:7, overflowX:'auto', flexWrap:'nowrap', paddingBottom:4 }}>
              <button onClick={()=>setTagFilter(null)} style={{ padding:'5px 13px', borderRadius:20, border:`1.5px solid ${!tagFilter?t.accent:t.border}`, background:!tagFilter?t.accentBg:'transparent', fontSize:12, fontWeight:600, color:!tagFilter?t.accent:t.text2, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', flexShrink:0 }}>
                Toutes
              </button>
              {allTags.map(tag=>{
                const note = notes.find(n=>n.tags.includes(tag));
                const col  = note?.color||'#888';
                const active = tagFilter===tag;
                return (
                  <button key={tag} onClick={()=>setTagFilter(active?null:tag)}
                    style={{ padding:'5px 13px', borderRadius:20, border:`1.5px solid ${active?col:t.border}`, background:active?`${col}18`:'transparent', fontSize:12, fontWeight:600, color:active?col:t.text2, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', flexShrink:0 }}>
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter pills */}
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {filters.map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{ padding:'6px 16px', borderRadius:20, border:'none', cursor:'pointer', background:filter===f.id?t.accent:t.card, color:filter===f.id?t.btnText:t.text2, fontSize:12.5, fontWeight:600, whiteSpace:'nowrap', boxShadow:t.shadow, transition:'all .15s', fontFamily:'inherit' }}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 20px' }}>
        {tagFilter && (
          <div style={{ marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:13, color:t.text2 }}>Filtre :</span>
            <span style={{ fontSize:13, fontWeight:700, color:t.accent }}>#{tagFilter}</span>
            <button onClick={()=>setTagFilter(null)} style={{ background:'transparent', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center' }}><IcX s={13} c={t.text3}/></button>
          </div>
        )}
        {visible.length===0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:t.text3 }}>
            <div style={{ fontSize:36, marginBottom:10, opacity:.4 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:600 }}>Aucune note trouvée</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {visible.map(note=>(
              <NoteCard key={note.id} note={note} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// FOLDERS PAGE  (with subfolders)
// ════════════════════════════════════════════════════════════
const FoldersPage = ({ dark, t, notes, folders, onNoteSelect, onOpenAddFolder, onTogglePin, subfolders={}, onAddSubfolder }) => {
  const [activeFolder,    setActiveFolder]    = React.useState(null);
  const [activeSubfolder, setActiveSubfolder] = React.useState(null);
  const [showAddSub,      setShowAddSub]      = React.useState(false);

  const addSubfolder = (fd) => {
    if (onAddSubfolder && activeFolder) onAddSubfolder(activeFolder, { id:Date.now(), ...fd });
  };

  // Subfolder detail view
  if (activeFolder && activeSubfolder) {
    const subs = subfolders[activeFolder]||[];
    const sf   = subs.find(s=>s.name===activeSubfolder)||{};
    const sfNotes = notes.filter(n=>n.folder===activeFolder && n.subfolder===activeSubfolder);
    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.bg, transition:'background .3s' }}>
        <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
            <button onClick={()=>setActiveSubfolder(null)} style={{ background:'transparent', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center' }}>
              <IcBack s={20} c={t.text}/>
            </button>
            <div style={{ width:36,height:36,borderRadius:11,background:sf.bg||'#EEF2FF',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <IcFolderN s={18} c={sf.color||'#6366F1'} filled/>
            </div>
            <div>
              <h1 style={{ fontSize:19,fontWeight:800,color:t.text,margin:0 }}>{activeSubfolder}</h1>
              <span style={{ fontSize:12,color:t.text3 }}>{sfNotes.length} note{sfNotes.length!==1?'s':''}</span>
            </div>
          </div>
        </div>
        <div style={{ flex:1,overflowY:'auto',padding:'0 20px 20px' }}>
          {sfNotes.length===0
            ? <div style={{ textAlign:'center',padding:'60px 0',color:t.text3 }}><div style={{ fontSize:36,opacity:.35,marginBottom:10 }}>📂</div><div style={{ fontSize:14,fontWeight:600 }}>Sous-dossier vide</div></div>
            : <div style={{ display:'flex',flexDirection:'column',gap:10 }}>{sfNotes.map(n=><NoteCard key={n.id} note={n} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark}/>)}</div>
          }
        </div>
      </div>
    );
  }

  // Folder detail view
  if (activeFolder) {
    const fd       = folders.find(f=>f.name===activeFolder)||{};
    const fNotes   = notes.filter(n=>n.folder===activeFolder && !n.subfolder);
    const subs     = subfolders[activeFolder]||[];

    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.bg, transition:'background .3s' }}>
        <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <button onClick={()=>setActiveFolder(null)} style={{ background:'transparent',border:'none',cursor:'pointer',padding:0,display:'flex',alignItems:'center' }}><IcBack s={20} c={t.text}/></button>
              <div style={{ width:38,height:38,borderRadius:12,background:fd.bg||'#EEF2FF',display:'flex',alignItems:'center',justifyContent:'center' }}><IcFolderN s={19} c={fd.color||'#6366F1'} filled/></div>
              <div>
                <h1 style={{ fontSize:20,fontWeight:800,color:t.text,margin:0 }}>{activeFolder}</h1>
                <span style={{ fontSize:12,color:t.text3 }}>{fNotes.length} note{fNotes.length!==1?'s':''}</span>
              </div>
            </div>
            <IconBtn t={t} onClick={()=>setShowAddSub(true)}><IcPlus s={16} c={t.text2}/></IconBtn>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'0 20px 20px' }}>
          {/* Sub-folders */}
          {subs.length>0 && (
            <div style={{ marginBottom:20 }}>
              <SectionHeader title="Sous-dossiers" t={t}/>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {subs.map(sf=>(
                  <div key={sf.id} onClick={()=>setActiveSubfolder(sf.name)} style={{ background:t.card, borderRadius:14, padding:'13px 14px', boxShadow:t.shadow, cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'background .3s' }}>
                    <div style={{ width:32,height:32,borderRadius:9,background:sf.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}><IcFolderN s={16} c={sf.color} filled/></div>
                    <div>
                      <div style={{ fontSize:13,fontWeight:700,color:t.text }}>{sf.name}</div>
                      <div style={{ fontSize:11,color:t.text3 }}>0 note</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes in folder */}
          <SectionHeader title="Notes" t={t}/>
          {fNotes.length===0
            ? <div style={{ textAlign:'center',padding:'40px 0',color:t.text3 }}><div style={{ fontSize:36,opacity:.35,marginBottom:10 }}>📝</div><div style={{ fontSize:14,fontWeight:600 }}>Aucune note</div></div>
            : <div style={{ display:'flex',flexDirection:'column',gap:10 }}>{fNotes.map(n=><NoteCard key={n.id} note={n} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark}/>)}</div>
          }
        </div>

        {showAddSub && <AddFolderModal t={t} dark={dark} onClose={()=>setShowAddSub(false)} onAdd={addSubfolder} parentFolder={activeFolder}/>}
      </div>
    );
  }

  // Root folders view
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.bg, transition:'background .3s' }}>
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:t.text, margin:0 }}>Dossiers</h1>
          <IconBtn primary t={t} onClick={onOpenAddFolder}><IcPlus s={16} c={t.btnText}/></IconBtn>
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 24px' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:22 }}>
          <div style={{ background:t.accent, borderRadius:16, padding:'18px 16px', boxShadow:`0 4px 16px rgba(0,0,0,.18)` }}>
            <div style={{ fontSize:28, fontWeight:800, color:t.btnText }}>{notes.length}</div>
            <div style={{ fontSize:12, color:dark?'rgba(10,10,10,.5)':'rgba(255,255,255,.6)', marginTop:3, fontWeight:500 }}>Notes au total</div>
          </div>
          <Card t={t} style={{ padding:'18px 16px' }}>
            <div style={{ fontSize:28, fontWeight:800, color:t.text }}>{folders.length}</div>
            <div style={{ fontSize:12, color:t.text3, marginTop:3, fontWeight:500 }}>Dossiers</div>
          </Card>
        </div>

        <SectionHeader title="Mes dossiers" t={t}/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {folders.map(folder=>(
            <Card key={folder.id} onClick={()=>setActiveFolder(folder.name)} t={t} style={{ padding:'16px' }}>
              <div style={{ width:40,height:40,borderRadius:12,background:folder.bg,marginBottom:10,display:'flex',alignItems:'center',justifyContent:'center' }}>
                <IcFolderN s={20} c={folder.color} filled/>
              </div>
              <div style={{ fontSize:13.5, fontWeight:700, color:t.text, marginBottom:3 }}>{folder.name}</div>
              <div style={{ fontSize:11.5, color:t.text3 }}>{folder.count} note{folder.count!==1?'s':''}</div>
            </Card>
          ))}
          {/* Ghost card */}
          <div onClick={onOpenAddFolder} style={{ borderRadius:16, border:`2px dashed ${t.border2}`, padding:'16px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, minHeight:110 }}>
            <div style={{ width:34,height:34,borderRadius:10,background:t.card2,display:'flex',alignItems:'center',justifyContent:'center' }}><IcPlus s={15} c={t.text3}/></div>
            <span style={{ fontSize:12.5, fontWeight:600, color:t.text3 }}>Nouveau</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ════════════════════════════════════════════════════════════
const SettingsPage = ({ dark, t, onToggleDark, notes, folders, onSetNotes, onSetFolders, pinEnabled, onTogglePin2, onLockNow }) => {
  const [notifs,      setNotifs]      = React.useState(true);
  const [reminders,   setReminders]   = React.useState([]);
  const [showAddNotif,setShowAddNotif]= React.useState(false);
  const [showPINSetup,setShowPINSetup]= React.useState(false);
  const fileRef = React.useRef(null);

  // Storage size
  const storageSize = React.useMemo(()=>{
    const bytes = new TextEncoder().encode(JSON.stringify({notes,folders})).length;
    return bytes<1024?`${bytes} o`:`${(bytes/1024).toFixed(1)} Ko`;
  },[notes,folders]);

  // JSON export
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({notes,folders},null,2)],{type:'application/json'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href=url; a.download='notes-backup.json'; a.click();
    URL.revokeObjectURL(url);
  };

  // JSON import
  const importJSON = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.notes)   onSetNotes(data.notes);
        if (data.folders) onSetFolders(data.folders);
      } catch { alert('Fichier JSON invalide.'); }
    };
    reader.readAsText(file);
    e.target.value='';
  };

  const Toggle = ({ on, onChange }) => (
    <div onClick={()=>onChange(!on)} style={{ width:44,height:26,borderRadius:13,background:on?t.accent:'rgba(120,120,128,.2)',position:'relative',cursor:'pointer',transition:'background .25s',flexShrink:0 }}>
      <div style={{ position:'absolute',top:3,left:on?21:3,width:20,height:20,borderRadius:'50%',background:'white',boxShadow:'0 1px 4px rgba(0,0,0,.25)',transition:'left .2s' }}/>
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:11, fontWeight:700, color:t.text3, textTransform:'uppercase', letterSpacing:.8, marginBottom:8, paddingLeft:4 }}>{title}</div>
      <div style={{ background:t.card, borderRadius:16, overflow:'hidden', boxShadow:t.shadow, transition:'background .3s' }}>{children}</div>
    </div>
  );

  const Row = ({ emoji, label, right, last, onClick }) => (
    <div onClick={onClick} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom:last?'none':`1px solid ${t.border}`, cursor:onClick?'pointer':'default' }}>
      <div style={{ width:34,height:34,borderRadius:10,background:t.card2,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,transition:'background .3s' }}>{emoji}</div>
      <span style={{ flex:1, fontSize:14, fontWeight:500, color:t.text }}>{label}</span>
      {right}
    </div>
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.bg, transition:'background .3s' }}>
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:t.text, margin:'0 0 22px' }}>Paramètres</h1>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 32px' }}>

        <Section title="Affichage">
          <Row emoji="🌙" label="Mode sombre" right={<Toggle on={dark} onChange={onToggleDark}/>} last/>
        </Section>

        <Section title="Notifications">
          <Row emoji="🔔" label="Notifications push" right={<Toggle on={notifs} onChange={setNotifs}/>}/>
          {notifs && reminders.length>0 && reminders.map((r,i)=>(
            <div key={r.id} style={{ display:'flex', alignItems:'center', padding:'10px 16px', borderBottom:i<reminders.length-1?`1px solid ${t.border}`:'none', gap:12 }}>
              <IcBell s={14} c={t.text3}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{r.title}</div>
                {(r.date||r.time)&&<div style={{ fontSize:11, color:t.text3, marginTop:1 }}>{r.date} {r.time}</div>}
              </div>
              <button onClick={()=>setReminders(rs=>rs.filter(x=>x.id!==r.id))} style={{ background:'transparent',border:'none',cursor:'pointer',padding:0,display:'flex',alignItems:'center' }}><IcX s={13} c={t.text3}/></button>
            </div>
          ))}
          {notifs && (
            <div onClick={()=>setShowAddNotif(true)} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 16px', cursor:'pointer', borderTop:reminders.length>0?`1px solid ${t.border}`:'none' }}>
              <IcPlus s={15} c={t.text3}/><span style={{ fontSize:13, color:t.text3, fontWeight:600 }}>Ajouter un rappel</span>
            </div>
          )}
        </Section>

        <Section title="Sécurité">
          <Row emoji="🔒" label="Code PIN" right={<Toggle on={pinEnabled} onChange={onTogglePin2}/>}/>
          {pinEnabled && <Row emoji="🔐" label="Verrouiller maintenant" right={<IcChevronR s={14} c={t.text3}/>} onClick={onLockNow} last/>}
        </Section>

        <Section title="Données">
          <Row emoji="💾" label="Stockage utilisé" right={<span style={{ fontSize:12.5, color:t.text3, fontWeight:500 }}>{storageSize}</span>}/>
          <Row emoji="⬇️" label="Exporter (JSON)" right={<IcDownload s={15} c={t.text3}/>} onClick={exportJSON}/>
          <Row emoji="⬆️" label="Importer (JSON)" right={<IcUpload s={15} c={t.text3}/>} onClick={()=>fileRef.current?.click()} last/>
          <input ref={fileRef} type="file" accept=".json" onChange={importJSON} style={{ display:'none' }}/>
        </Section>

      </div>

      {showAddNotif && <AddNotifModal t={t} dark={dark} onClose={()=>setShowAddNotif(false)} onAdd={r=>setReminders(rs=>[...rs,r])}/>}
      {showPINSetup && <PINSetupModal t={t} dark={dark} onClose={()=>setShowPINSetup(false)} onSave={()=>{}}/>}
    </div>
  );
};

Object.assign(window, { HomePage, NotesPage, FoldersPage, SettingsPage });
