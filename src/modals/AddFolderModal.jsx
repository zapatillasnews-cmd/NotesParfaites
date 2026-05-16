import { useState } from 'react';
import { IcFolderN } from '../icons';
import { Sheet, SheetHeader, Label, TInput } from './Sheet';

const PALETTE = [
  {c:'#6366F1',bg:'#EEF2FF'},{c:'#7C3AED',bg:'#EDE9FE'},{c:'#8B5CF6',bg:'#F5F3FF'},
  {c:'#D946EF',bg:'#FDF4FF'},{c:'#EC4899',bg:'#FDF2F8'},{c:'#DB2777',bg:'#FCE7F3'},
  {c:'#F43F5E',bg:'#FFF1F2'},{c:'#EF4444',bg:'#FEF2F2'},{c:'#DC2626',bg:'#FEE2E2'},
  {c:'#F97316',bg:'#FFF7ED'},{c:'#EA580C',bg:'#FFEDD5'},{c:'#F59E0B',bg:'#FFFBEB'},
  {c:'#CA8A04',bg:'#FEF9C3'},{c:'#EAB308',bg:'#FEFCE8'},{c:'#84CC16',bg:'#F7FEE7'},
  {c:'#16A34A',bg:'#DCFCE7'},{c:'#22C55E',bg:'#F0FDF4'},{c:'#10B981',bg:'#ECFDF5'},
  {c:'#14B8A6',bg:'#F0FDFA'},{c:'#0891B2',bg:'#CFFAFE'},{c:'#06B6D4',bg:'#ECFEFF'},
  {c:'#0EA5E9',bg:'#F0F9FF'},{c:'#3B82F6',bg:'#EFF6FF'},{c:'#1D4ED8',bg:'#DBEAFE'},
  {c:'#64748B',bg:'#F8FAFC'},{c:'#374151',bg:'#F9FAFB'},{c:'#78716C',bg:'#FAFAF9'},
];

export default function AddFolderModal({ t, dark, onClose, onAdd, parentFolder = null }) {
  const [name,  setName]  = useState('');
  const [color, setColor] = useState('#6366F1');
  const active = PALETTE.find(p => p.c === color) || PALETTE[0];
  const title  = parentFolder ? `Sous-dossier de "${parentFolder}"` : 'Nouveau dossier';

  return (
    <Sheet t={t} dark={dark} onClose={onClose}>
      <SheetHeader title={title} t={t} onClose={onClose} />
      <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 14, background: t.card2, border: `1px solid ${t.border}` }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: active.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IcFolderN s={22} c={color} filled />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: name ? t.text : t.text3 }}>{name || 'Nom du dossier'}</div>
            <div style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>0 note</div>
          </div>
        </div>

        {/* Name */}
        <div>
          <Label t={t}>Nom</Label>
          <TInput value={name} onChange={setName} placeholder="Ex : Recettes, Voyage…" t={t} autoFocus />
        </div>

        {/* Colors — single scrollable row */}
        <div>
          <Label t={t}>Couleur</Label>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,128,128,.3) transparent' }}>
            {PALETTE.map(p => (
              <div key={p.c} onClick={() => setColor(p.c)} style={{ width: 38, height: 38, borderRadius: 11, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `2.5px solid ${color === p.c ? p.c : 'transparent'}`, boxSizing: 'border-box', transition: 'border .15s' }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: p.c }} />
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1.5px solid ${t.border2}`, background: 'transparent', fontSize: 14, fontWeight: 700, color: t.text2, fontFamily: 'inherit' }}>Annuler</button>
          <button
            onClick={() => { if (name.trim()) { onAdd({ name: name.trim(), color, bg: active.bg }); onClose(); } }}
            style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: name.trim() ? t.accent : t.border2, fontSize: 14, fontWeight: 700, color: t.btnText, fontFamily: 'inherit', transition: 'background .2s', opacity: name.trim() ? 1 : .55 }}
          >
            Créer
          </button>
        </div>
      </div>
    </Sheet>
  );
}
