import { useState } from 'react';
import { IcLock, IcBack } from '../icons';

export default function PINScreen({ onUnlock, pin, t }) {
  const [entered, setEntered] = useState('');
  const [shakeX,  setShakeX]  = useState(0);

  const shake = () => {
    const seq = [10, -10, 8, -8, 5, -5, 0];
    seq.forEach((x, i) => setTimeout(() => setShakeX(x), i * 70));
    setTimeout(() => setEntered(''), seq.length * 70);
  };

  const press = (d) => {
    if (entered.length >= 4) return;
    const next = entered + d;
    setEntered(next);
    if (next.length === 4) {
      if (next === pin) onUnlock();
      else shake();
    }
  };

  const del = () => setEntered(e => e.slice(0, -1));

  const ROWS = [[{l:'1',s:''},{l:'2',s:'ABC'},{l:'3',s:'DEF'}],[{l:'4',s:'GHI'},{l:'5',s:'JKL'},{l:'6',s:'MNO'}],[{l:'7',s:'PQRS'},{l:'8',s:'TUV'},{l:'9',s:'WXYZ'}]];

  const Key = ({ label, sub, onPress }) => (
    <button onClick={onPress} style={{ width: 72, height: 72, borderRadius: '50%', background: t.card, border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: t.shadow, fontFamily: 'inherit' }}>
      <span style={{ fontSize: 22, fontWeight: 400, color: t.text, lineHeight: 1 }}>{label}</span>
      {sub && <span style={{ fontSize: 9, color: t.text3, letterSpacing: 1.5, marginTop: 2 }}>{sub}</span>}
    </button>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: t.bg, zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, paddingTop: 40 }}>
      <IcLock s={32} c={t.text3} />
      <p style={{ fontSize: 17, fontWeight: 600, color: t.text, margin: 0 }}>Code PIN</p>

      <div style={{ display: 'flex', gap: 18, transform: `translateX(${shakeX}px)`, transition: shakeX === 0 ? 'transform .1s' : 'none' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: i < entered.length ? t.accent : t.border2, transition: 'background .12s' }} />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        {ROWS.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 20 }}>
            {row.map(({ l, s }) => <Key key={l} label={l} sub={s} onPress={() => press(l)} />)}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ width: 72, height: 72 }} />
          <Key label="0" onPress={() => press('0')} />
          <button onClick={del} style={{ width: 72, height: 72, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IcBack s={24} c={t.text2} />
          </button>
        </div>
      </div>
    </div>
  );
}
