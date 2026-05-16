import { useState } from 'react';
import { getTheme } from './theme';
import { NOTES_INIT, FOLDERS_INIT, SUBFOLDERS_INIT, makeNewNote } from './data';
import { useLocalStorage } from './hooks/useLocalStorage';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import NotesScreen from './screens/NotesScreen';
import FoldersScreen from './screens/FoldersScreen';
import SettingsScreen from './screens/SettingsScreen';
import NoteDetailScreen from './screens/NoteDetailScreen';
import AddFolderModal from './modals/AddFolderModal';
import PINScreen from './modals/PINScreen';
import PINSetupModal from './modals/PINSetupModal';

export default function App() {
  const [page,         setPage]         = useState('home');
  const [selectedNote, setSelectedNote] = useState(null);

  const [dark,       setDark]       = useLocalStorage('np_dark', false);
  const [notes,      setNotes]      = useLocalStorage('np_notes', NOTES_INIT);
  const [folders,    setFolders]    = useLocalStorage('np_folders', FOLDERS_INIT);
  const [subfolders, setSubfolders] = useLocalStorage('np_subfolders', SUBFOLDERS_INIT);
  const [pinEnabled, setPinEnabled] = useLocalStorage('np_pinEnabled', false);
  const [pin,        setPin]        = useLocalStorage('np_pin', '');

  const [pinLocked,    setPinLocked]    = useState(pinEnabled && !!pin);
  const [showModal,    setShowModal]    = useState(false);
  const [showPINSetup, setShowPINSetup] = useState(false);

  const t = getTheme(dark);

  const navigate = (p) => { setPage(p); setSelectedNote(null); };

  const togglePin  = (id) => setNotes(ns => ns.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const addFolder  = (fd) => setFolders(prev => [...prev, { id: Date.now(), count: 0, ...fd }]);
  const addSubfolder = (folderName, sf) => setSubfolders(prev => ({ ...prev, [folderName]: [...(prev[folderName] || []), sf] }));
  const updateNote = (updated) => setNotes(ns => ns.map(n => n.id === updated.id ? updated : n));

  const handleTogglePin = (val) => {
    if (val) { setShowPINSetup(true); }
    else { setPinEnabled(false); setPin(''); }
  };
  const handleSavePin = (p) => { setPin(p); setPinEnabled(true); };

  const renderContent = () => {
    if (selectedNote) {
      return (
        <NoteDetailScreen
          note={selectedNote}
          onBack={() => setSelectedNote(null)}
          onUpdate={updateNote}
          dark={dark}
          t={t}
          folders={folders}
        />
      );
    }
    const common = { dark, t, notes, onNoteSelect: setSelectedNote, onTogglePin: togglePin };
    switch (page) {
      case 'home':
        return <HomeScreen {...common} folders={folders} onNavigate={navigate} />;
      case 'notes':
        return <NotesScreen {...common} onNewNote={() => setSelectedNote(makeNewNote())} />;
      case 'folders':
        return (
          <FoldersScreen
            {...common}
            folders={folders}
            onOpenAddFolder={() => setShowModal(true)}
            subfolders={subfolders}
            onAddSubfolder={addSubfolder}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            dark={dark} t={t} notes={notes} folders={folders}
            onToggleDark={() => setDark(d => !d)}
            onSetNotes={setNotes}
            onSetFolders={setFolders}
            pinEnabled={pinEnabled}
            onTogglePin={handleTogglePin}
            onLockNow={() => { if (pinEnabled && pin) setPinLocked(true); }}
          />
        );
      default:
        return <HomeScreen {...common} folders={folders} onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans',sans-serif", WebkitFontSmoothing: 'antialiased', background: t.bg, transition: 'background .3s' }}>

      {pinLocked && pin ? (
        <PINScreen pin={pin} onUnlock={() => setPinLocked(false)} t={t} dark={dark} />
      ) : (
        <>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {renderContent()}
          </div>
          {!selectedNote && <BottomNav active={page} onNavigate={navigate} t={t} />}
        </>
      )}

      {showModal    && <AddFolderModal t={t} dark={dark} onClose={() => setShowModal(false)} onAdd={addFolder} />}
      {showPINSetup && <PINSetupModal t={t} dark={dark} onClose={() => setShowPINSetup(false)} onSave={handleSavePin} />}
    </div>
  );
}
