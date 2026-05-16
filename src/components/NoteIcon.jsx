export default function NoteIcon({ note, size = 36 }) {
  const r = Math.round(size * .3);
  return (
    <div style={{ width: size, height: size, borderRadius: r, background: note.colorLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1.5px solid ${note.color}28` }}>
      <span style={{ fontSize: Math.round(size * .46), color: note.color, fontWeight: 800, lineHeight: 1 }}>{note.title.charAt(0).toUpperCase()}</span>
    </div>
  );
}
