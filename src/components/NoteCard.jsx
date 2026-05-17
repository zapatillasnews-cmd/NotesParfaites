import { useLongPress } from '../hooks/useLongPress';
import { IcPin, IcCheck } from '../icons';
import NoteIcon from './NoteIcon';
import TagChip from './TagChip';

export default function NoteCard({ note, onOpen, onTogglePin, t, dark, compact = false, selectMode = false, selected = false, onSelect, onLongPress }) {
  const lp = useLongPress(selectMode ? () => {} : (onLongPress ? () => onLongPress(note.id) : () => onTogglePin(note.id)));

  const handleClick = () => {
    if (lp.didFire()) return;
    if (selectMode) { onSelect?.(note.id); return; }
    onOpen(note);
  };

  return (
    <div
      {...lp.handlers}
      onClick={handleClick}
      style={{
        background: t.card,
        borderRadius: 16,
        boxShadow: selected ? `0 0 0 2.5px ${t.accent}, ${t.shadow}` : t.shadow,
        borderLeft: note.color ? `4px solid ${note.color}` : 'none',
        padding: compact ? '13px' : '14px 16px',
        paddingLeft: note.color ? (compact ? '11px' : '13px') : (compact ? '13px' : '16px'),
        display: 'flex', alignItems: 'flex-start',
        gap: compact ? 8 : 12,
        transform: lp.active ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform .12s, background .3s',
        userSelect: 'none', WebkitUserSelect: 'none',
        position: 'relative',
        touchAction: 'manipulation',
        overflow: 'hidden',
      }}
    >
      <NoteIcon note={note} size={compact ? 26 : 42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontSize: compact ? 13 : 14, fontWeight: 700, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0, marginRight: 6 }}>{note.title}</span>
          {!compact && <span style={{ fontSize: 10.5, color: t.text3, flexShrink: 0 }}>{note.date}</span>}
        </div>
        <p style={{ fontSize: compact ? 11.5 : 12.5, color: t.text2, margin: `0 0 ${compact ? 0 : 8}px`, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: compact ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {note.preview || note.body}
        </p>
        {!compact && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            {note.pinned && <IcPin s={11} c={t.text3} />}
            {note.tags.slice(0, 2).map(tag => <TagChip key={tag} label={tag} color={note.color} dark={dark} />)}
          </div>
        )}
      </div>
      {compact && note.pinned && !selectMode && (
        <div style={{ position: 'absolute', top: 10, right: 10 }}><IcPin s={11} c={t.text3} /></div>
      )}
      {selectMode && (
        <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%', background: selected ? t.accent : 'transparent', border: `2px solid ${selected ? t.accent : t.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {selected && <IcCheck s={12} c="white" />}
        </div>
      )}
    </div>
  );
}
