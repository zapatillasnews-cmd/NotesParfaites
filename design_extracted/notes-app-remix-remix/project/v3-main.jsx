// v3-main.jsx — Data + App root

// ── Initial data ───────────────────────────────────────────────
const V3_NOTES_INIT = [
  { id:1, title:'Design System',    folder:'Design',    tags:['Design System','Figma'],  preview:'Les avantages d\'un design system conjoint sont nombreux : cohérence, productivité, langage commun entre design et ingénierie.',          body:'Il existe de nombreux avantages à un système de design conjoint. Non seulement cela apporte des bénéfices à l\'équipe design, mais cela aide aussi les équipes d\'ingénierie.\n\nIl garantit que nos expériences ont un aspect et une convivialité cohérents.',  date:'20 Déc, 2024', time:'22:30', pinned:true,  color:'#6366F1', colorLight:'#EEF2FF', author:'Alex Martin', subfolder:null },
  { id:2, title:'To Do',            folder:'Travail',   tags:['Tâches'],                 preview:'Pause de 10 min · Déjeuner · Wireframe · Web design · Réunion d\'équipe · Design Handoff',                                                  body:'• Pause de 10 minutes\n• Prendre le déjeuner\n• Créer le wireframe\n• Web design\n• Réunion d\'équipe\n• Design Handoff',                                                                                                                   date:'18 Déc, 2024', time:'14:15', pinned:true,  color:'#10B981', colorLight:'#DCFCE7', author:'Alex Martin', subfolder:null },
  { id:3, title:'Projets à venir',  folder:'Travail',   tags:['Portfolio','Web'],        preview:'Concevoir du contenu pour le portfolio et préparer le lancement du site web.',                                                               body:'Concevoir du contenu incroyable pour le portfolio et préparer le lancement du site web.\n\nPlanifier la stratégie de contenu et définir les livrables clés pour chaque phase du projet.',                                                   date:'15 Déc, 2024', time:'09:00', pinned:false, color:'#8B5CF6', colorLight:'#F5F3FF', author:'Alex Martin', subfolder:null },
  { id:4, title:'Notes de réunion', folder:'Travail',   tags:['Réunion'],                preview:'Objectifs trimestriels et feuille de route produit discutés en sprint planning.',                                                            body:'Objectifs trimestriels et nouvelle feuille de route produit discutés lors du sprint planning.\n\nDécisions clés prises par l\'équipe.',                                                                                                        date:'12 Déc, 2024', time:'11:00', pinned:false, color:'#F59E0B', colorLight:'#FEF3C7', author:'Alex Martin', subfolder:null },
  { id:5, title:'Lectures',         folder:'Personnel', tags:['Livres'],                 preview:'Atomic Habits · Deep Work · The Design of Everyday Things · Thinking, Fast and Slow',                                                       body:'• Atomic Habits — James Clear\n• Deep Work — Cal Newport\n• The Design of Everyday Things — Don Norman\n• Thinking, Fast and Slow — Daniel Kahneman',                                                                                    date:'10 Déc, 2024', time:'19:30', pinned:false, color:'#EC4899', colorLight:'#FDF2F8', author:'Alex Martin', subfolder:null },
  { id:6, title:'Idées d\'apps',   folder:'Idées',     tags:['Idées','App'],            preview:'App de notes avec IA · Suivi fitness · Dashboard finances personnelles',                                                                     body:'• App de notes avec intégration IA\n• Suivi fitness avec fonctions sociales\n• Dashboard de finances personnelles',                                                                                                                         date:'8 Déc,  2024', time:'15:45', pinned:false, color:'#14B8A6', colorLight:'#CCFBF1', author:'Alex Martin', subfolder:null },
];

const V3_FOLDERS_INIT = [
  { id:1, name:'Design',    count:12, color:'#6366F1', bg:'#EEF2FF' },
  { id:2, name:'Travail',   count:8,  color:'#F59E0B', bg:'#FEF3C7' },
  { id:3, name:'Personnel', count:5,  color:'#10B981', bg:'#DCFCE7' },
  { id:4, name:'Idées',     count:3,  color:'#EC4899', bg:'#FDF2F8' },
  { id:5, name:'Journal',   count:7,  color:'#8B5CF6', bg:'#F5F3FF' },
  { id:6, name:'Recherche', count:4,  color:'#14B8A6', bg:'#CCFBF1' },
];

const V3_SUBFOLDERS_INIT = {
  'Design':    [{ id:1, name:'Logos',      color:'#6366F1', bg:'#EEF2FF' }, { id:2, name:'Composants', color:'#8B5CF6', bg:'#F5F3FF' }],
  'Travail':   [{ id:3, name:'Q1 2025',    color:'#F59E0B', bg:'#FFFBEB' }, { id:4, name:'Q2 2025',    color:'#10B981', bg:'#ECFDF5' }],
  'Personnel': [{ id:5, name:'Santé',      color:'#EF4444', bg:'#FEF2F2' }],
  'Idées':     [{ id:6, name:'Applications', color:'#14B8A6', bg:'#F0FDFA'}],
};

