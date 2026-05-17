import { useState, useRef, useEffect } from 'react';
import { IcPlus, IcFolderN, IcCalendar } from '../icons';

const NOTE_BACKGROUNDS = [
  '#DBEAFE', // bleu
  '#FCE7F3', // rose
  '#D1FAE5', // vert
  '#FEF9C3', // jaune
  '#EDE9FE', // mauve
  '#FFEDD5', // orange
  '#FEE2E2', // rouge
  '#CCFBF1', // turquoise
];

const HIGHLIGHT_COLORS = [
  '#FEF08A', // jaune
  '#FED7AA', // orange
  '#FBCFE8', // rose
  '#FECACA', // rouge
  '#BBF7D0', // vert
  '#99F6E4', // turquoise
  '#BAE6FD', // bleu
  '#DDD6FE', // violet
];

const MRow = ({ label, children, last = false, alignTop = false, t }) => (
  <div style={{ display: 'flex', alignItems: alignTop ? 'flex-start' : 'center', padding: '13px 0', borderBottom: last ? 'none' : `1px solid ${t.border}` }}>
    <span style={{ fontSize: 13.5, color: t.text3, width: 90, flexShrink: 0, paddingTop: alignTop ? 2 : 0, fontWeight: 400 }}>{label}</span>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>{children}</div>
  </div>
);

const FmtBtn = ({ onPress, children }) => (
  <button
    onClick={onPress}
    style={{ flex: 1, height: '100%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', padding: 0, touchAction: 'manipulation' }}
  >
    {children}
  </button>
);

