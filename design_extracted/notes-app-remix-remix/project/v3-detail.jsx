// v3-detail.jsx — Note detail matching screenshot layout

const NoteDetailPage = ({ note: init, onBack, onUpdate, dark, t }) => {
  const [title,     setTitle]     = React.useState(init.title);
  const [body,      setBody]      = React.useState(init.body || '');
  const [tags,      setTags]      = React.useState([...(init.tags||[])]);
  const [addingTag, setAddingTag] = React.useState(false);
  const [tagInput,  setTagInput]  = React.useState('');
  const bodyRef    = React.useRef(null);
  const tagInputRef= React.useRef(null);

  const folderData = (window.V3_FOLDERS||[]).find(f=>f.name===init.folder);

  // ── Save ─────────────────────────────────────────────────
  const save = () => {
    if (onUpdate) onUpdate({ ...init, title, body, tags });
    onBack();
  };

  // ── Formatting ───────────────────────────────────────────
  const fmt = (type) => {
    const el=bodyRef.current; if(!el) return;
    const s=el.selectionStart, e=el.selectionEnd, sel=body.substring(s,e);
    let next=body, cur=e;
    if(type==='bold')   { const w=`**${sel||'texte'}**`; next=body.slice(0,s)+w+body.slice(e); cur=sel?e+4:s+2; }
    if(type==='italic') { const w=`*${sel||'texte'}*`;   next=body.slice(0,s)+w+body.slice(e); cur=sel?e+2:s+1; }
    if(type==='h1')     { const ls=body.lastIndexOf('\n',s-1)+1; next=body.slice(0,ls)+'# '+body.slice(ls); cur=s+2; }
    if(type==='link')   { const w=`[${sel||'texte'}](url)`; next=body.slice(0,s)+w+body.slice(e); cur=sel?e+7:s+5; }
    if(type==='bullet') { const ls=body.lastIndexOf('\n',s-1)+1; next=body.slice(0,ls)+'• '+body.slice(ls); cur=s+2; }
    setBody(next);
    requestAnimationFrame(()=>{ el.focus(); el.setSelectionRange(cur,cur); });
  };

  const undo = () => { bodyRef.current?.focus(); document.execCommand('undo'); };
  const redo = () => { bodyRef.current?.focus(); document.execCommand('redo'); };

  // ── Tags ─────────────────────────────────────────────────
  const confirmTag = () => {
    const v = tagInput.trim();
    if (v && !tags.includes(v)) setTags(ts=>[...ts,v]);
    setTagInput(''); setAddingTag(false);
  };
  const removeTag = (tag) => setTags(ts=>ts.filter(x=>x!==tag));
  const openTagInput = () => {
    setAddingTag(true);
    setTimeout(()=>tagInputRef.current?.focus(), 60);
  };

  // ── Format button ────────────────────────────────────────
  const FmtBtn = ({ type, children, onPress }) => (
    <button
      onMouseDown={ev=>{ ev.preventDefault(); onPress ? onPress() : fmt(type); }}
      style={{ flex:1, height:'100%', border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit', padding:0 }}
    >
      {children}
    </button>
  );

  // ── Metadata row ─────────────────────────────────────────
  const MRow = ({ label, children, last=false, alignTop=false }) => (
    <div style={{ display:'flex', alignItems:alignTop?'flex-start':'center', padding:'13px 0', borderBottom:last?'none':`1px solid ${t.border}` }}>
      <span style={{ fontSize:13.5, color:t.text3, width:90, flexShrink:0, paddingTop:alignTop?2:0, fontWeight:400 }}>{label}</span>
      <div style={{ flex:1, display:'flex', alignItems:'center' }}>{children}</div>
    </div>
  );

  const c = t.text2; // icon color for toolbar

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.card, transition:'background .3s' }}>

      {/* ── Header (matches screenshot) ─────────────────── */}
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>

          {/* ‹ Retour */}
          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:3, background:'transparent', border:'none', cursor:'pointer', padding:0 }}>
            <svg width="8" height="14" viewBox="0 0 8 14"><path d="M7 1L1 7l6 6" stroke={t.text3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span style={{ fontSize:15, color:t.text3, fontWeight:400 }}>Retour</span>
          </button>

          {/* × Enregistrer */}
          <div style={{ display:'flex', alignItems:'center', gap:18 }}>
            <button style={{ background:'transparent', border:'none', cursor:'pointer', padding:0, lineHeight:1 }}>
              <span style={{ fontSize:20, color:t.text2, fontWeight:300, lineHeight:1 }}>×</span>
            </button>
            <button onClick={save} style={{ background:'transparent', border:'none', cursor:'pointer', padding:0 }}>
              <span style={{ fontSize:15, color:t.text, fontWeight:700 }}>Enregistrer</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable content ───────────────────────────── */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 12px' }}>

        {/* Title */}
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titre"
          style={{ width:'100%', border:'none', outline:'none', fontSize:26, fontWeight:800, color:t.text, fontFamily:'inherit', background:'transparent', padding:0, marginBottom:22, lineHeight:1.2 }}/>

        {/* ── Metadata table ── */}
        <div style={{ borderTop:`1px solid ${t.border}` }}>

          {/* Créé par */}
          <MRow label="Créé par">
            <span style={{ fontSize:14, color:t.text2 }}>Moi</span>
          </MRow>

          {/* Dossier */}
          <MRow label="Dossier">
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <div style={{ width:18,height:18,borderRadius:5,background:folderData?.bg||'#EEF2FF',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <IcFolderN s={11} c={folderData?.color||'#6366F1'} filled/>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color:t.text }}>{init.folder}</span>
            </div>
          </MRow>

          {/* Tags */}
          <MRow label="Tags" alignTop>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, alignItems:'center', paddingTop:1 }}>
              {tags.map(tag=>(
                <span key={tag} style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:12, fontWeight:600, padding:'3px 8px 3px 10px', borderRadius:20, background:dark?`${folderData?.color||'#6366F1'}22`:`${folderData?.color||'#6366F1'}15`, color:folderData?.color||'#6366F1' }}>
                  {tag}
                  <button onClick={()=>removeTag(tag)} style={{ background:'transparent',border:'none',cursor:'pointer',padding:0,lineHeight:1,fontSize:13,color:folderData?.color||'#6366F1',display:'flex',alignItems:'center' }}>×</button>
                </span>
              ))}
              {addingTag ? (
                <input ref={tagInputRef} value={tagInput}
                  onChange={e=>setTagInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'||e.key===','){e.preventDefault();confirmTag();} if(e.key==='Escape'){setAddingTag(false);setTagInput('');} }}
                  onBlur={confirmTag}
                  placeholder="nouveau tag"
                  style={{ border:'none',outline:'none',fontSize:13,color:t.text,background:'transparent',fontFamily:'inherit',width:100,padding:'2px 0' }}
                />
              ) : (
                <button onClick={openTagInput} style={{ width:30,height:30,borderRadius:7,border:`1.5px dashed ${t.border2}`,background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  <IcPlus s={13} c={t.text3}/>
                </button>
              )}
            </div>
          </MRow>

          {/* Modifié le */}
          <MRow label="Modifié le" last>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <span style={{ fontSize:13.5, color:t.text2 }}>{init.date} · {init.time}</span>
            </div>
          </MRow>
        </div>

        {/* Body */}
        <textarea ref={bodyRef} value={body} onChange={e=>setBody(e.target.value)}
          placeholder="Commencez à écrire…"
          style={{ width:'100%',border:'none',outline:'none',resize:'none',fontSize:15,lineHeight:1.8,color:t.text2,fontFamily:'inherit',background:'transparent',minHeight:200,padding:'18px 0 0' }}
        />
      </div>

      {/* ── Format toolbar (matches screenshot) ─────────── */}
      <div style={{ flexShrink:0, padding:'6px 16px 10px', background:t.bg, transition:'background .3s' }}>
        <div style={{ display:'flex', alignItems:'center', height:52, background:t.card, borderRadius:20, padding:'0 6px', boxShadow: dark ? '0 4px 24px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06)' : '0 2px 16px rgba(0,0,0,.09), 0 0 0 1px rgba(0,0,0,.06)' }}>

          {/* B */}
          <FmtBtn type="bold">
            <span style={{ fontSize:18, fontWeight:700, color:c, fontFamily:'Georgia,serif', letterSpacing:-.5 }}>B</span>
          </FmtBtn>

          {/* I */}
          <FmtBtn type="italic">
            <em style={{ fontSize:18, color:c, fontFamily:'Georgia,serif', fontStyle:'italic' }}>I</em>
          </FmtBtn>

          {/* H1 */}
          <FmtBtn type="h1">
            <span style={{ fontSize:13, fontWeight:700, color:c, letterSpacing:-.3 }}>H1</span>
          </FmtBtn>

          {/* Link */}
          <FmtBtn type="link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
          </FmtBtn>

          {/* List / align */}
          <FmtBtn type="bullet">
            <svg width="18" height="14" viewBox="0 0 22 18" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
              <path d="M2 4h18M2 9h18M2 14h18"/>
            </svg>
          </FmtBtn>

          {/* Undo */}
          <FmtBtn type="undo" onPress={undo}>
            <svg width="18" height="16" viewBox="0 0 24 22" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10a7 7 0 107 -7"/><path d="M3 3v7h7"/>
            </svg>
          </FmtBtn>

          {/* Redo */}
          <FmtBtn type="redo" onPress={redo}>
            <svg width="18" height="16" viewBox="0 0 24 22" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10a7 7 0 10-7-7"/><path d="M21 3v7h-7"/>
            </svg>
          </FmtBtn>

        </div>
      </div>
    </div>
  );
};

Object.assign(window, { NoteDetailPage });
