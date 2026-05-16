import { useState, useMemo } from 'react';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import IconBtn from '../components/IconBtn';
import { IcHash, IcPlus, IcX } from '../icons';

export default function NotesScreen({ dark, t, notes, onNoteSelect, onNewNote, onTogglePin }) {
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('all');
  const [tagFilter, setTagFilter] = useState(null);
  const [showTags,  setShowTags]  = useState(false);

  const allTags = useMemo(() => [...new Set(notes.flatMap(n => n.tags))], [notes]);

  const visible = notes.filter(n => {
    const q      = search.toLowerCase();
    const matchQ = !q || n.title.toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q) || n.tags.some(tg => tg.toLowerCase().includes(q));
    const matchF = filter === 'all' || (filter === 'pinned' && n.pinned) || filter === 'recent';
    const matchT = !tagFilter || n.tags.includes(tagFilter);
    return matchQ && matchF && matchT;
  });

  const FILTERS = [{ id: 'all', l: 'Toutes' }, { id: 'pinned', l: 'Épinglées' }, { id: 'recent', l: 'Récentes' }];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, transition: 'background .3s' }}>
      <div style={{ paddingTop: 62, padding: '62px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: 0 }}>Notes</h1>
          <div style={{ display: 'flex', gap: 8 }}>
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
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.map(note => (
              <NoteCard key={note.id} note={note} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
