import { useState, useRef, useEffect } from 'react';
import { IcPlus, IcFolderN, IcCalendar } from '../icons';
import PresentationScreen from './PresentationScreen';

const NOTE_BACKGROUNDS = [
  '#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0',
  '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA',
  '#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399',
  '#FCE7F3', '#FBCFE8', '#FEE2E2', '#FECACA',
  '#FEF9C3', '#FEF08A', '#FFEDD5', '#FED7AA',
  '#EDE9FE', '#DDD6FE', '#F5F3FF', '#CCFBF1',
];

const NOTE_GRADIENTS = [
  { label: 'Ciel',    value: 'linear-gradient(160deg,#DBEAFE,#BAE6FD)' },
  { label: 'Plage',   value: 'linear-gradient(160deg,#FEF9C3,#FDBA74 55%,#BAE6FD)' },
  { label: 'Forêt',   value: 'linear-gradient(160deg,#D1FAE5,#6EE7B7 55%,#059669)' },
  { label: 'Coucher', value: 'linear-gradient(160deg,#FEE2E2,#FBCFE8 50%,#EDE9FE)' },
  { label: 'Nuit',    value: 'linear-gradient(160deg,#1E1B4B,#4338CA 55%,#6366F1)' },
  { label: 'Aurore',  value: 'linear-gradient(160deg,#FDE68A,#FCA5A5 50%,#DDD6FE)' },
  { label: 'Océan',   value: 'linear-gradient(160deg,#CFFAFE,#22D3EE 55%,#0891B2)' },
  { label: 'Menthe',  value: 'linear-gradient(160deg,#CCFBF1,#99F6E4 55%,#34D399)' },
];

const HIGHLIGHT_COLORS = [
  '#FEF08A', '#FDE047', '#FED7AA', '#FDBA74',
  '#FCA5A5', '#F87171', '#FBCFE8', '#F9A8D4',
  '#BBF7D0', '#86EFAC', '#99F6E4', '#5EEAD4',
  '#BAE6FD', '#7DD3FC', '#DDD6FE', '#C4B5FD',
  '#D4A96A', '#C08B5C', '#A0785A', '#F5DEB3',
  '#E5E7EB', '#D1D5DB', '#FFF9C4', '#B2EBF2',
];

