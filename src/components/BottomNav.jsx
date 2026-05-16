import { IcHome, IcHash, IcFolderN, IcGear } from '../icons';

const ITEMS = [
  { id: 'home',     label: 'Accueil',  icon: (c, f) => <IcHome s={22} c={c} filled={f} /> },
  { id: 'notes',    label: 'Notes',    icon: (c)    => <IcHash s={22} c={c} /> },
  { id: 'folders',  label: 'Dossiers', icon: (c, f) => <IcFolderN s={22} c={c} filled={f} /> },
  { id: 'settings', label: 'Réglages', icon: (c)    => <IcGear s={22} c={c} /> },
];

export default function BottomNav({ active, onNavigate, t }) {
  return (
    <div style={{ display: 'flex', background: t.navBg, borderTop: `1px solid ${t.navBorder}`, paddingBottom: 'env(safe-area-inset-bottom, 16px)', paddingTop: 10, flexShrink: 0, transition: 'background .3s,border-color .3s' }}>
      {ITEMS.map(({ id, label, icon }) => {
        const on = active === id;
        const c  = on ? t.accent : t.text3;
        return (
          <button key={id} onClick={() => onNavigate(id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', background: 'transparent', padding: '4px 0' }}>
            {icon(c, on)}
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 400, color: c, letterSpacing: .1 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
