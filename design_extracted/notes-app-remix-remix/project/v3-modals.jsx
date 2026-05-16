// v3-modals.jsx — AddFolder, AddSubFolder, PIN lock, PIN setup, Add notification

// ── Folder color palette ───────────────────────────────────────
const FOLDER_PALETTE = [
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

// ── Bottom Sheet Wrapper ──────────────────────────────────────
const Sheet = ({ t, dark, children, onClose }) => (
  <>
    <div onClick={onClose} style={{ position:'absolute', inset:0, background:`rgba(0,0,0,${dark?.5:.35})`, zIndex:200, backdropFilter:'blur(3px)', WebkitBackdropFilter:'blur(3px)' }}/>
    <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:201, background:t.card, borderRadius:'22px 22px 0 0', boxShadow:`0 -6px 40px rgba(0,0,0,${dark?.6:.14})`, transition:'background .3s' }}>
      <div style={{ width:36, height:4, borderRadius:2, background:t.border2, margin:'12px auto 18px' }}/>
      {children}
    </div>
  </>
);

// ── Sheet header ──────────────────────────────────────────────
const SheetHeader = ({ title, t, onClose }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 20px', marginBottom:20 }}>
    <h3 style={{ fontSize:18, fontWeight:800, color:t.text, margin:0 }}>{title}</h3>
    <button onClick={onClose} style={{ width:28, height:28, borderRadius:8, border:'none', background:t.card2, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <IcX s={14} c={t.text3}/>
    </button>
  </div>
);

// ── Label ─────────────────────────────────────────────────────
const Label = ({ children, t }) => (
  <div style={{ fontSize:11, fontWeight:700, color:t.text3, textTransform:'uppercase', letterSpacing:.8, marginBottom:8 }}>{children}</div>
);

// ── Text input ────────────────────────────────────────────────
const TInput = ({ value, onChange, placeholder, t, autoFocus }) => (
  <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus}
    style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:`1.5px solid ${t.border2}`, outline:'none', fontSize:14, color:t.text, background:t.inputBg, fontFamily:'inherit', boxSizing:'border-box', transition:'background .3s,border-color .3s' }}
  />
);

// ── Add Folder Modal ──────────────────────────────────────────
const AddFolderModal = ({ t, dark, onClose, onAdd, parentFolder=null }) => {
  const [name, setName]   = React.useState('');
  const [color, setColor] = React.useState('#6366F1');
  const active = FOLDER_PALETTE.find(p=>p.c===color) || FOLDER_PALETTE[0];
  const title  = parentFolder ? `Sous-dossier de "${parentFolder}"` : 'Nouveau dossier';

  return (
    <Sheet t={t} dark={dark} onClose={onClose}>
      <SheetHeader title={title} t={t} onClose={onClose}/>
      <div style={{ padding:'0 20px 40px', display:'flex', flexDirection:'column', gap:18 }}>

        {/* Preview */}
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderRadius:14, background:t.card2, border:`1px solid ${t.border}` }}>
          <div style={{ width:44, height:44, borderRadius:14, background:active.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <IcFolderN s={22} c={color} filled/>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:name?t.text:t.text3 }}>{name||'Nom du dossier'}</div>
            <div style={{ fontSize:12, color:t.text3, marginTop:2 }}>0 note</div>
          </div>
        </div>

        {/* Name */}
        <div>
          <Label t={t}>Nom</Label>
          <TInput value={name} onChange={setName} placeholder="Ex : Recettes, Voyage…" t={t} autoFocus/>
        </div>

        {/* Colors — single scrollable row */}
        <div>
          <Label t={t}>Couleur</Label>
          <style>{`.v3-pal::-webkit-scrollbar{display:block!important;height:4px}.v3-pal::-webkit-scrollbar-track{background:transparent}.v3-pal::-webkit-scrollbar-thumb{background:rgba(128,128,128,.3);border-radius:4px}`}</style>
          <div className="v3-pal" style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:8, WebkitOverflowScrolling:'touch' }}>
            {FOLDER_PALETTE.map(p=>(
              <div key={p.c} onClick={()=>setColor(p.c)} style={{ width:38, height:38, borderRadius:11, background:p.bg, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, border:`2.5px solid ${color===p.c?p.c:'transparent'}`, boxSizing:'border-box', transition:'border .15s' }}>
                <div style={{ width:14, height:14, borderRadius:4, background:p.c }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:'12px', borderRadius:12, border:`1.5px solid ${t.border2}`, background:'transparent', fontSize:14, fontWeight:700, color:t.text2, cursor:'pointer', fontFamily:'inherit' }}>Annuler</button>
          <button onClick={()=>{ if(name.trim()){ onAdd({name:name.trim(),color,bg:active.bg,parentFolder}); onClose(); }}}
            style={{ flex:1, padding:'12px', borderRadius:12, border:'none', background:name.trim()?t.accent:t.border2, fontSize:14, fontWeight:700, color:t.btnText, cursor:'pointer', fontFamily:'inherit', transition:'background .2s', opacity:name.trim()?1:.55 }}>
            Créer
          </button>
        </div>
      </div>
    </Sheet>
  );
};