function getSceneUri(bg) {
  const grad = NOTE_GRADIENTS.find(g => g.value === bg);
  if (!grad) return null;
  const enc = c => `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">' + c + '</svg>')}")`;
  switch (grad.label) {
    case 'Ciel':    return enc('<g opacity=".5" fill="white"><ellipse cx="90" cy="145" rx="55" ry="27"/><ellipse cx="58" cy="155" rx="32" ry="21"/><ellipse cx="125" cy="152" rx="38" ry="23"/><ellipse cx="150" cy="163" rx="25" ry="16"/></g><g opacity=".36" fill="white"><ellipse cx="298" cy="92" rx="46" ry="22"/><ellipse cx="270" cy="100" rx="28" ry="18"/><ellipse cx="330" cy="99" rx="32" ry="20"/></g><g stroke="#60A5FA" fill="none" stroke-width="2" stroke-linecap="round"><path d="M158 220 Q168 208 178 220"/><path d="M195 202 Q207 188 219 202"/><path d="M240 230 Q249 220 258 230"/><path d="M275 198 Q282 191 289 198" stroke-width="1.5" stroke="#93C5FD"/></g>');
    case 'Plage':   return enc('<circle cx="325" cy="105" r="52" fill="#FEF08A" opacity=".45"/><circle cx="325" cy="105" r="35" fill="#FDE047" opacity=".35"/><path d="M0 732 Q98 710 196 728 Q294 746 390 718 L390 844 L0 844 Z" fill="#FDBA74" opacity=".32"/><path d="M0 764 Q130 748 260 762 Q325 770 390 755 L390 844 L0 844 Z" fill="#FED7AA" opacity=".28"/><line x1="128" y1="685" x2="150" y2="795" stroke="#92400E" stroke-width="3" stroke-linecap="round"/><path d="M83 680 Q128 638 173 680 Z" fill="#EF4444" opacity=".8"/><line x1="83" y1="680" x2="128" y2="638" stroke="#B91C1C" stroke-width="1.2" opacity=".7"/><line x1="128" y1="638" x2="173" y2="680" stroke="#B91C1C" stroke-width="1.2" opacity=".7"/><path d="M258 745 L266 792 L298 792 L306 745 Z" fill="rgba(186,230,253,.6)" stroke="#7DD3FC" stroke-width="1.5"/><circle cx="282" cy="742" r="17" fill="#FDE047" stroke="#EAB308" stroke-width="1.5"/><line x1="282" y1="725" x2="282" y2="759" stroke="#EAB308" stroke-width="1"/><line x1="265" y1="742" x2="299" y2="742" stroke="#EAB308" stroke-width="1"/><line x1="292" y1="740" x2="310" y2="717" stroke="#F472B6" stroke-width="2.5" stroke-linecap="round"/>');
    case 'Forêt':   return enc('<circle cx="195" cy="85" r="48" fill="#A7F3D0" opacity=".22"/><g fill="#065F46" opacity=".42"><polygon points="25,792 58,705 91,792"/><rect x="50" y="792" width="8" height="34"/><polygon points="62,788 98,712 134,788"/><rect x="90" y="788" width="8" height="34"/><polygon points="0,800 25,748 50,800"/></g><g fill="#065F46" opacity=".35"><polygon points="305,785 338,705 371,785"/><rect x="330" y="785" width="8" height="35"/><polygon points="342,798 366,730 390,798"/><polygon points="278,800 298,752 318,800"/></g><g fill="#34D399" opacity=".2"><ellipse cx="345" cy="92" rx="22" ry="52" transform="rotate(-24 345 92)"/><ellipse cx="368" cy="115" rx="18" ry="42" transform="rotate(18 368 115)"/><ellipse cx="320" cy="120" rx="16" ry="38" transform="rotate(-44 320 120)"/></g>');
    case 'Coucher': return enc('<g fill="#C4B5FD" opacity=".5"><circle cx="55" cy="72" r="2"/><circle cx="112" cy="48" r="2.5"/><circle cx="198" cy="60" r="1.8"/><circle cx="265" cy="42" r="2"/><circle cx="335" cy="70" r="2"/><circle cx="308" cy="108" r="1.5"/><circle cx="168" cy="36" r="1.8"/><circle cx="80" cy="115" r="1.5"/></g><circle cx="195" cy="815" r="105" fill="#FBBF24" opacity=".2"/><circle cx="195" cy="815" r="68" fill="#F97316" opacity=".16"/><path d="M0 778 Q75 728 158 758 Q238 788 320 742 Q360 720 390 748 L390 844 L0 844 Z" fill="#EDE9FE" opacity=".42"/><path d="M0 808 Q100 782 200 798 Q300 814 390 792 L390 844 L0 844 Z" fill="#DDD6FE" opacity=".38"/>');
    case 'Nuit':    return enc('<circle cx="308" cy="95" r="42" fill="#FDE68A" opacity=".55"/><circle cx="328" cy="80" r="36" fill="#1E1B4B" opacity=".92"/><g fill="white"><circle cx="38" cy="58" r="1.8" opacity=".85"/><circle cx="78" cy="38" r="2.2" opacity=".9"/><circle cx="132" cy="78" r="1.5" opacity=".78"/><circle cx="168" cy="28" r="2" opacity=".88"/><circle cx="215" cy="58" r="1.2" opacity=".65"/><circle cx="252" cy="42" r="2" opacity=".9"/><circle cx="48" cy="135" r="1.5" opacity=".58"/><circle cx="98" cy="152" r="1.8" opacity=".72"/><circle cx="162" cy="118" r="1.2" opacity=".62"/><circle cx="228" cy="138" r="1.5" opacity=".8"/><circle cx="355" cy="48" r="1.8" opacity=".72"/><circle cx="18" cy="198" r="1.5" opacity=".6"/><path d="M168 28 l1.6 4.4 4.6 0 -3.7 2.8 1.4 4.4 -3.9 -2.8 -3.9 2.8 1.4 -4.4 -3.7 -2.8 4.6 0 Z"/></g><line x1="55" y1="260" x2="140" y2="300" stroke="white" stroke-width="1.2" opacity=".28" stroke-linecap="round"/>');
    case 'Aurore':  return enc('<circle cx="62" cy="85" r="58" fill="#FDE68A" opacity=".28"/><circle cx="62" cy="85" r="40" fill="#FDE047" opacity=".22"/><g stroke="#FDE047" stroke-width="2.5" opacity=".18" stroke-linecap="round"><line x1="62" y1="12" x2="62" y2="28"/><line x1="112" y1="35" x2="100" y2="47"/><line x1="128" y1="85" x2="112" y2="85"/><line x1="110" y1="133" x2="98" y2="121"/><line x1="14" y1="35" x2="26" y2="47"/><line x1="0" y1="85" x2="16" y2="85"/></g><path d="M-60 210 Q195 95 450 188" stroke="#FCA5A5" stroke-width="48" fill="none" opacity=".1" stroke-linecap="round"/><path d="M-60 255 Q195 148 450 232" stroke="#DDD6FE" stroke-width="34" fill="none" opacity=".12" stroke-linecap="round"/><path d="M-60 298 Q195 198 450 275" stroke="#FDE68A" stroke-width="22" fill="none" opacity=".1" stroke-linecap="round"/>');
    case 'Océan':   return enc('<g transform="translate(290,128) rotate(-12)"><ellipse cx="0" cy="0" rx="24" ry="10" fill="#67E8F9" opacity=".28"/><polygon points="24,0 38,-9 38,9" fill="#22D3EE" opacity=".22"/><circle cx="-10" cy="-2" r="2.5" fill="#0891B2" opacity=".25"/></g><g transform="translate(85,188) rotate(12)"><ellipse cx="0" cy="0" rx="17" ry="7.5" fill="#A5F3FC" opacity=".22"/><polygon points="17,0 28,-7 28,7" fill="#22D3EE" opacity=".18"/><circle cx="-7" cy="-1" r="2" fill="#0891B2" opacity=".22"/></g><g stroke="white" fill="none" stroke-linecap="round"><path d="M0 718 Q49 702 98 718 Q147 734 196 718 Q245 702 294 718 Q343 734 390 718" stroke-width="2.5" opacity=".32"/><path d="M0 752 Q65 736 130 752 Q196 768 262 752 Q326 736 390 752" stroke-width="2.2" opacity=".28"/><path d="M0 784 Q82 768 164 784 Q246 800 328 784 L390 782" stroke-width="1.8" opacity=".22"/></g><path d="M0 735 Q98 718 196 735 Q294 752 390 735 L390 844 L0 844 Z" fill="#0891B2" opacity=".18"/><g fill="white" opacity=".35"><circle cx="58" cy="698" r="4.5"/><circle cx="162" cy="712" r="3.5"/><circle cx="278" cy="697" r="4.5"/><circle cx="342" cy="708" r="3"/></g>');
    case 'Menthe':  return enc('<g fill="#059669" opacity=".3"><ellipse cx="338" cy="82" rx="21" ry="48" transform="rotate(-22 338 82)"/><ellipse cx="362" cy="105" rx="18" ry="42" transform="rotate(16 362 105)"/><ellipse cx="315" cy="115" rx="16" ry="37" transform="rotate(-44 315 115)"/><ellipse cx="352" cy="145" rx="14" ry="33" transform="rotate(32 352 145)"/></g><path d="M338 165 Q344 205 336 258" stroke="#059669" stroke-width="2.5" fill="none" opacity=".2" stroke-linecap="round"/><g fill="#34D399" opacity=".22"><ellipse cx="48" cy="755" rx="19" ry="43" transform="rotate(28 48 755)"/><ellipse cx="23" cy="735" rx="16" ry="36" transform="rotate(-12 23 735)"/><ellipse cx="72" cy="778" rx="14" ry="30" transform="rotate(52 72 778)"/></g><path d="M45 720 Q40 680 48 640" stroke="#34D399" stroke-width="2" fill="none" opacity=".18" stroke-linecap="round"/><g fill="#6EE7B7" opacity=".35"><circle cx="105" cy="148" r="3.5"/><circle cx="292" cy="305" r="3"/><circle cx="52" cy="408" r="2.5"/><circle cx="348" cy="502" r="3.5"/></g>');
    default: return null;
  }
}

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
  const [showBgPicker,   setShowBgPicker]   = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);

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

  useEffect(() => {
    if (dark || !noteBackground) return;
    const color = noteBackground.match(/#[0-9A-Fa-f]{6}/)?.[0] || '#F4F4F4';
    document.body.style.background = color;
    return () => { document.body.style.background = '#F4F4F4'; };
  }, [noteBackground, dark]);

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

  const screenBg = (!dark && noteBackground) ? noteBackground : t.card;
  const sceneUri = (!dark && noteBackground) ? getSceneUri(noteBackground) : null;
  const isGrad   = noteBackground?.startsWith('linear');
  const rootBg   = sceneUri
    ? (isGrad
        ? { backgroundImage: sceneUri + ', ' + noteBackground, backgroundSize: 'cover, cover', backgroundRepeat: 'no-repeat, no-repeat' }
        : { backgroundColor: noteBackground, backgroundImage: sceneUri, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' })
    : { background: screenBg };

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

  const currentNote = { ...init, title, body: bodyRef.current?.innerHTML || init.body };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', ...rootBg, transition: 'background .3s' }}>

      {/* Header */}
      <div style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)', paddingLeft: '20px', paddingRight: '20px', paddingBottom: 0, flexShrink: 0 }}>
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
                <button onClick={() => setShowPresentation(true)} style={{ background: 'transparent', border: 'none', padding: 0 }}>
                  <span style={{ fontSize: 16, color: t.text3 }}>▶</span>
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

          {/* Background color picker */}
          <MRow label="Fond" t={t}>
            <div style={{ flex: 1 }}>
              <div onClick={() => setShowBgPicker(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: noteBackground || '#FFFFFF',
                  border: `1.5px solid ${t.border2}`,
                }} />
                <span style={{ fontSize: 14, color: t.text2 }}>{noteBackground ? 'Personnalisé' : 'Aucun'}</span>
                <span style={{ fontSize: 11, color: t.text3, marginLeft: 2 }}>▾</span>
                {noteBackground && (
                  <button
                    onClick={e => { e.stopPropagation(); setNoteBackground(null); setShowBgPicker(false); }}
                    style={{ marginLeft: 4, background: 'transparent', border: 'none', fontSize: 16, color: t.text3, lineHeight: 1, padding: '0 2px', fontFamily: 'inherit' }}
                  >×</button>
                )}
              </div>

              {showBgPicker && (
                <div style={{ marginTop: 10, padding: 12, borderRadius: 14, background: t.bg, boxShadow: t.shadow }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                    {NOTE_BACKGROUNDS.map(col => (
                      <button
                        key={col}
                        onClick={() => { setNoteBackground(col === '#FFFFFF' && !noteBackground ? null : col); setShowBgPicker(false); }}
                        style={{
                          width: 32, height: 32, borderRadius: 8, background: col, padding: 0, cursor: 'pointer', border: 'none',
                          outline: noteBackground === col ? `2.5px solid ${t.accent}` : `1.5px solid ${t.border}`,
                          outlineOffset: '1px', boxSizing: 'border-box',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ marginTop: 12, borderTop: `1px solid ${t.border}`, paddingTop: 10 }}>
                    <span style={{ fontSize: 11, color: t.text3, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Scènes</span>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      {NOTE_GRADIENTS.map(g => (
                        <div key={g.value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                          <button
                            onClick={() => { setNoteBackground(g.value); setShowBgPicker(false); }}
                            style={{
                              width: 48, height: 28, borderRadius: 6, background: g.value, padding: 0, cursor: 'pointer', border: 'none',
                              outline: noteBackground === g.value ? `2.5px solid ${t.accent}` : `1.5px solid ${t.border}`,
                              outlineOffset: '1px', boxSizing: 'border-box',
                            }}
                          />
                          <span style={{ fontSize: 9, color: t.text3, whiteSpace: 'nowrap' }}>{g.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', padding: '0 6px', gap: 6 }}>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', flex: 1, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', padding: '0 2px' }}>
                {HIGHLIGHT_COLORS.map(col => (
                  <button key={col} onClick={() => applyHighlight(col)}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: col, border: 'none', flexShrink: 0, cursor: 'pointer', touchAction: 'manipulation', padding: 0 }} />
                ))}
                <button onClick={() => applyHighlight('none')}
                  style={{ flexShrink: 0, fontSize: 11, color: t.text3, background: t.card2, border: 'none', borderRadius: 20, padding: '4px 10px', fontFamily: 'inherit', whiteSpace: 'nowrap', touchAction: 'manipulation' }}>
                  Effacer
                </button>
              </div>
              <button onClick={() => setShowHighlight(false)}
                style={{ flexShrink: 0, fontSize: 20, color: t.text3, background: 'transparent', border: 'none', lineHeight: 1, touchAction: 'manipulation', padding: '0 4px' }}>×</button>
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

      {showPresentation && (
        <PresentationScreen note={currentNote} onClose={() => setShowPresentation(false)} dark={dark} />
      )}
    </div>
  );
}