export default function NoteDetailScreen({ note: init, onBack, onUpdate, onDelete, dark, t, folders, subfolders = {} }) {
  const [title,          setTitle]          = useState(init.title);
  const [tags,           setTags]           = useState([...(init.tags || [])]);
  const [author,         setAuthor]         = useState(init.author || 'Moi');
  const [folder,         setFolder]         = useState(init.folder || (folders?.[0]?.name ?? ''));
  const [subfolder,      setSubfolder]      = useState(init.subfolder || null);
  const [showFolders,    setShowFolders]    = useState(false);
  const [expandedFolder, setExpandedFolder] = useState(folder);
  const [addingTag,      setAddingTag]      = useState(false);
  const [tagInput,       setTagInput]       = useState('');
  const [headingLevel,   setHeadingLevel]   = useState('');
  const [isCentered,     setIsCentered]     = useState(false);
  const [bulletMode,     setBulletMode]     = useState(false);
  const [confirmDel,     setConfirmDel]     = useState(false);
  const [showLinkInput,  setShowLinkInput]  = useState(false);
  const [linkUrl,        setLinkUrl]        = useState('');
  const [showHighlight,  setShowHighlight]  = useState(false);
  const [noteBackground, setNoteBackground] = useState(init.noteBackground || null);

  const bodyRef       = useRef(null);
  const tagInputRef   = useRef(null);
  const savedRangeRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.innerHTML = init.body || '';
  }, []);

  useEffect(() => {
    const update = () => setHeadingLevel(document.queryCommandValue('formatBlock').toLowerCase());
    document.addEventListener('selectionchange', update);
    return () => document.removeEventListener('selectionchange', update);
  }, []);

  const saveRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && bodyRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreRange = () => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const folderData    = folders?.find(f => f.name === folder);
  const subfolderData = subfolder ? (subfolders[folder] || []).find(sf => sf.name === subfolder) : null;
  const activeColor   = subfolderData?.color || folderData?.color || '#6366F1';
  const activeBg      = subfolderData?.bg    || folderData?.bg    || '#EEF2FF';
  const folderLabel   = subfolder ? `${folder} › ${subfolder}` : folder;

  // Background: use chosen note background in light mode, default card in dark mode
  const screenBg = (!dark && noteBackground) ? noteBackground : t.card;

  const save = () => {
    const now  = new Date();
    const date = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const bodyHTML = bodyRef.current?.innerHTML || '';
    const bodyText = bodyRef.current?.textContent || '';
    if (onUpdate) onUpdate({
      ...init, title, tags, author, folder, subfolder,
      body: bodyHTML, preview: bodyText.slice(0, 100),
      date, time, updatedAt: Date.now(),
      noteBackground,
      color:      folderData?.color || init.color,
      colorLight: folderData?.bg    || init.colorLight,
    });
    onBack();
  };

  const fmt = (type) => {
    const el = bodyRef.current; if (!el) return;
    if (type === 'highlight') {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      setShowHighlight(true);
      return;
    }
    el.focus();
    restoreRange();
    if (type === 'bold')   document.execCommand('bold',   false, null);
    if (type === 'italic') document.execCommand('italic', false, null);
    if (type === 'h1') {
      const cur = document.queryCommandValue('formatBlock').toLowerCase();
      if (cur === 'h1')      document.execCommand('formatBlock', false, 'h3');
      else if (cur === 'h3') document.execCommand('formatBlock', false, 'p');
      else                   document.execCommand('formatBlock', false, 'h1');
      setHeadingLevel(document.queryCommandValue('formatBlock').toLowerCase());
    }
    if (type === 'center') {
      if (isCentered) { document.execCommand('justifyLeft',   false, null); setIsCentered(false); }
      else            { document.execCommand('justifyCenter', false, null); setIsCentered(true);  }
    }
    if (type === 'bullet') { document.execCommand('insertText', false, '• '); setBulletMode(true); }
    if (type === 'link') {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      setLinkUrl('');
      setShowLinkInput(true);
    }
  };

  const applyHighlight = (color) => {
    const el = bodyRef.current; if (!el) return;
    el.focus();
    restoreRange();
    document.execCommand('backColor', false, color === 'none' ? 'transparent' : color);
    setShowHighlight(false);
  };

  const confirmLink = () => {
    const url = linkUrl.trim();
    setShowLinkInput(false); setLinkUrl('');
    if (!url) return;
    const el = bodyRef.current; if (!el) return;
    el.focus(); restoreRange();
    document.execCommand('createLink', false, url.startsWith('http') ? url : 'https://' + url);
  };

  const confirmTag = () => {
    const v = tagInput.trim();
    if (v && !tags.includes(v)) setTags(ts => [...ts, v]);
    setTagInput(''); setAddingTag(false);
  };
  const removeTag    = (tag) => setTags(ts => ts.filter(x => x !== tag));
  const openTagInput = () => { setAddingTag(true); setTimeout(() => tagInputRef.current?.focus(), 60); };

  const c = t.text2;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: screenBg, transition: 'background .3s' }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'transparent', border: 'none', padding: 0 }}>
            <svg width="8" height="14" viewBox="0 0 8 14"><path d="M7 1L1 7l6 6" stroke={t.text3} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
            <span style={{ fontSize: 15, color: t.text3, fontWeight: 400 }}>Retour</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {confirmDel ? (
              <>
                <span style={{ fontSize: 13, color: t.text2 }}>Supprimer ?</span>
                <button onClick={() => onDelete?.(init.id)} style={{ fontSize: 13, fontWeight: 700, color: '#EF4444', background: '#FEF2F2', border: 'none', padding: '4px 10px', borderRadius: 6, fontFamily: 'inherit' }}>Oui</button>
                <button onClick={() => setConfirmDel(false)} style={{ fontSize: 13, fontWeight: 600, color: t.text2, background: t.card2, border: 'none', padding: '4px 10px', borderRadius: 6, fontFamily: 'inherit' }}>Non</button>
              </>
            ) : (
              <>
                <button onClick={() => setConfirmDel(true)} style={{ background: 'transparent', border: 'none', padding: 0, lineHeight: 1 }}>
                  <span style={{ fontSize: 20, color: t.text2, fontWeight: 300, lineHeight: 1 }}>×</span>
                </button>
                <button onClick={save} style={{ background: 'transparent', border: 'none', padding: 0 }}>
                  <span style={{ fontSize: 15, color: t.text, fontWeight: 700 }}>Enregistrer</span>
                </button>
              </>
            )}
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

          <MRow label="Créé par" t={t}>
            <input
              value={author}
              onChange={e => setAuthor(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 14, color: t.text2, background: 'transparent', fontFamily: 'inherit', width: '100%' }}
            />
          </MRow>

          <MRow label="Fond" t={t}>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
              {NOTE_BACKGROUNDS.map(col => (
                <button
                  key={col}
                  onClick={() => setNoteBackground(noteBackground === col ? null : col)}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', background: col, padding: 0, cursor: 'pointer', flexShrink: 0,
                    border: noteBackground === col ? `2px solid ${t.accent}` : `2px solid transparent`,
                    outline: noteBackground === col ? `2px solid ${col}` : 'none',
                    boxSizing: 'border-box',
                  }}
                />
              ))}
              {noteBackground && (
                <button
                  onClick={() => setNoteBackground(null)}
                  style={{ width: 24, height: 24, borderRadius: '50%', background: t.card2, border: `1.5px dashed ${t.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: t.text3, cursor: 'pointer', flexShrink: 0, padding: 0 }}
                >×</button>
              )}
            </div>
          </MRow>

          <MRow label="Dossier" t={t}>
            <div style={{ flex: 1 }}>
              <div onClick={() => setShowFolders(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: activeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IcFolderN s={11} c={activeColor} filled />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{folderLabel}</span>
                <span style={{ fontSize: 11, color: t.text3, marginLeft: 2 }}>▾</span>
              </div>
              {showFolders && (
                <div style={{ marginTop: 8, borderRadius: 10, background: t.bg, overflow: 'hidden', boxShadow: t.shadow }}>
                  {folders?.map(f => {
                    const subs     = subfolders[f.name] || [];
                    const expanded = expandedFolder === f.name;
                    return (
                      <div key={f.id}>
                        <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${t.border}`, background: folder === f.name && !subfolder ? t.accentBg : 'transparent' }}>
                          <div onClick={() => { setFolder(f.name); setSubfolder(null); setShowFolders(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', flex: 1, cursor: 'pointer' }}>
                            <div style={{ width: 16, height: 16, borderRadius: 4, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <IcFolderN s={10} c={f.color} filled />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: folder === f.name && !subfolder ? t.accent : t.text }}>{f.name}</span>
                          </div>
                          {subs.length > 0 && (
                            <div onClick={() => setExpandedFolder(expanded ? null : f.name)}
                              style={{ padding: '9px 14px', cursor: 'pointer', fontSize: 12, color: t.text3 }}>
                              {expanded ? '▾' : '▸'}
                            </div>
                          )}
                        </div>
                        {expanded && subs.map(sf => (
                          <div key={sf.id} onClick={() => { setFolder(f.name); setSubfolder(sf.name); setShowFolders(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px 8px 28px', borderBottom: `1px solid ${t.border}`, cursor: 'pointer', background: folder === f.name && subfolder === sf.name ? t.accentBg : 'transparent' }}>
                            <div style={{ width: 14, height: 14, borderRadius: 3, background: sf.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <IcFolderN s={9} c={sf.color} filled />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: folder === f.name && subfolder === sf.name ? t.accent : t.text2 }}>{sf.name}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </MRow>

          <MRow label="Tags" alignTop t={t}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', paddingTop: 1 }}>
              {tags.map(tag => (
                <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, padding: '3px 8px 3px 10px', borderRadius: 20, background: dark ? `${activeColor}22` : `${activeColor}15`, color: activeColor }}>
                  {tag}
                  <button onClick={() => removeTag(tag)} style={{ background: 'transparent', border: 'none', padding: 0, lineHeight: 1, fontSize: 13, color: activeColor, display: 'flex', alignItems: 'center' }}>×</button>
                </span>
              ))}
              {addingTag ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input ref={tagInputRef} value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); confirmTag(); } if (e.key === 'Escape') { setAddingTag(false); setTagInput(''); } }}
                    placeholder="nouveau tag"
                    style={{ border: 'none', outline: 'none', fontSize: 13, color: t.text, background: 'transparent', fontFamily: 'inherit', width: 100, padding: '2px 0' }}
                  />
                  <button
                    onMouseDown={e => { e.preventDefault(); confirmTag(); }}
                    onTouchStart={e => { e.preventDefault(); confirmTag(); }}
                    style={{ fontSize: 15, color: t.accent, background: 'transparent', border: 'none', fontWeight: 700, padding: '0 4px', fontFamily: 'inherit', lineHeight: 1 }}>
                    ✓
                  </button>
                </div>
              ) : (
                <button onClick={openTagInput} style={{ width: 30, height: 30, borderRadius: 7, border: `1.5px dashed ${t.border2}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IcPlus s={13} c={t.text3} />
                </button>
              )}
            </div>
          </MRow>

          <MRow label="Modifié le" last t={t}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IcCalendar s={14} c={t.text3} />
              <span style={{ fontSize: 13.5, color: t.text2 }}>{init.date} · {init.time}</span>
            </div>
          </MRow>
        </div>

        <div
          ref={bodyRef}
          contentEditable
          suppressContentEditableWarning
          onKeyUp={saveRange}
          onClick={saveRange}
          onSelect={saveRange}
          onKeyDown={e => {
            if (e.key === 'Enter' && bulletMode) {
              e.preventDefault();
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const text = range.startContainer.textContent || '';
                const lastLine = text.slice(0, range.startOffset).split('\n').pop();
                if (lastLine === '• ' || lastLine === '•') {
                  document.execCommand('delete', false, null);
                  document.execCommand('delete', false, null);
                  setBulletMode(false);
                  return;
                }
              }
              document.execCommand('insertText', false, '\n• ');
            }
          }}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, lineHeight: 1.8, color: t.text2, fontFamily: 'inherit', background: 'transparent', minHeight: 200, paddingTop: 18, whiteSpace: 'pre-wrap', wordBreak: 'break-word', cursor: 'text' }}
        />
      </div>

      {/* Format toolbar */}
      <div style={{ flexShrink: 0, padding: '6px 16px 10px', background: screenBg, transition: 'background .3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 52, background: screenBg, borderRadius: 20, padding: '0 6px', boxShadow: t.toolbarShadow }}>

          {showHighlight ? (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', gap: 6, padding: '0 10px' }}>
              {HIGHLIGHT_COLORS.map(col => (
                <button key={col} onClick={() => applyHighlight(col)}
                  style={{ width: 26, height: 26, borderRadius: '50%', background: col, border: 'none', flexShrink: 0, cursor: 'pointer', touchAction: 'manipulation', padding: 0 }} />
              ))}
              <button onClick={() => applyHighlight('none')}
                style={{ fontSize: 11, color: t.text3, background: 'transparent', border: 'none', fontFamily: 'inherit', flexShrink: 0, touchAction: 'manipulation', whiteSpace: 'nowrap' }}>✕</button>
              <button onClick={() => setShowHighlight(false)}
                style={{ fontSize: 20, color: t.text3, background: 'transparent', border: 'none', marginLeft: 'auto', lineHeight: 1, touchAction: 'manipulation', padding: '0 2px' }}>×</button>
            </div>
          ) : showLinkInput ? (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', gap: 8, padding: '0 12px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
              <input autoFocus value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') confirmLink(); if (e.key === 'Escape') { setShowLinkInput(false); setLinkUrl(''); } }}
                placeholder="https://..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: t.text, fontFamily: 'inherit', background: 'transparent' }}
              />
              <button onMouseDown={e => { e.preventDefault(); confirmLink(); }} onTouchStart={e => { e.preventDefault(); confirmLink(); }}
                style={{ fontSize: 15, color: t.accent, background: 'transparent', border: 'none', fontWeight: 700, padding: '0 4px', fontFamily: 'inherit' }}>✓</button>
              <button onMouseDown={e => { e.preventDefault(); setShowLinkInput(false); setLinkUrl(''); }} onTouchStart={e => { e.preventDefault(); setShowLinkInput(false); setLinkUrl(''); }}
                style={{ fontSize: 18, color: t.text3, background: 'transparent', border: 'none', padding: '0 4px', fontFamily: 'inherit', lineHeight: 1 }}>×</button>
            </div>
          ) : (
            <>
              <FmtBtn onPress={() => fmt('bold')}>
                <span style={{ fontSize: 18, fontWeight: 700, color: c, fontFamily: 'Georgia,serif', letterSpacing: -.5 }}>B</span>
              </FmtBtn>

              <FmtBtn onPress={() => fmt('italic')}>
                <em style={{ fontSize: 18, color: c, fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>I</em>
              </FmtBtn>

              <FmtBtn onPress={() => fmt('h1')}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: -.3, color: (headingLevel === 'h1' || headingLevel === 'h3') ? t.accent : c }}>
                  {headingLevel === 'h1' ? 'H1' : headingLevel === 'h3' ? 'H3' : 'H'}
                </span>
              </FmtBtn>

              <FmtBtn onPress={() => fmt('center')}>
                <svg width="18" height="14" viewBox="0 0 22 18" fill="none" stroke={isCentered ? t.accent : c} strokeWidth="2" strokeLinecap="round">
                  <path d="M3 4h16M5 9h12M3 14h16" />
                </svg>
              </FmtBtn>

              <FmtBtn onPress={() => fmt('bullet')}>
                <svg width="18" height="14" viewBox="0 0 22 18" fill="none" strokeLinecap="round">
                  <circle cx="3" cy="4" r="1.5" fill={c} />
                  <circle cx="3" cy="9" r="1.5" fill={c} />
                  <circle cx="3" cy="14" r="1.5" fill={c} />
                  <line x1="7" y1="4" x2="21" y2="4" stroke={c} strokeWidth="2" />
                  <line x1="7" y1="9" x2="21" y2="9" stroke={c} strokeWidth="2" />
                  <line x1="7" y1="14" x2="21" y2="14" stroke={c} strokeWidth="2" />
                </svg>
              </FmtBtn>

              <FmtBtn onPress={() => fmt('link')}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
              </FmtBtn>

              <FmtBtn onPress={() => fmt('highlight')}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a', background: '#FEF08A', padding: '1px 5px', borderRadius: 4, lineHeight: 1.3 }}>A</span>
              </FmtBtn>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
