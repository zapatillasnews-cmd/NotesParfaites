// notes-detail.jsx — Note detail / edit page

const NoteDetailPage = ({ note: initialNote, onBack }) => {
  const [title, setTitle] = React.useState(initialNote.title);
  const [body, setBody]   = React.useState(initialNote.body);
  const note = initialNote;

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'white' }}>

      {/* ── Top bar ── */}
      <div style={{ paddingTop:62, padding:'62px 20px 0', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <button onClick={onBack} style={{
            display:'flex', alignItems:'center', gap:4,
            background:'transparent', border:'none', cursor:'pointer', padding:0,
          }}>
            <IcBack s={20} c="#0F172A" />
            <span style={{ fontSize:14, fontWeight:600, color:'#0F172A' }}>Retour</span>
          </button>
          <button onClick={onBack} style={{
            background:'#4F46E5', color:'white', border:'none',
            borderRadius:10, padding:'7px 18px',
            fontSize:13, fontWeight:700, cursor:'pointer',
            boxShadow:'0 2px 8px rgba(79,70,229,0.3)',
          }}>Enregistrer</button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 20px 40px' }}>

        {/* Editable title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titre de la note"
          style={{
            width:'100%', border:'none', outline:'none',
            fontSize:24, fontWeight:800, color:'#0F172A',
            fontFamily:'inherit', background:'transparent',
            padding:0, marginBottom:18,
          }}
        />

        {/* ── Metadata ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:11, marginBottom:20 }}>

          {/* Author */}
          <MetaRow label="Créé par">
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <div style={{
                width:22, height:22, borderRadius:'50%', flexShrink:0,
                background:'linear-gradient(135deg, #4F46E5, #7C3AED)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:10, color:'white', fontWeight:800,
              }}>A</div>
              <span style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{note.author}</span>
            </div>
          </MetaRow>

          {/* Date */}
          <MetaRow label="Modifié le">
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <IcClock s={13} c="#64748B" />
              <span style={{ fontSize:13, color:'#64748B' }}>{note.date} · {note.time}</span>
            </div>
          </MetaRow>

          {/* Tags */}
          <MetaRow label="Tags" alignTop>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
              {note.tags.length > 0
                ? note.tags.map(t => <TagChip key={t} label={t} color={note.color} />)
                : <span style={{ fontSize:12.5, color:'#94A3B8' }}>Aucun tag</span>
              }
            </div>
          </MetaRow>

          {/* Priority */}
          <MetaRow label="Priorité">
            <PriorityBadge priority={note.priority} />
          </MetaRow>

          {/* Folder */}
          <MetaRow label="Dossier">
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{
                width:18, height:18, borderRadius:5,
                background: (window.FOLDERS_DATA.find(f => f.name === note.folder) || {}).bg || '#EEF2FF',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <IcFolderNav s={11} c={(window.FOLDERS_DATA.find(f => f.name === note.folder) || {}).color || '#4F46E5'} />
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:'#64748B' }}>{note.folder}</span>
            </div>
          </MetaRow>
        </div>

        {/* Divider */}
        <div style={{ height:1, background:'#F1F5F9', marginBottom:20 }} />

        {/* Editable body */}
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Commencez à écrire…"
          style={{
            width:'100%', border:'none', outline:'none', resize:'none',
            fontSize:14.5, lineHeight:1.75, color:'#334155',
            fontFamily:'inherit', background:'transparent',
            minHeight:220, padding:0,
          }}
        />

        {/* Action buttons */}
        <div style={{ display:'flex', gap:8, marginTop:24, paddingTop:16, borderTop:'1px solid #F1F5F9' }}>
          <button style={{
            flex:1, padding:'11px', borderRadius:12, border:'1.5px solid #E2E8F0',
            background:'transparent', fontSize:13, fontWeight:600,
            color:'#64748B', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            <IcEdit s={15} c="#64748B" /> Modifier
          </button>
          <button style={{
            flex:1, padding:'11px', borderRadius:12, border:'1.5px solid #FEE2E2',
            background:'#FEF2F2', fontSize:13, fontWeight:600,
            color:'#DC2626', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            <IcTrash s={15} c="#DC2626" /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Metadata row helper ──────────────────────────────────────
const MetaRow = ({ label, children, alignTop = false }) => (
  <div style={{ display:'flex', alignItems: alignTop ? 'flex-start' : 'center', gap:8 }}>
    <span style={{
      fontSize:12, color:'#94A3B8', fontWeight:500,
      width:78, flexShrink:0, paddingTop: alignTop ? 3 : 0,
    }}>{label}</span>
    {children}
  </div>
);

Object.assign(window, { NoteDetailPage, MetaRow });
