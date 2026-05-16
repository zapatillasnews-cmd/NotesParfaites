// notes-main.jsx — Data + App component

// ─── Sample Data ─────────────────────────────────────────────

const NOTES_DATA = [
  {
    id: 1,
    title: "Design System",
    folder: "Design",
    tags: ["Design System", "Design", "Figma"],
    preview: "Il existe de nombreux avantages à un système de design conjoint. Il profite à l'équipe design mais aussi aux équipes d'ingénierie.",
    body: "Il existe de nombreux avantages à un système de design et développement conjoint. Non seulement cela apporte des bénéfices à l'équipe design, mais cela aide aussi les équipes d'ingénierie. Il garantit que nos expériences ont un aspect et une convivialité cohérents, pas seulement dans nos specs de design, mais aussi en production.\n\nCela aide à unir toutes les équipes de l'entreprise autour de composants communs et d'un langage commun. Cela garantit que nous passons tous notre temps au bon endroit — standardiser les composants réutilisables et définir clairement les comportements signifie que les designers et les ingénieurs passent moins de temps à débattre de l'aspect et de la convivialité de chaque écran, et plus de temps à se concentrer sur les problèmes qui comptent vraiment.",
    date: "20 Déc, 2024", time: "22:30",
    pinned: true, priority: "Élevée",
    color: "#6366F1", colorLight: "#EEF2FF",
    author: "Alex Martin",
  },
  {
    id: 2,
    title: "To Do",
    folder: "Travail",
    tags: ["Tâches", "Travail"],
    preview: "Pause de 10 min · Déjeuner · Wireframe · Web design · Réunion d'équipe · Design Handoff",
    body: "• Pause de 10 minutes\n• Prendre le déjeuner\n• Créer le wireframe\n• Web design\n• Réunion d'équipe\n• Design Handoff\n• Compléter la tâche",
    date: "18 Déc, 2024", time: "14:15",
    pinned: true, priority: "Moyenne",
    color: "#10B981", colorLight: "#DCFCE7",
    author: "Alex Martin",
  },
  {
    id: 3,
    title: "Projets à venir",
    folder: "Travail",
    tags: ["Portfolio", "Web"],
    preview: "Concevoir du contenu pour le portfolio et préparer le lancement du site web.",
    body: "Concevoir du contenu incroyable pour le portfolio et préparer le lancement du site web. Planifier la stratégie de contenu et définir les livrables clés pour chaque phase du projet.",
    date: "15 Déc, 2024", time: "09:00",
    pinned: false, priority: "Faible",
    color: "#8B5CF6", colorLight: "#F5F3FF",
    author: "Alex Martin",
  },
  {
    id: 4,
    title: "Notes de réunion",
    folder: "Travail",
    tags: ["Réunion", "Travail"],
    preview: "Objectifs trimestriels et nouvelle feuille de route produit discutés en sprint planning.",
    body: "Objectifs trimestriels et nouvelle feuille de route produit discutés lors du sprint planning. Décisions clés prises par l'équipe concernant les priorités pour le prochain trimestre.",
    date: "12 Déc, 2024", time: "11:00",
    pinned: false, priority: "Moyenne",
    color: "#F59E0B", colorLight: "#FEF3C7",
    author: "Alex Martin",
  },
  {
    id: 5,
    title: "Lectures",
    folder: "Personnel",
    tags: ["Lecture", "Livres"],
    preview: "Atomic Habits · Deep Work · The Design of Everyday Things · Thinking, Fast and Slow",
    body: "• Atomic Habits — James Clear\n• Deep Work — Cal Newport\n• The Design of Everyday Things — Don Norman\n• Thinking, Fast and Slow — Daniel Kahneman\n• A Philosophy of Software Design — John Ousterhout",
    date: "10 Déc, 2024", time: "19:30",
    pinned: false, priority: "Faible",
    color: "#EC4899", colorLight: "#FDF2F8",
    author: "Alex Martin",
  },
  {
    id: 6,
    title: "Idées d'apps",
    folder: "Idées",
    tags: ["Idées", "App"],
    preview: "App de notes avec IA · Suivi fitness · Dashboard finances personnelles",
    body: "• App de notes avec intégration IA\n• Suivi fitness avec fonctions sociales\n• Dashboard de finances personnelles\n• Outil de collaboration pour équipes créatives\n• Marketplace de templates de design",
    date: "8 Déc, 2024", time: "15:45",
    pinned: false, priority: "Faible",
    color: "#14B8A6", colorLight: "#CCFBF1",
    author: "Alex Martin",
  },
];

const FOLDERS_DATA = [
  { id: 1, name: "Design",    count: 12, color: "#6366F1", bg: "#EEF2FF" },
  { id: 2, name: "Travail",   count: 8,  color: "#F59E0B", bg: "#FEF3C7" },
  { id: 3, name: "Personnel", count: 5,  color: "#10B981", bg: "#DCFCE7" },
  { id: 4, name: "Idées",     count: 3,  color: "#EC4899", bg: "#FDF2F8" },
  { id: 5, name: "Journal",   count: 7,  color: "#8B5CF6", bg: "#F5F3FF" },
  { id: 6, name: "Recherche", count: 4,  color: "#14B8A6", bg: "#CCFBF1" },
];

Object.assign(window, { NOTES_DATA, FOLDERS_DATA });

// ─── New empty note template ─────────────────────────────────

const makeNewNote = () => ({
  id: Date.now(),
  title: "Nouvelle note",
  folder: "Travail",
  tags: [],
  preview: "",
  body: "",
  date: "16 Mai, 2025",
  time: "09:00",
  pinned: false,
  priority: "Faible",
  color: "#4F46E5",
  colorLight: "#EEF2FF",
  author: "Alex Martin",
});

// ─── Root App ────────────────────────────────────────────────

const App = () => {
  const [page, setPage]               = React.useState('home');
  const [selectedNote, setSelectedNote] = React.useState(null);

  const navigate = (p) => { setPage(p); setSelectedNote(null); };

  const content = () => {
    if (selectedNote) {
      return (
        <NoteDetailPage
          note={selectedNote}
          onBack={() => setSelectedNote(null)}
        />
      );
    }
    switch (page) {
      case 'home':     return <HomePage     onNoteSelect={setSelectedNote} onNavigate={navigate} />;
      case 'notes':    return <NotesPage    onNoteSelect={setSelectedNote} onNewNote={() => setSelectedNote(makeNewNote())} />;
      case 'folders':  return <FoldersPage  onNoteSelect={setSelectedNote} />;
      case 'settings': return <SettingsPage />;
      default:         return <HomePage     onNoteSelect={setSelectedNote} onNavigate={navigate} />;
    }
  };

  return (
    <IOSDevice width={390} height={844}>
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        WebkitFontSmoothing: 'antialiased',
        background: selectedNote ? 'white' : '#F7F7F9',
      }}>
        {/* Page content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {content()}
        </div>

        {/* Bottom nav — hidden inside a note */}
        {!selectedNote && (
          <BottomNav active={page} onNavigate={navigate} />
        )}
      </div>
    </IOSDevice>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