// ── PIN Lock Screen ───────────────────────────────────────────
const PINScreen = ({ onUnlock, pin, t, dark }) => {
  const [entered, setEntered] = React.useState('');
  const [shakeX,  setShakeX]  = React.useState(0);

  const shake = () => {
    const seq = [10,-10,8,-8,5,-5,0];
    seq.forEach((x,i)=>setTimeout(()=>setShakeX(x), i*70));
    setTimeout(()=>setEntered(''), seq.length*70);
  };

  const press = (d) => {
    if (entered.length >= 4) return;
    const next = entered + d;
    setEntered(next);
    if (next.length === 4) {
      if (next === pin) { onUnlock(); }
      else { shake(); }
    }
  };

  const del = () => setEntered(e=>e.slice(0,-1));

  const Key = ({ label, sub, onPress }) => (
    <button onClick={onPress} style={{ width:72, height:72, borderRadius:'50%', background:t.card, border:`1px solid ${t.border}`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', boxShadow:t.shadow, fontFamily:'inherit' }}>
      <span style={{ fontSize:22, fontWeight:400, color:t.text, lineHeight:1 }}>{label}</span>
      {sub && <span style={{ fontSize:9, color:t.text3, letterSpacing:1.5, marginTop:2 }}>{sub}</span>}
    </button>
  );

  const rows = [[{l:'1',s:''},{l:'2',s:'ABC'},{l:'3',s:'DEF'}],[{l:'4',s:'GHI'},{l:'5',s:'JKL'},{l:'6',s:'MNO'}],[{l:'7',s:'PQRS'},{l:'8',s:'TUV'},{l:'9',s:'WXYZ'}]];

  return (
    <div style={{ position:'absolute', inset:0, background:t.bg, zIndex:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:28, paddingTop:40 }}>
      <IcLock s={32} c={t.text3}/>
      <p style={{ fontSize:17, fontWeight:600, color:t.text, margin:0 }}>Code PIN</p>

      {/* Dots */}
      <div style={{ display:'flex', gap:18, transform:`translateX(${shakeX}px)`, transition:shakeX===0?'transform .1s':'none' }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ width:13, height:13, borderRadius:'50%', background:i<entered.length?t.accent:t.border2, transition:'background .12s' }}/>
        ))}
      </div>

      {/* Numpad */}
      <div style={{ display:'flex', flexDirection:'column', gap:14, alignItems:'center' }}>
        {rows.map((row,ri)=>(
          <div key={ri} style={{ display:'flex', gap:20 }}>
            {row.map(({l,s})=><Key key={l} label={l} sub={s} onPress={()=>press(l)}/>)}
          </div>
        ))}
        <div style={{ display:'flex', gap:20, alignItems:'center' }}>
          <div style={{ width:72, height:72 }}/>
          <Key label="0" onPress={()=>press('0')}/>
          <button onClick={del} style={{ width:72, height:72, background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <IcBack s={24} c={t.text2}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ── PIN Setup Modal ───────────────────────────────────────────
const PINSetupModal = ({ t, dark, onClose, onSave }) => {
  const [step,    setStep]    = React.useState(0); // 0=enter, 1=confirm
  const [first,   setFirst]   = React.useState('');
  const [second,  setSecond]  = React.useState('');
  const [shakeX,  setShakeX]  = React.useState(0);

  const current = step===0 ? first : second;
  const setCurrent = step===0 ? setFirst : setSecond;

  const shake = () => {
    const seq=[8,-8,6,-6,0];
    seq.forEach((x,i)=>setTimeout(()=>setShakeX(x),i*70));
    setTimeout(()=>{ setSecond(''); setStep(0); setFirst(''); }, seq.length*70+50);
  };

  const press = (d) => {
    if (current.length >= 4) return;
    const next = current + d;
    setCurrent(next);
    if (next.length === 4) {
      if (step===0) { setStep(1); }
      else {
        if (next === first) { onSave(first); onClose(); }
        else { shake(); }
      }
    }
  };

  const del = () => setCurrent(c=>c.slice(0,-1));
  const rows=[[1,2,3],[4,5,6],[7,8,9]];

  const Key = ({d}) => (
    <button onClick={()=>press(String(d))} style={{ width:68,height:68,borderRadius:'50%',background:t.card2,border:`1px solid ${t.border}`,fontSize:21,fontWeight:400,color:t.text,cursor:'pointer',fontFamily:'inherit',boxShadow:t.shadow }}>
      {d}
    </button>
  );

  return (
    <Sheet t={t} dark={dark} onClose={onClose}>
      <SheetHeader title={step===0?'Créer un code PIN':'Confirmer le code'} t={t} onClose={onClose}/>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:22, padding:'0 20px 44px' }}>
        <p style={{ fontSize:13, color:t.text2, margin:0, textAlign:'center' }}>{step===0?'Saisissez un code à 4 chiffres':'Saisissez à nouveau votre code'}</p>
        <div style={{ display:'flex', gap:16, transform:`translateX(${shakeX}px)`, transition:'transform .08s' }}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{ width:12,height:12,borderRadius:'50%',background:i<current.length?t.accent:t.border2,transition:'background .12s' }}/>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {rows.map((row,ri)=>(<div key={ri} style={{ display:'flex', gap:16 }}>{row.map(d=><Key key={d} d={d}/>)}</div>))}
          <div style={{ display:'flex', gap:16, alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:68,height:68 }}/>
            <Key d={0}/>
            <button onClick={del} style={{ width:68,height:68,background:'transparent',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <IcBack s={22} c={t.text2}/>
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  );
};

// ── Add Notification Modal ────────────────────────────────────
const AddNotifModal = ({ t, dark, onClose, onAdd }) => {
  const [title, setTitle] = React.useState('');
  const [date,  setDate]  = React.useState('');
  const [time,  setTime]  = React.useState('');

  return (
    <Sheet t={t} dark={dark} onClose={onClose}>
      <SheetHeader title="Nouveau rappel" t={t} onClose={onClose}/>
      <div style={{ padding:'0 20px 44px', display:'flex', flexDirection:'column', gap:16 }}>
        <div>
          <Label t={t}>Titre</Label>
          <TInput value={title} onChange={setTitle} placeholder="Ex : Revoir le projet…" t={t} autoFocus/>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ flex:1 }}>
            <Label t={t}>Date</Label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)}
              style={{ width:'100%',padding:'11px 14px',borderRadius:12,border:`1.5px solid ${t.border2}`,outline:'none',fontSize:14,color:t.text,background:t.inputBg,fontFamily:'inherit',boxSizing:'border-box' }}/>
          </div>
          <div style={{ flex:1 }}>
            <Label t={t}>Heure</Label>
            <input type="time" value={time} onChange={e=>setTime(e.target.value)}
              style={{ width:'100%',padding:'11px 14px',borderRadius:12,border:`1.5px solid ${t.border2}`,outline:'none',fontSize:14,color:t.text,background:t.inputBg,fontFamily:'inherit',boxSizing:'border-box' }}/>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:4 }}>
          <button onClick={onClose} style={{ flex:1,padding:'12px',borderRadius:12,border:`1.5px solid ${t.border2}`,background:'transparent',fontSize:14,fontWeight:700,color:t.text2,cursor:'pointer',fontFamily:'inherit' }}>Annuler</button>
          <button onClick={()=>{ if(title.trim()){ onAdd({id:Date.now(),title:title.trim(),date,time}); onClose(); }}}
            style={{ flex:1,padding:'12px',borderRadius:12,border:'none',background:title.trim()?t.accent:t.border2,fontSize:14,fontWeight:700,color:t.btnText,cursor:'pointer',fontFamily:'inherit',opacity:title.trim()?1:.55 }}>
            Ajouter
          </button>
        </div>
      </div>
    </Sheet>
  );
};

Object.assign(window, { FOLDER_PALETTE, AddFolderModal, PINScreen, PINSetupModal, AddNotifModal });
