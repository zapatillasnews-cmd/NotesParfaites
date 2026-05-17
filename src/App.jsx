import { useState, useEffect } from 'react';
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
  const [reminders,  setReminders]  = useLocalStorage('np_reminders', []);

  const [pinLocked,    setPinLocked]    = useState(pinEnabled && !!pin);
  const [showModal,    setShowModal]    = useState(false);
  const [showPINSetup, setShowPINSetup] = useState(false);

  const t = getTheme(dark);

  const navigate = (p) => { setPage(p); setSelectedNote(null); };

  useEffect(() => {
    const color = dark ? '#0A0A0A' : '#F4F4F4';
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => { m.content = color; });
  }, [dark]);

  // Push notifications
  useEffect(() => {
    const init = async () => {
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      doCheckNotifications();
    };
    init();
    const id = setInterval(doCheckNotifications, 15000);
    const onVisible = () => { if (!document.hidden) doCheckNotifications(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVisible); };
  }, []);

  const doCheckNotifications = () => {
    const now = Date.now();
    setReminders(ns => {
      let changed = false;
      const next = ns.map(n => {
        if (n.sent || !n.date || !n.time) return n;
        const ts = new Date(`${n.date}T${n.time}:00`).getTime();
        if (isNaN(ts) || ts > now) return n;
        // Use Service Worker showNotification (works in background on Android)
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(n.title || 'NotesParfaites', {
              body: 'Rappel — NotesParfaites',
              icon: '/icon.svg',
              badge: '/icon.svg',
              vibrate: [200, 100, 200],
              tag: String(n.id),
            });
          }).catch(() => {});
        } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try { new Notification(n.title || 'NotesParfaites', { body: 'Rappel', icon: '/icon.svg' }); } catch {}
        }
        changed = true;
        return { ...n, sent: true };
      });
      return changed ? next : ns;
    });
  };

  const togglePin    = (id) => setNotes(ns => ns.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const addFolder    = (fd) => setFolders(prev => [...prev, { id: Date.now(), count: 0, ...fd }]);
  const addSubfolder = (folderName, sf) => setSubfolders(prev => ({ ...prev, [folderName]: [...(prev[folderName] || []), sf] }));
  const deleteNote   = (id) => { setNotes(ns => ns.filter(n => n.id !== id)); setSelectedNote(null); };
  const updateNote   = (updated) => setNotes(ns => {
    const exists = ns.some(n => n.id === updated.id);
    return exists ? ns.map(n => n.id === updated.id ? updated : n) : [...ns, updated];
  });
  const deleteNotes  = (ids) => setNotes(ns => ns.filter(n => !ids.has(n.id)));
  const moveNotes    = (ids, folder) => setNotes(ns => ns.map(n => ids.has(n.id) ? { ...n, folder, subfolder: null } : n));

  const renameFolder = (oldName, newName) => {
    setFolders(fs => fs.map(f => f.name === oldName ? { ...f, name: newName } : f));
    setNotes(ns => ns.map(n => n.folder === oldName ? { ...n, folder: newName } : n));
    setSubfolders(sf => {
      const r = { ...sf };
      if (r[oldName]) { r[newName] = r[oldName]; delete r[oldName]; }
      return r;
    });
  };

  const deleteFolder = (name) => {
    setFolders(fs => fs.filter(f => f.name !== name));
    setNotes(ns => ns.filter(n => n.folder !== name));
    setSubfolders(sf => { const r = { ...sf }; delete r[name]; return r; });
  };

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
          onDelete={deleteNote}
          dark={dark}
          t={t}
          folders={folders}
          subfolders={subfolders}
        />
      );
    }
    const common = { dark, t, notes, onNoteSelect: setSelectedNote, onTogglePin: togglePin };
    switch (page) {
      case 'home':
        return <HomeScreen {...common} folders={folders} onNavigate={navigate} />;
      case 'notes':
        return (
          <NotesScreen
            {...common}
            onNewNote={() => setSelectedNote(makeNewNote())}
            folders={folders}
            onDeleteNotes={deleteNotes}
            onMoveNotes={moveNotes}
          />
        );
      case 'folders':
        return (
          <FoldersScreen
            {...common}
            folders={folders}
            onOpenAddFolder={() => setShowModal(true)}
            subfolders={subfolders}
            onAddSubfolder={addSubfolder}
            onRenameFolder={renameFolder}
            onDeleteFolder={deleteFolder}
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
            reminders={reminders}
            onSetReminders={setReminders}
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
