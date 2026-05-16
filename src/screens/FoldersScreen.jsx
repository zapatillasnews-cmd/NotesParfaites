import { useState } from 'react';
import NoteCard from '../components/NoteCard';
import IconBtn from '../components/IconBtn';
import SectionHeader from '../components/SectionHeader';
import AddFolderModal from '../modals/AddFolderModal';
import { IcPlus, IcFolderN, IcBack } from '../icons';

export default function FoldersScreen({ dark, t, notes, folders, onNoteSelect, onOpenAddFolder, onTogglePin, subfolders = {}, onAddSubfolder }) {
  const [activeFolder,    setActiveFolder]    = useState(null);
  const [activeSubfolder, setActiveSubfolder] = useState(null);
  const [showAddSub,      setShowAddSub]      = useState(false);

  const addSubfolder = (fd) => {
    if (onAddSubfolder && activeFolder) onAddSubfolder(activeFolder, { id: Date.now(), ...fd });
  };

  // Subfolder detail view
  if (activeFolder && activeSubfolder) {
    const subs    = subfolders[activeFolder] || [];
    const sf      = subs.find(s => s.name === activeSubfolder) || {};
    const sfNotes = notes.filter(n => n.folder === activeFolder && n.subfolder === activeSubfolder);
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, transition: 'background .3s' }}>
        <div style={{ paddingTop: 62, padding: '20px 20px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <button onClick={() => setActiveSubfolder(null)} style={{ background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center' }}>
              <IcBack s={20} c={t.text} />
            </button>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: sf.bg || '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcFolderN s={18} c={sf.color || '#6366F1'} filled />
            </div>
            <div>
              <h1 style={{ fontSize: 19, fontWeight: 800, color: t.text, margin: 0 }}>{activeSubfolder}</h1>
              <span style={{ fontSize: 12, color: t.text3 }}>{sfNotes.length} note{sfNotes.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
          {sfNotes.length === 0
            ? <div style={{ textAlign: 'center', padding: '60px 0', color: t.text3 }}><div style={{ fontSize: 36, opacity: .35, marginBottom: 10 }}>📂</div><div style={{ fontSize: 14, fontWeight: 600 }}>Sous-dossier vide</div></div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{sfNotes.map(n => <NoteCard key={n.id} note={n} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark} />)}</div>
          }
        </div>
      </div>
    );
  }

  // Folder detail view
  if (activeFolder) {
    const fd     = folders.find(f => f.name === activeFolder) || {};
    const fNotes = notes.filter(n => n.folder === activeFolder && !n.subfolder);
    const subs   = subfolders[activeFolder] || [];

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, transition: 'background .3s' }}>
        <div style={{ paddingTop: 62, padding: '20px 20px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setActiveFolder(null)} style={{ background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center' }}><IcBack s={20} c={t.text} /></button>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: fd.bg || '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcFolderN s={19} c={fd.color || '#6366F1'} filled /></div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: t.text, margin: 0 }}>{activeFolder}</h1>
                <span style={{ fontSize: 12, color: t.text3 }}>{fNotes.length} note{fNotes.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <IconBtn t={t} onClick={() => setShowAddSub(true)}><IcPlus s={16} c={t.text2} /></IconBtn>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
          {subs.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SectionHeader title="Sous-dossiers" t={t} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {subs.map(sf => (
                  <div key={sf.id} onClick={() => setActiveSubfolder(sf.name)} style={{ background: t.card, borderRadius: 14, padding: '13px 14px', boxShadow: t.shadow, display: 'flex', alignItems: 'center', gap: 10, transition: 'background .3s' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: sf.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IcFolderN s={16} c={sf.color} filled /></div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{sf.name}</div>
                      <div style={{ fontSize: 11, color: t.text3 }}>0 note</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <SectionHeader title="Notes" t={t} />
          {fNotes.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: t.text3 }}><div style={{ fontSize: 36, opacity: .35, marginBottom: 10 }}>📝</div><div style={{ fontSize: 14, fontWeight: 600 }}>Aucune note</div></div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{fNotes.map(n => <NoteCard key={n.id} note={n} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark} />)}</div>
          }
        </div>

        {showAddSub && <AddFolderModal t={t} dark={dark} onClose={() => setShowAddSub(false)} onAdd={addSubfolder} parentFolder={activeFolder} />}
      </div>
    );
  }

  // Root folders view
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, transition: 'background .3s' }}>
      <div style={{ paddingTop: 62, padding: '20px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: 0 }}>Dossiers</h1>
          <IconBtn primary t={t} onClick={onOpenAddFolder}><IcPlus s={16} c={t.btnText} /></IconBtn>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
          <div style={{ background: t.accent, borderRadius: 16, padding: '18px 16px', boxShadow: '0 4px 16px rgba(0,0,0,.18)' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: t.btnText }}>{notes.length}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 3, fontWeight: 500 }}>Notes au total</div>
          </div>
          <div style={{ background: t.card, borderRadius: 16, padding: '18px 16px', boxShadow: t.shadow, transition: 'background .3s' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: t.text }}>{folders.length}</div>
            <div style={{ fontSize: 12, color: t.text3, marginTop: 3, fontWeight: 500 }}>Dossiers</div>
          </div>
        </div>

        <SectionHeader title="Mes dossiers" t={t} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {folders.map(folder => (
            <div key={folder.id} onClick={() => setActiveFolder(folder.name)} style={{ background: t.card, borderRadius: 16, boxShadow: t.shadow, padding: '16px', transition: 'background .3s' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: folder.bg, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcFolderN s={20} c={folder.color} filled />
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: t.text, marginBottom: 3 }}>{folder.name}</div>
              <div style={{ fontSize: 11.5, color: t.text3 }}>{folder.count} note{folder.count !== 1 ? 's' : ''}</div>
            </div>
          ))}
          {/* Ghost card */}
          <div onClick={onOpenAddFolder} style={{ borderRadius: 16, border: `2px dashed ${t.border2}`, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 110 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: t.card2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcPlus s={15} c={t.text3} /></div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: t.text3 }}>Nouveau</span>
          </div>
        </div>
      </div>
    </div>
  );
}