const makeNewNote = () => ({
  id: Date.now(),
  title:'Nouvelle note', folder:'Travail', tags:[], preview:'', body:'',
  date: new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'}),
  time: new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),
  pinned:false, color:'#6366F1', colorLight:'#EEF2FF', author:'Alex Martin', subfolder:null,
});

// ── App ────────────────────────────────────────────────────────
const App = () => {
  const [page,         setPage]         = React.useState('home');
  const [selectedNote, setSelectedNote] = React.useState(null);
  const [dark,         setDark]         = React.useState(false);
  const [notes,        setNotes]        = React.useState(V3_NOTES_INIT);
  const [folders,      setFolders]      = React.useState(V3_FOLDERS_INIT);
  const [subfolders,   setSubfolders]   = React.useState(V3_SUBFOLDERS_INIT);
  const [showModal,    setShowModal]    = React.useState(false);

  // PIN state (persisted)
  const [pinEnabled, setPinEnabled] = React.useState(()=>localStorage.getItem('v3pinEnabled')==='true');
  const [pin,        setPin]        = React.useState(()=>localStorage.getItem('v3pin')||'');
  const [pinLocked,  setPinLocked]  = React.useState(()=>localStorage.getItem('v3pinEnabled')==='true'&&!!localStorage.getItem('v3pin'));

  // Expose folders for NoteDetailPage lookup
  window.V3_FOLDERS = folders;

  const t = getTheme(dark);

  const navigate = (p) => { setPage(p); setSelectedNote(null); };

  // Toggle pin on a note
  const togglePin = (id) => setNotes(ns=>ns.map(n=>n.id===id?{...n,pinned:!n.pinned}:n));

  // Add folder
  const addFolder = (fd) => setFolders(prev=>[...prev,{id:Date.now(),count:0,...fd}]);

  // Add subfolder
  const addSubfolder = (folderName, sf) => setSubfolders(prev=>({ ...prev, [folderName]: [...(prev[folderName]||[]), sf] }));

  // Update note (from detail page save)
  const updateNote = (updated) => setNotes(ns => ns.map(n => n.id === updated.id ? updated : n));

  // PIN handlers
  const handleTogglePin2 = (val) => {
    if (val) {
      setShowPINSetup(true);
    } else {
      setPinEnabled(false); setPin('');
      localStorage.removeItem('v3pinEnabled'); localStorage.removeItem('v3pin');
    }
  };
  const [showPINSetup, setShowPINSetup] = React.useState(false);
  const handleSavePin = (p) => {
    setPin(p); setPinEnabled(true);
    localStorage.setItem('v3pin',p); localStorage.setItem('v3pinEnabled','true');
  };

  const content = () => {
    if (selectedNote) return <NoteDetailPage note={selectedNote} onBack={()=>setSelectedNote(null)} onUpdate={updateNote} dark={dark} t={t}/>;
    const common = { dark, t, notes, onNoteSelect:setSelectedNote, onTogglePin:togglePin };
    switch (page) {
      case 'home':     return <HomePage     {...common} onNavigate={navigate}/>;
      case 'notes':    return <NotesPage    {...common} onNewNote={()=>setSelectedNote(makeNewNote())}/>;
      case 'folders':  return <FoldersPage  {...common} folders={folders} onOpenAddFolder={()=>setShowModal(true)} subfolders={subfolders} onAddSubfolder={addSubfolder}/>;
      case 'settings': return (
        <SettingsPage
          dark={dark} t={t} notes={notes} folders={folders}
          onToggleDark={()=>setDark(d=>!d)}
          onSetNotes={setNotes} onSetFolders={setFolders}
          pinEnabled={pinEnabled}
          onTogglePin2={handleTogglePin2}
          onLockNow={()=>{ if(pinEnabled&&pin) setPinLocked(true); }}
        />
      );
      default: return <HomePage {...common} onNavigate={navigate}/>;
    }
  };

  return (
    <IOSDevice width={390} height={844} dark={dark}>
      <div style={{ position:'relative', height:'100%', display:'flex', flexDirection:'column', fontFamily:"'Plus Jakarta Sans',sans-serif", WebkitFontSmoothing:'antialiased', background:t.bg, transition:'background .3s' }}>

        {/* PIN lock overlay */}
        {pinLocked && pin ? (
          <PINScreen pin={pin} onUnlock={()=>setPinLocked(false)} dark={dark} t={t}/>
        ) : (
          <>
            <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
              {content()}
            </div>
            {!selectedNote && <BottomNav active={page} onNavigate={navigate} t={t}/>}
          </>
        )}

        {/* Add folder modal */}
        {showModal && <AddFolderModal t={t} dark={dark} onClose={()=>setShowModal(false)} onAdd={addFolder}/>}

        {/* PIN setup modal */}
        {showPINSetup && <PINSetupModal t={t} dark={dark} onClose={()=>setShowPINSetup(false)} onSave={handleSavePin}/>}
      </div>
    </IOSDevice>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
