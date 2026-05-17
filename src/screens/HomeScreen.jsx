import NoteCard from '../components/NoteCard';
import IconBtn from '../components/IconBtn';
import SectionHeader from '../components/SectionHeader';
import { IcPlus } from '../icons';

const todayFR = () => new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const greet   = () => { const h = new Date().getHours(); return h < 5 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir'; };

export default function HomeScreen({ dark, t, notes, folders, onNoteSelect, onNavigate, onTogglePin }) {
  const pinned = notes.filter(n => n.pinned);
  const recent = notes
    .filter(n => !n.pinned)
    .sort((a, b) => (b.updatedAt || b.id) - (a.updatedAt || a.id))
    .slice(0, 3);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, transition: 'background .3s' }}>
      <div style={{ paddingTop: 62, padding: '20px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 12, color: t.text3, fontWeight: 500, margin: '0 0 3px', textTransform: 'capitalize' }}>{todayFR()}</p>
            <h1 style={{ fontSize: 23, fontWeight: 800, color: t.text, margin: 0 }}>{greet()} 👋</h1>
          </div>
          <IconBtn primary t={t} onClick={() => onNavigate('notes')} style={{ marginTop: 4 }}>
            <IcPlus s={16} c={t.btnText} />
          </IconBtn>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 22 }}>
          {[{ v: notes.length, l: 'Notes' }, { v: pinned.length, l: 'Épinglées' }, { v: folders.length, l: 'Dossiers' }].map(s => (
            <div key={s.l} style={{ background: t.card, borderRadius: 14, padding: '12px 14px', boxShadow: t.shadow, transition: 'background .3s' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: t.text }}>{s.v}</div>
              <div style={{ fontSize: 11, color: t.text3, fontWeight: 500, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }}>
        {/* Pinned grid */}
        {pinned.length > 0 && (
          <>
            <SectionHeader title="Épinglées" action="Voir tout" onAction={() => onNavigate('notes')} t={t} />
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 10, marginBottom: 22 }}>
              {pinned.map(note => (
                <NoteCard key={note.id} note={note} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark} compact />
              ))}
            </div>
          </>
        )}

        {/* Recent list */}
        {recent.length > 0 && (
          <>
            <SectionHeader title="Récentes" t={t} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recent.map(note => (
                <NoteCard key={note.id} note={note} onOpen={onNoteSelect} onTogglePin={onTogglePin} t={t} dark={dark} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
