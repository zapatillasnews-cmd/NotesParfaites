export default function SectionHeader({ title, action, onAction, t }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: t.text, letterSpacing: -.1 }}>{title}</span>
      {action && <span onClick={onAction} style={{ fontSize: 12, color: t.text2, fontWeight: 600, cursor: 'pointer' }}>{action}</span>}
    </div>
  );
}
