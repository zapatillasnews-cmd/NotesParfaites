import { useState } from 'react';
import { IcBack } from '../icons';
import { Sheet, SheetHeader } from './Sheet';

export default function PINSetupModal({ t, dark, onClose, onSave }) {
  const [step,   setStep]   = useState(0);
  const [first,  setFirst]  = useState('');
  const [second, setSecond] = useState('');
  const [shakeX, setShakeX] = useState(0);

  const current    = step === 0 ? first  : second;
  const setCurrent = step === 0 ? setFirst : setSecond;

  const shake = () => {
    const seq = [8, -8, 6, -6, 0];
    seq.forEach((x, i) => setTimeout(() => setShakeX(x), i * 70));
    setTimeout(() => { setSecond(''); setStep(0); setFirst(''); }, seq.length * 70 + 50);
  };

  const press = (d) => {
    if (current.length >= 4) return;
    const next = current + d;
    setCurrent(next);
    if (next.length === 4) {
      if (step === 0) { setStep(1); }
      else {
        if (next === first) { onSave(first); onClose(); }
        else { shake(); }
      }
    }
  };

  const del = () => setCurrent(c => c.slice(0, -1));
  const ROWS = [[1,2,3],[4,5,6],[7,8,9]];

  const Key = ({ d }) => (
    <button onClick={() => press(String(d))} style={{ width: 68, height: 68, borderRadius: '50%', background: t.card2, border: `1px solid ${t.border}`, fontSize: 21, fontWeight: 400, color: t.text, fontFamily: 'inherit', boxShadow: t.shadow }}>
      {d}
    </button>
  );

  return (
    <Sheet t={t} dark={dark} onClose={onClose}>
      <SheetHeader title={step === 0 ? 'Créer un code PIN' : 'Confirmer le code'} t={t} onClose={onClose} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '0 20px 44px' }}>
        <p style={{ fontSize: 13, color: t.text2, margin: 0, textAlign: 'center' }}>
          {step === 0 ? 'Saisissez un code à 4 chiffres' : 'Saisissez à nouveau votre code'}
        </p>
        <div style={{ display: 'flex', gap: 16, transform: `translateX(${shakeX}px)`, transition: 'transform .08s' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: i < current.length ? t.accent : t.border2, transition: 'background .12s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ROWS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 16 }}>
              {row.map(d => <Key key={d} d={d} />)}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 68, height: 68 }} />
            <Key d={0} />
            <button onClick={del} style={{ width: 68, height: 68, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcBack s={22} c={t.text2} />
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
