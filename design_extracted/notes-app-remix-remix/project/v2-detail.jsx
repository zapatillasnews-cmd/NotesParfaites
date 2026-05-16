// v2-detail.jsx — Note detail page (no priority, subtle actions, format toolbar)

const MetaRow = ({ label, children, alignTop=false, t }) => (
  <div style={{ display:'flex', alignItems:alignTop?'flex-start':'center', gap:8 }}>
    <span style={{ fontSize:12, color:t.text3, fontWeight:500, width:78, flexShrink:0, paddingTop:alignTop?3:0 }}>{label}</span>
    {children}
  </div>
);

const NoteDetailPage = ({ note: initialNote, onBack, dark, t }) => {
  const [title, setTitle] = React.useState(initialNote.title);
  const [body,  setBody]  = React.useState(initialNote.body || '');
  const bodyRef = React.useRef(null);

  // ── Formatting logic ────────────────────────────────────────
  const insertFormat = (type) => {
    const el = bodyRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const sel = body.substring(s, e);
    let next = body;
    let cur = e;

    if (type === 'bold') {
      const wrap = `**${sel || 'texte'}**`;
      next = body.slice(0,s) + wrap + body.slice(e);
      cur = sel ? e+4 : s+2;
    } else if (type === 'italic') {
      const wrap = `*${sel || 'texte'}*`;
      next = body.slice(0,s) + wrap + body.slice(e);
      cur = sel ? e+2 : s+1;
    } else if (type === 'h1') {
      const ls = body.lastIndexOf('\n', s-1) + 1;
      next = body.slice(0,ls) + '# ' + body.slice(ls);
      cur = s+2;
    } else if (type === 'bullet') {
      const ls = body.lastIndexOf('\n', s-1) + 1;
      next = body.slice(0,ls) + '• ' + body.slice(ls);
      cur = s+2;
    } else if (type === 'link') {
      const wrap = `[${sel || 'texte'}](url)`;
      next = body.slice(0,s) + wrap + body.slice(e);
      cur = sel ? e+7 : s+5;
    }

    setBody(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(cur, cur); });
  };

  // ── Toolbar button ──────────────────────────────────────────
  const FmtBtn = ({ type, title: ttl, children }) => (
    <button
      onMouseDown={ev => { ev.preventDefault(); insertFormat(type); }}
      title={ttl}
      style={{
        flex:1, height:40, border:'none', background:'transparent', cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        color:t.text2, borderRadius:8, transition:'background 0.1s',
      }}
    >{children}</button>
  );

  const note = initialNote;
  const folderData = (window.V2_FOLDERS || []).find(f => f.name === note.folder);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:t.card, transition:'background 0.3s' }}>

      {/* ── Header bar ──────────────────────────────────────── */}
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>

          {/* Back */}
          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:4, background:'transparent', border:'none', cursor:'pointer', padding:0 }}>
            <IcBack s={20} c={t.text}/>
            <span style={{ fontSize:14, fontWeight:600, color:t.text }}>Retour</span>
          </button>

          {/* Actions: subtle trash + save */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button style={{ width:32, height:32, borderRadius:8, border:'none', background:dark?'rgba(239,68,68,0.12)':'rgba(239,68,68,0.07)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <IcTrash s={15} c="#EF4444"/>
            </button>
            <button onClick={onBack} style={{ background:t.accent, color:'white', border:'none', borderRadius:10, padding:'7px 16px', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:`0 2px 8px ${t.accent}50` }}>
              Sauvegarder
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable content ──────────────────────────────── */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 12px' }}>

        {/* Editable title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titre de la note"
          style={{ width:'100%', border:'none', outline:'none', fontSize:24, fontWeight:800, color:t.text, fontFamily:'inherit', background:'transparent', padding:0, marginBottom:18 }}
        />

        {/* Metadata rows */}
        <div style={{ display:'flex', flexDirection:'column', gap:11, marginBottom:20 }}>
          <MetaRow label="Créé par" t={t}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <div style={{ width:22, height:22, borderRadius:'50%', background:'linear-gradient(135deg,#6366F1,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'white', fontWeight:800 }}>A</div>
              <span style={{ fontSize:13, fontWeight:600, color:t.text }}>{note.author}</span>
            </div>
          </MetaRow>

          <MetaRow label="Modifié le" t={t}>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <IcClock s={13} c={t.text2}/>
              <span style={{ fontSize:13, color:t.text2 }}>{note.date} · {note.time}</span>
            </div>
          </MetaRow>

          <MetaRow label="Tags" alignTop t={t}>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
              {note.tags.length > 0
                ? note.tags.map(tag => <TagChip key={tag} label={tag} color={note.color} dark={dark}/>)
                : <span style={{ fontSize:12.5, color:t.text3 }}>Aucun tag</span>
              }
            </div>
          </MetaRow>

          <MetaRow label="Dossier" t={t}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:18, height:18, borderRadius:5, background:folderData?.bg || '#EEF2FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <IcFolderNav s={11} c={folderData?.color || '#6366F1'}/>
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:t.text2 }}>{note.folder}</span>
            </div>
          </MetaRow>
        </div>

        {/* Divider */}
        <div style={{ height:1, background:t.border, marginBottom:20 }}/>

        {/* Editable body */}
        <textarea
          ref={bodyRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Commencez à écrire…"
          style={{ width:'100%', border:'none', outline:'none', resize:'none', fontSize:14.5, lineHeight:1.8, color:t.text2, fontFamily:'inherit', background:'transparent', minHeight:200, padding:0 }}
        />
      </div>

      {/* ── Formatting toolbar ──────────────────────────────── */}
      <div style={{ flexShrink:0, borderTop:`1px solid ${t.border}`, background:t.card, padding:'3px 8px 6px', display:'flex', alignItems:'center', gap:0, transition:'background 0.3s, border-color 0.3s' }}>
        <FmtBtn type="bold" ttl="Gras">
          <strong style={{ fontSize:15, letterSpacing:-0.5 }}>B</strong>
        </FmtBtn>

        <div style={{ width:1, height:20, background:t.border, flexShrink:0 }}/>

        <FmtBtn type="italic" ttl="Italique">
          <em style={{ fontSize:15, fontFamily:'Georgia,serif' }}>I</em>
        </FmtBtn>

        <div style={{ width:1, height:20, background:t.border, flexShrink:0 }}/>

        <FmtBtn type="h1" ttl="Titre">
          <svg width="17" height="14" viewBox="0 0 24 20" fill="none" stroke={t.text2} strokeWidth="2.5" strokeLinecap="round">
            <path d="M4 4v12M20 4v12M4 10h16"/>
          </svg>
        </FmtBtn>

        <div style={{ width:1, height:20, background:t.border, flexShrink:0 }}/>

        <FmtBtn type="bullet" ttl="Liste">
          <svg width="17" height="14" viewBox="0 0 24 20" fill="none" stroke={t.text2} strokeWidth="2" strokeLinecap="round">
            <circle cx="4.5" cy="5"  r="2" fill={t.text2} stroke="none"/>
            <circle cx="4.5" cy="10" r="2" fill={t.text2} stroke="none"/>
            <circle cx="4.5" cy="15" r="2" fill={t.text2} stroke="none"/>
            <path d="M10 5h10M10 10h10M10 15h10"/>
          </svg>
        </FmtBtn>

        <div style={{ width:1, height:20, background:t.border, flexShrink:0 }}/>

        <FmtBtn type="link" ttl="Lien">
          <svg width="17" height="14" viewBox="0 0 24 20" fill="none" stroke={t.text2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
          </svg>
        </FmtBtn>
      </div>
    </div>
  );
};

Object.assign(window, { NoteDetailPage, MetaRow });
