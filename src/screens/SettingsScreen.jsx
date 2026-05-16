import { useState, useMemo, useRef } from 'react';
import AddNotifModal from '../modals/AddNotifModal';
import { IcBell, IcX, IcPlus, IcChevronR, IcDownload, IcUpload } from '../icons';

export default function SettingsScreen({ dark, t, onToggleDark, notes, folders, onSetNotes, onSetFolders, pinEnabled, onTogglePin, onLockNow }) {
  const [notifs,       setNotifs]       = useState(true);
  const [reminders,    setReminders]    = useState([]);
  const [showAddNotif, setShowAddNotif] = useState(false);
  const fileRef = useRef(null);

  const storageSize = useMemo(() => {
    const bytes = new TextEncoder().encode(JSON.stringify({ notes, folders })).length;
    return bytes < 1024 ? `${bytes} o` : `${(bytes / 1024).toFixed(1)} Ko`;
  }, [notes, folders]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ notes, folders }, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'notes-backup.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.notes)   onSetNotes(data.notes);
        if (data.folders) onSetFolders(data.folders);
      } catch { alert('Fichier JSON invalide.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const Toggle = ({ on, onChange }) => (
    <div onClick={() => onChange(!on)} style={{ width: 44, height: 26, borderRadius: 13, background: on ? t.accent : 'rgba(120,120,128,.2)', position: 'relative', flexShrink: 0, transition: 'background .25s' }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,.25)', transition: 'left .2s' }} />
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: t.text3, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 8, paddingLeft: 4 }}>{title}</div>
      <div style={{ background: t.card, borderRadius: 16, overflow: 'hidden', boxShadow: t.shadow, transition: 'background .3s' }}>{children}</div>
    </div>
  );

  const Row = ({ emoji, label, right, last, onClick }) => (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: last ? 'none' : `1px solid ${t.border}`, cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: t.card2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'background .3s' }}>{emoji}</div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: t.text }}>{label}</span>
      {right}
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, transition: 'background .3s' }}>
      <div style={{ paddingTop: 62, padding: '62px 20px 0', flexShrink: 0 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: '0 0 22px' }}>Paramètres</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>

        <Section title="Affichage">
          <Row emoji="🌙" label="Mode sombre" right={<Toggle on={dark} onChange={onToggleDark} />} last />
        </Section>

        <Section title="Notifications">
          <Row emoji="🔔" label="Notifications push" right={<Toggle on={notifs} onChange={setNotifs} />} />
          {notifs && reminders.length > 0 && reminders.map((r, i) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: i < reminders.length - 1 ? `1px solid ${t.border}` : 'none', gap: 12 }}>
              <IcBell s={14} c={t.text3} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{r.title}</div>
                {(r.date || r.time) && <div style={{ fontSize: 11, color: t.text3, marginTop: 1 }}>{r.date} {r.time}</div>}
              </div>
              <button onClick={() => setReminders(rs => rs.filter(x => x.id !== r.id))} style={{ background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center' }}><IcX s={13} c={t.text3} /></button>
            </div>
          ))}
          {notifs && (
            <div onClick={() => setShowAddNotif(true)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderTop: reminders.length > 0 ? `1px solid ${t.border}` : 'none' }}>
              <IcPlus s={15} c={t.text3} /><span style={{ fontSize: 13, color: t.text3, fontWeight: 600 }}>Ajouter un rappel</span>
            </div>
          )}
        </Section>

        <Section title="Sécurité">
          <Row emoji="🔒" label="Code PIN" right={<Toggle on={pinEnabled} onChange={onTogglePin} />} />
          {pinEnabled && <Row emoji="🔐" label="Verrouiller maintenant" right={<IcChevronR s={14} c={t.text3} />} onClick={onLockNow} last />}
        </Section>

        <Section title="Données">
          <Row emoji="💾" label="Stockage utilisé" right={<span style={{ fontSize: 12.5, color: t.text3, fontWeight: 500 }}>{storageSize}</span>} />
          <Row emoji="⬇️" label="Exporter (JSON)" right={<IcDownload s={15} c={t.text3} />} onClick={exportJSON} />
          <Row emoji="⬆️" label="Importer (JSON)" right={<IcUpload s={15} c={t.text3} />} onClick={() => fileRef.current?.click()} last />
          <input ref={fileRef} type="file" accept=".json" onChange={importJSON} style={{ display: 'none' }} />
        </Section>

      </div>

      {showAddNotif && <AddNotifModal t={t} dark={dark} onClose={() => setShowAddNotif(false)} onAdd={r => setReminders(rs => [...rs, r])} />}
    </div>
  );
}
