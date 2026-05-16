import { useState, useRef } from 'react';
import { IcPlus, IcFolderN, IcCalendar } from '../icons';

export default function NoteDetailScreen({ note: init, onBack, onUpdate, onDelete, dark, t, folders }) {
  const [title,        setTitle]        = useState(init.title);
  const [body,         setBody]         = useState(init.body || '');
  const [tags,         setTags]         = useState([...(init.tags || [])]);
  const [author,       setAuthor]       = useState(init.author || 'Moi');
  const [folder,       setFolder]       = useState(init.folder || (folders?.[0]?.name ?? ''));
  const [showFolders,  setShowFolders]  = useState(false);
  const [addingTag,    setAddingTag]    = useState(false);
  const [tagInput,     setTagInput]     = useState('');
  const bodyRef    = useRef(null);
  const tagInputRef= useRef(null);

  const folderData = folders?.find(f => f.name === folder);

  const save = () => {
    const now  = new Date();
    const date = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const fd   = folders?.find(f => f.name === folder);
    if (onUpdate) onUpdate({ ...init, title, body, tags, author, folder, preview: body.slice(0, 100), date, time, color: fd?.color || init.color, colorLight: fd?.bg || init.colorLight });
    onBack();
  };

  const discard = () => onBack();

  const fmt = (type) => {
    const el = bodyRef.current; if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd, sel = body.substring(s, e);
    let next = body, cur = e;
    if (type === 'bold')   { const w = `**${sel || 'texte'}**`; next = body.slice(0, s) + w + body.slice(e); cur = sel ? e + 4 : s + 2; }
    if (type === 'italic') { const w = `*${sel || 'texte'}*`;   next = body.slice(0, s) + w + body.slice(e); cur = sel ? e + 2 : s + 1; }
    if (type === 'h1')     { const ls = body.lastIndexOf('\n', s - 1) + 1; next = body.slice(0, ls) + '# ' + body.slice(ls); cur = s + 2; }
    if (type === 'link')   { const w = `[${sel || 'texte'}](url)`; next = body.slice(0, s) + w + body.slice(e); cur = sel ? e + 7 : s + 5; }
    if (type === 'bullet') { const ls = body.lastIndexOf('\n', s - 1) + 1; next = body.slice(0, ls) + '• ' + body.slice(ls); cur = s + 2; }
    setBody(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(cur, cur); });
  };

  const undo = () => { bodyRef.current?.focus(); document.execCommand('undo'); };
  const redo = () => { bodyRef.current?.focus(); document.execCommand('redo'); };

  const confirmTag = () => {
    const v = tagInput.trim();
    if (v && !tags.includes(v)) setTags(ts => [...ts, v]);
    setTagInput(''); setAddingTag(false);
  };
  const removeTag = (tag) => setTags(ts => ts.filter(x => x !== tag));
  const openTagInput = () => { setAddingTag(true); setTimeout(() => tagInputRef.current?.focus(), 60); };

  const FmtBtn = ({ type, children, onPress }) => (
    <button
      onMouseDown={ev => { ev.preventDefault(); onPress ? onPress() : fmt(type); }}
      onTouchStart={ev => { ev.preventDefault(); onPress ? onPress() : fmt(type); }}
      style={{ flex: 1, height: '100%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', padding: 0 }}
    >
      {children}
    </button>
  );

  const MRow = ({ label, children, last = false, alignTop = false }) => (
    <div style={{ display: 'flex', alignItems: alignTop ? 'flex-start' : 'center', padding: '13px 0', borderBottom: last ? 'none' : `1px solid ${t.border}` }}>
      <span style={{ fontSize: 13.5, color: t.text3, width: 90, flexShrink: 0, paddingTop: alignTop ? 2 : 0, fontWeight: 400 }}>{label}</span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>{children}</div>
    </div>
  );

  const c = t.text2;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.card, transition: 'background .3s' }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={discard} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'transparent', border: 'none', padding: 0 }}>
            <svg width="8" height="14" viewBox="0 0 8 14"><path d="M7 1L1 7l6 6" stroke={t.text3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
            <span style={{ fontSize: 15, color: t.text3, fontWeight: 400 }}>Retour</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button onClick={discard} style={{ background: 'transparent', border: 'none', padding: 0, lineHeight: 1 }}>
              <span style={{ fontSize: 20, color: t.text2, fontWeight: 300, lineHeight: 1 }}>×</span>
            </button>
            <button onClick={save} style={{ background: 'transparent', border: 'none', padding: 0 }}>
              <span style={{ fontSize: 15, color: t.text, fontWeight: 700 }}>Enregistrer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 12px' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titre"
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: 26, fontWeight: 800, color: t.text, fontFamily: 'inherit', background: 'transparent', padding: 0, marginBottom: 22, lineHeight: 1.2 }}
        />

        {/* Metadata table */}
        <div style={{ borderTop: `1px solid ${t.border}` }}>
          <MRow label="Créé par">
            <input
              value={author}
              onChange={e => setAuthor(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 14, color: t.text2, background: 'transparent', fontFamily: 'inherit', width: '100%' }}
            />
          </MRow>

          <MRow label="Dossier">
            <div style={{ flex: 1 }}>
              <div onClick={() => setShowFolders(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: folderData?.bg || '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IcFolderN s={11} c={folderData?.color || '#6366F1'} filled />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{folder}</span>
                <span style={{ fontSize: 11, color: t.text3, marginLeft: 2 }}>▾</span>
              </div>
              {showFolders && (
                <div style={{ marginTop: 8, borderRadius: 10, background: t.bg, overflow: 'hidden', boxShadow: t.shadow }}>
                  {folders?.map(f => (
                    <div key={f.id} onClick={() => { setFolder(f.name); setShowFolders(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderBottom: `1px solid ${t.border}`, cursor: 'pointer', background: folder === f.name ? t.accentBg : 'transparent' }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IcFolderN s={10} c={f.color} filled />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: folder === f.name ? t.accent : t.text }}>{f.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </MRow>

          <MRow label="Tags" alignTop>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', paddingTop: 1 }}>
              {tags.map(tag => (
                <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, padding: '3px 8px 3px 10px', borderRadius: 20, background: dark ? `${folderData?.color || '#6366F1'}22` : `${folderData?.color || '#6366F1'}15`, color: folderData?.color || '#6366F1' }}>
                  {tag}
                  <button onClick={() => removeTag(tag)} style={{ background: 'transparent', border: 'none', padding: 0, lineHeight: 1, fontSize: 13, color: folderData?.color || '#6366F1', display: 'flex', alignItems: 'center' }}>×</button>
                </span>
              ))}
              {addingTag ? (
                <input ref={tagInputRef} value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); confirmTag(); } if (e.key === 'Escape') { setAddingTag(false); setTagInput(''); } }}
                  onBlur={confirmTag}
                  placeholder="nouveau tag"
                  style={{ border: 'none', outline: 'none', fontSize: 13, color: t.text, background: 'transparent', fontFamily: 'inherit', width: 100, padding: '2px 0' }}
                />
              ) : (
                <button onClick={openTagInput} style={{ width: 30, height: 30, borderRadius: 7, border: `1.5px dashed ${t.border2}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IcPlus s={13} c={t.text3} />
                </button>
              )}
            </div>
          </MRow>

          <MRow label="Modifié le" last>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IcCalendar s={14} c={t.text3} />
              <span style={{ fontSize: 13.5, color: t.text2 }}>{init.date} · {init.time}</span>
            </div>
          </MRow>
        </div>

        <textarea
          ref={bodyRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Commencez à écrire…"
          style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: 15, lineHeight: 1.8, color: t.text2, fontFamily: 'inherit', background: 'transparent', minHeight: 200, padding: '18px 0 0' }}
        />
      </div>

      {/* Format toolbar */}
      <div style={{ flexShrink: 0, padding: '6px 16px 10px', background: t.bg, transition: 'background .3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 52, background: t.card, borderRadius: 20, padding: '0 6px', boxShadow: t.toolbarShadow }}>

          <FmtBtn type="bold">
            <span style={{ fontSize: 18, fontWeight: 700, color: c, fontFamily: 'Georgia,serif', letterSpacing: -.5 }}>B</span>
          </FmtBtn>

          <FmtBtn type="italic">
            <em style={{ fontSize: 18, color: c, fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>I</em>
          </FmtBtn>

          <FmtBtn type="h1">
            <span style={{ fontSize: 13, fontWeight: 700, color: c, letterSpacing: -.3 }}>H1</span>
          </FmtBtn>

          <FmtBtn type="link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </FmtBtn>

          <FmtBtn type="bullet">
            <svg width="18" height="14" viewBox="0 0 22 18" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
              <path d="M2 4h18M2 9h18M2 14h18" />
            </svg>
          </FmtBtn>

          <FmtBtn type="undo" onPress={undo}>
            <svg width="18" height="16" viewBox="0 0 24 22" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10a7 7 0 107-7" /><path d="M3 3v7h7" />
            </svg>
          </FmtBtn>

          <FmtBtn type="redo" onPress={redo}>
            <svg width="18" height="16" viewBox="0 0 24 22" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10a7 7 0 10-7-7" /><path d="M21 3v7h-7" />
            </svg>
          </FmtBtn>

        </div>
      </div>
    </div>
  );
}
