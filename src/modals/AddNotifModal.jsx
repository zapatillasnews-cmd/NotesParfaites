import { useState } from 'react';
import { Sheet, SheetHeader, Label, TInput } from './Sheet';

export default function AddNotifModal({ t, dark, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [date,  setDate]  = useState('');
  const [time,  setTime]  = useState('');

  return (
    <Sheet t={t} dark={dark} onClose={onClose}>
      <SheetHeader title="Nouveau rappel" t={t} onClose={onClose} />
      <div style={{ padding: '0 20px 44px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <Label t={t}>Titre</Label>
          <TInput value={title} onChange={setTitle} placeholder="Ex : Revoir le projet…" t={t} autoFocus />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Label t={t}>Date</Label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: `1.5px solid ${t.border2}`, outline: 'none', fontSize: 14, color: t.text, background: t.inputBg, fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Label t={t}>Heure</Label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: `1.5px solid ${t.border2}`, outline: 'none', fontSize: 14, color: t.text, background: t.inputBg, fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1.5px solid ${t.border2}`, background: 'transparent', fontSize: 14, fontWeight: 700, color: t.text2, fontFamily: 'inherit' }}>Annuler</button>
          <button
            onClick={() => { if (title.trim()) { onAdd({ id: Date.now(), title: title.trim(), date, time }); onClose(); } }}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: title.trim() ? t.accent : t.border2, fontSize: 14, fontWeight: 700, color: t.btnText, fontFamily: 'inherit', opacity: title.trim() ? 1 : .55 }}
          >
            Ajouter
          </button>
        </div>
      </div>
    </Sheet>
  );
}
