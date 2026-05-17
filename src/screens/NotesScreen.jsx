import { useState, useMemo } from 'react';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import IconBtn from '../components/IconBtn';
import { IcHash, IcPlus, IcX, IcGrid, IcList } from '../icons';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function NotesScreen({ dark, t, notes, onNoteSelect, onNewNote, onTogglePin, folders = [], onDeleteNotes, onMoveNotes }) {
  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState('all');
  const [tagFilter,   setTagFilter]   = useState(null);
  const [showTags,    setShowTags]    = useState(false);
  const [gridView,    setGridView]    = useLocalStorage('np_gridView', false);
  const [selectMode,  setSelectMode]  = useState(false);
  const [selected,    setSelected]    = useState(new Set());
  const [confirmDel,  setConfirmDel]  = useState(false);
  const [showMoveFolder, setShowMoveFolder] = useState(false);

  const allTags = useMemo(() => [...new Set(notes.flatMap(n => n.tags))], [notes]);

  const visible = useMemo(() => {
    const filtered = notes.filter(n => {
      const q      = search.toLowerCase();
      const matchQ = !q || n.title.toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q) || n.tags.some(tg => tg.toLowerCase().includes(q));
      const matchF = filter === 'all' || (filter === 'pinned' && n.pinned) || filter === 'recent';
      const matchT = !tagFilter || n.tags.includes(tagFilter);
      return matchQ && matchF && matchT;
    });
    return [...filtered].sort((a, b) => (b.updatedAt || b.id) - (a.updatedAt || a.id));
  }, [notes, search, filter, tagFilter]);

  const enterSelect = (id) => {
    setSelectMode(true);
    setSelected(new Set([id]));
  };

  const exitSelect = () => {
    setSelectMode(false);
    setSelected(new Set());
    setConfirmDel(false);
    setShowMoveFolder(false);
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (confirmDel) {
      onDeleteNotes?.(selected);
      exitSelect();
    } else {
      setConfirmDel(true);
    }
  };

  const handleMoveToFolder = (folderName) => {
    onMoveNotes?.(selected, folderName);
    exitSelect();
  };

  const FILTERS = [{ id: 'all', l: 'Toutes' }, { id: 'pinned', l: 'Épinglées' }, { id: 'recent', l: 'Récentes' }];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, transition: 'background .3s' }}>
      <div style={{ paddingTop: 62, padding: '20px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: 0 }}>Notes</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <IconBtn t={t} onClick={() => setGridView(v => !v)}>
              {gridView
                ? <IcList s={16} c={t.text2} />
                : <IcGrid s={16} c={t.text2} />}
            </IconBtn>
            <IconBtn t={t} onClick={() => { setShowTags(s => !s); setTagFilter(null); }} style={{ background: showTags ? t.accent : t.card }}>
              <IcHash s={16} c={showTags ? t.btnText : t.text2} />
            </IconBtn>
            <IconBtn primary t={t} onClick={onNewNote}><IcPlus s={16} c={t.btnText} /></IconBtn>
          </div>
        </div>

        <SearchBar placeholder="Rechercher…" value={search} onChange={v => { setSearch(v); setTagFilter(null); }} t={t} />

        {/* Tag browser */}
        {showTags && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: t.text3, textTransform: 'uppercase', letterSpacing: .8, margin: '0 0 8px' }}>Tags</p>
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: 4 }}>
              <button onClick={() => setTagFilter(null)} style={{ padding: '5px 13px', borderRadius: 20, border: `1.5px solid ${!tagFilter ? t.accent : t.border}`, background: !tagFilter ? t.accentBg : 'transparent', fontSize: 12, fontWeight: 600, color: !tagFilter ? t.accent : t.text2, whiteSpace: 'nowrap', fontFamily: 'inherit', flexShrink: 0 }}>
                Toutes
              </button>
              {allTags.map(tag => {
                const note   = notes.find(n => n.tags.includes(tag));
                const col    = note?.color || '#888';
                const active = tagFilter === tag;
                return (
                  <button key={tag} onClick={() => setTagFilter(active ? null : tag)}
                    style={{ padding: '5px 13px', borderRadius: 20, border: `1.5px solid ${active ? col : t.border}`, background: active ? `${col}18` : 'transparent', fontSize: 12, fontWeight: 600, color: active ? col : t.text2, whiteSpace: 'nowrap', fontFamily: 'inherit', flexShrink: 0 }}>
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '6px 16px', borderRadius: 20, border: 'none', background: filter === f.id ? t.accent : t.card, color: filter === f.id ? t.btnText : t.text2, fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', boxShadow: t.shadow, transition: 'all .15s', fontFamily: 'inherit' }}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {tagFilter && (
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: t.text2 }}>Filtre :</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>#{tagFilter}</span>
            <button onClick={() => setTagFilter(null)} style={{ background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center' }}><IcX s={13} c={t.text3} /></button>
          </div>
        )}
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: t.text3 }}>
            <div style={{ fontSize: 36, marginBottom: 10, opacity: .4 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Aucune note trouvée</div>
          </div>
        ) : gridView ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 10 }}>
            {visible.map(note => (
              <NoteCard key={note.id} note={note} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark} compact
                selectMode={selectMode} selected={selected.has(note.id)} onSelect={toggleSelect}
                onLongPress={!selectMode ? enterSelect : undefined}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.map(note => (
              <NoteCard key={note.id} note={note} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark}
                selectMode={selectMode} selected={selected.has(note.id)} onSelect={toggleSelect}
                onLongPress={!selectMode ? enterSelect : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Multi-select action bar */}
      {selectMode && (
        <div style={{ flexShrink: 0, padding: '12px 16px', background: t.card, borderTop: `1px solid ${t.border}`, display: 'flex', gap: 8, alignItems: 'center', boxShadow: t.shadow }}>
          <button onClick={exitSelect}
            style={{ padding: '8px 14px', borderRadius: 10, border: 'none', background: t.card2, color: t.text2, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', touchAction: 'manipulation' }}>
            Annuler
          </button>
          <button onClick={() => { setShowMoveFolder(true); setConfirmDel(false); }}
            style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', background: t.card2, color: t.text2, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', touchAction: 'manipulation' }}>
            Déplacer
          </button>
          <button onClick={handleDeleteSelected}
            style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', background: confirmDel ? '#EF4444' : '#FEF2F2', color: confirmDel ? 'white' : '#EF4444', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', touchAction: 'manipulation' }}>
            {confirmDel ? 'Confirmer ?' : `Supprimer (${selected.size})`}
          </button>
        </div>
      )}

      {/* Move to folder picker */}
      {showMoveFolder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={() => setShowMoveFolder(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)' }} />
          <div style={{ position: 'relative', background: t.card, borderRadius: '20px 20px 0 0', padding: '20px 20px 36px', zIndex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 16 }}>Déplacer vers…</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 300, overflowY: 'auto' }}>
              {folders.map(f => (
                <button key={f.id} onClick={() => handleMoveToFolder(f.name)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, border: 'none', background: t.card2, fontFamily: 'inherit', textAlign: 'left', width: '100%', touchAction: 'manipulation' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={f.color} stroke={f.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{f.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
