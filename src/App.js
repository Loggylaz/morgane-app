import { useState, useEffect, useRef, useMemo } from "react";

// ─── Constants & Data ───────────────────────────────────────────────────────
const ACTIVITIES = [
  { id: "sport", emoji: "🏋️", label: "Sport", color: "#FF6B6B" },
  { id: "reading", emoji: "📖", label: "Lecture", color: "#845EC2" },
  { id: "writing", emoji: "✍️", label: "Écriture", color: "#6C5CE7" },
  { id: "meditation", emoji: "🧘", label: "Méditation", color: "#00C9A7" },
  { id: "cooking", emoji: "🍳", label: "Cuisine", color: "#FFC75F" },
  { id: "music", emoji: "🎵", label: "Musique", color: "#FF9671" },
  { id: "study", emoji: "📝", label: "Étude", color: "#0089BA" },
  { id: "art", emoji: "🎨", label: "Art", color: "#D65DB1" },
  { id: "walk", emoji: "🚶‍♀️", label: "Marche", color: "#2C73D2" },
  { id: "cleaning", emoji: "🧹", label: "Ménage", color: "#FF6F91" },
  { id: "gaming", emoji: "🎮", label: "Jeux", color: "#4B4453" },
  { id: "yoga", emoji: "🧘‍♀️", label: "Yoga", color: "#00C9A7" },
  { id: "work", emoji: "💻", label: "Travail", color: "#008E9B" },
];

const FUN_FACTS = [
  "💡 Le saviez-vous ? Le cœur humain bat environ 100 000 fois par jour !",
  "🌍 Le saviez-vous ? La Terre tourne à environ 1 670 km/h à l'équateur.",
  "🧠 Le saviez-vous ? Votre cerveau utilise environ 20% de l'énergie totale de votre corps.",
  "🌊 Le saviez-vous ? L'océan contient environ 20 millions de tonnes d'or.",
  "🦋 Le saviez-vous ? Les papillons goûtent avec leurs pieds !",
  "🌙 Le saviez-vous ? La Lune s'éloigne de la Terre de 3,8 cm chaque année.",
  "🐙 Le saviez-vous ? Les pieuvres ont trois cœurs et le sang bleu.",
  "🌳 Le saviez-vous ? Les arbres communiquent entre eux via un réseau de champignons souterrains.",
  "⚡ Le saviez-vous ? La foudre est 5 fois plus chaude que la surface du Soleil.",
  "🍯 Le saviez-vous ? Le miel ne se périme jamais. On en a retrouvé dans des tombes égyptiennes, encore comestible !",
  "🐋 Le saviez-vous ? Le chant de la baleine bleue peut être entendu à 800 km de distance.",
  "🌸 Le saviez-vous ? Les tournesols suivent le mouvement du soleil, un phénomène appelé héliotropisme.",
  "🦈 Le saviez-vous ? Les requins existent depuis plus longtemps que les arbres (400 millions d'années) !",
  "🧬 Le saviez-vous ? L'ADN humain est identique à 60% à celui d'une banane.",
  "🌈 Le saviez-vous ? Il pleut des diamants sur Jupiter et Saturne.",
  "📚 Le saviez-vous ? Lire 6 minutes par jour réduit le stress de 68%.",
  "🏃 Le saviez-vous ? L'exercice physique stimule la production de BDNF, une protéine qui favorise la croissance des neurones.",
  "💧 Le saviez-vous ? L'eau représente environ 60% du poids corporel adulte.",
  "😴 Le saviez-vous ? Pendant le sommeil, le cerveau élimine les toxines accumulées pendant la journée.",
  "🎵 Le saviez-vous ? Écouter de la musique libère de la dopamine, le même neurotransmetteur activé par la nourriture.",
  "🦑 Le saviez-vous ? Le calmar colossal a les plus grands yeux du règne animal : 27 cm de diamètre !",
  "🏔️ Le saviez-vous ? Le mont Everest grandit d'environ 4 mm par an à cause de la tectonique des plaques.",
  "🐝 Le saviez-vous ? Pour produire 1 kg de miel, les abeilles doivent visiter environ 4 millions de fleurs.",
  "🌕 Le saviez-vous ? On voit toujours la même face de la Lune car elle tourne sur elle-même en même temps qu'autour de la Terre.",
  "🧊 Le saviez-vous ? L'eau chaude gèle plus vite que l'eau froide (effet Mpemba) !",
  "🎹 Le saviez-vous ? Mozart a composé sa première symphonie à l'âge de 8 ans.",
  "🌻 Le saviez-vous ? Les graines de tournesol suivent un motif en spirale basé sur la suite de Fibonacci.",
  "🐈 Le saviez-vous ? Les chats passent environ 70% de leur vie à dormir.",
  "🔬 Le saviez-vous ? Il y a plus de bactéries dans votre corps que de cellules humaines.",
  "✨ Le saviez-vous ? Nous sommes littéralement faits de poussière d'étoiles — les atomes de notre corps ont été forgés dans des étoiles.",
];

const WATER_GOAL = 2000;
const WATER_STEP = 250;

const ACTIVITY_BADGE_TIERS = [
  { minutes: 30, tier: "Bois", tierEmoji: "🪵" },
  { minutes: 60, tier: "Bronze", tierEmoji: "🥉" },
  { minutes: 120, tier: "Argent", tierEmoji: "🥈" },
  { minutes: 300, tier: "Or", tierEmoji: "🥇" },
  { minutes: 600, tier: "Diamant", tierEmoji: "💎" },
  { minutes: 1200, tier: "Légende", tierEmoji: "👑" },
];

const ACTIVITY_BADGE_NAMES = {
  sport: { name: "Warrior", emoji: "💪" },
  reading: { name: "Rat de bibliothèque", emoji: "📖" },
  writing: { name: "Plume d'or", emoji: "✍️" },
  meditation: { name: "Zen Master", emoji: "🧘" },
  cooking: { name: "Chef Morgane", emoji: "👩‍🍳" },
  music: { name: "Mélomane", emoji: "🎶" },
  study: { name: "Érudite", emoji: "🎓" },
  art: { name: "Artiste", emoji: "🖌️" },
  walk: { name: "Exploratrice", emoji: "🌿" },
  cleaning: { name: "Marie Kondo", emoji: "✨" },
  gaming: { name: "Gameuse", emoji: "🕹️" },
  yoga: { name: "Yogi", emoji: "🧘‍♀️" },
  work: { name: "Boss Lady", emoji: "👩‍💼" },
};

const generateActivityBadges = () => {
  const badges = [];
  Object.entries(ACTIVITY_BADGE_NAMES).forEach(([actId, info]) => {
    ACTIVITY_BADGE_TIERS.forEach(tier => {
      const act = ACTIVITIES.find(a => a.id === actId);
      badges.push({
        id: `${actId}_${tier.minutes}m`,
        emoji: info.emoji,
        title: `${info.name} ${tier.tierEmoji}`,
        desc: `${tier.tier} — ${tier.minutes >= 60 ? `${Math.floor(tier.minutes / 60)}h` : `${tier.minutes}min`} de ${act?.label?.toLowerCase() || actId}`,
        condition: (s) => (s[actId] || 0) >= tier.minutes * 60,
        tier: tier.tier, tierEmoji: tier.tierEmoji, actId,
      });
    });
  });
  return badges;
};

const SPECIAL_BADGES = [
  { id: "water_3d", emoji: "💧", title: "Hydratée", desc: "Objectif eau 3 jours consécutifs", condition: (s) => getWaterStreak(s.waterGoalDates || []) >= 3, tier: "Bronze", tierEmoji: "🥉" },
  { id: "water_7d", emoji: "💧", title: "Hydra Queen", desc: "Objectif eau 7 jours consécutifs", condition: (s) => getWaterStreak(s.waterGoalDates || []) >= 7, tier: "Argent", tierEmoji: "🥈" },
  { id: "water_30d", emoji: "💧", title: "Aqua Goddess", desc: "Objectif eau 30 jours consécutifs", condition: (s) => getWaterStreak(s.waterGoalDates || []) >= 30, tier: "Or", tierEmoji: "🥇" },
  { id: "tasks_10", emoji: "✅", title: "Productrice", desc: "10 tâches complétées", condition: (s) => (s.tasksCompleted || 0) >= 10, tier: "Bronze", tierEmoji: "🥉" },
  { id: "tasks_50", emoji: "✅", title: "Machine", desc: "50 tâches complétées", condition: (s) => (s.tasksCompleted || 0) >= 50, tier: "Argent", tierEmoji: "🥈" },
  { id: "tasks_100", emoji: "✅", title: "Superstar", desc: "100 tâches complétées", condition: (s) => (s.tasksCompleted || 0) >= 100, tier: "Or", tierEmoji: "🥇" },
  { id: "tasks_500", emoji: "✅", title: "Inarrêtable", desc: "500 tâches complétées", condition: (s) => (s.tasksCompleted || 0) >= 500, tier: "Diamant", tierEmoji: "💎" },
  { id: "streak_3", emoji: "🔥", title: "On Fire!", desc: "3 jours consécutifs", condition: (s) => (s.streak || 0) >= 3, tier: "Bronze", tierEmoji: "🥉" },
  { id: "streak_7", emoji: "🔥", title: "Unstoppable", desc: "7 jours consécutifs", condition: (s) => (s.streak || 0) >= 7, tier: "Argent", tierEmoji: "🥈" },
  { id: "streak_14", emoji: "🔥", title: "Infernale", desc: "14 jours consécutifs", condition: (s) => (s.streak || 0) >= 14, tier: "Or", tierEmoji: "🥇" },
  { id: "streak_30", emoji: "🔥", title: "Phénix", desc: "30 jours consécutifs", condition: (s) => (s.streak || 0) >= 30, tier: "Diamant", tierEmoji: "💎" },
  { id: "all_meds_7", emoji: "💊", title: "Responsable", desc: "7j de médocs sans oubli", condition: (s) => (s.medStreak || 0) >= 7, tier: "Bronze", tierEmoji: "🥉" },
  { id: "all_meds_30", emoji: "💊", title: "Disciplinée", desc: "30j de médocs sans oubli", condition: (s) => (s.medStreak || 0) >= 30, tier: "Argent", tierEmoji: "🥈" },
  { id: "all_meds_90", emoji: "💊", title: "Irréprochable", desc: "90j de médocs sans oubli", condition: (s) => (s.medStreak || 0) >= 90, tier: "Or", tierEmoji: "🥇" },
  { id: "early_bird_5", emoji: "🌅", title: "Lève-tôt", desc: "Médocs matin avant 8h ×5", condition: (s) => (s.earlyMeds || 0) >= 5, tier: "Bronze", tierEmoji: "🥉" },
  { id: "early_bird_30", emoji: "🌅", title: "Aurore", desc: "Médocs matin avant 8h ×30", condition: (s) => (s.earlyMeds || 0) >= 30, tier: "Argent", tierEmoji: "🥈" },
  { id: "first_timer", emoji: "🎬", title: "C'est parti !", desc: "Première session chrono", condition: (s) => (s.totalSessions || 0) >= 1, tier: "Spécial", tierEmoji: "⭐" },
  { id: "sessions_25", emoji: "🎯", title: "Régulière", desc: "25 sessions chrono", condition: (s) => (s.totalSessions || 0) >= 25, tier: "Bronze", tierEmoji: "🥉" },
  { id: "sessions_100", emoji: "🎯", title: "Habituée", desc: "100 sessions chrono", condition: (s) => (s.totalSessions || 0) >= 100, tier: "Argent", tierEmoji: "🥈" },
  { id: "variety_3", emoji: "🌈", title: "Polyvalente", desc: "3 activités différentes", condition: (s) => (s.uniqueActivities || 0) >= 3, tier: "Bronze", tierEmoji: "🥉" },
  { id: "variety_6", emoji: "🌈", title: "Touche-à-tout", desc: "6 activités différentes", condition: (s) => (s.uniqueActivities || 0) >= 6, tier: "Argent", tierEmoji: "🥈" },
  { id: "variety_10", emoji: "🌈", title: "Renaissance", desc: "10 activités différentes", condition: (s) => (s.uniqueActivities || 0) >= 10, tier: "Or", tierEmoji: "🥇" },
  { id: "total_10h", emoji: "⏳", title: "Déterminée", desc: "10h d'activité totale", condition: (s) => (s.totalTime || 0) >= 36000, tier: "Bronze", tierEmoji: "🥉" },
  { id: "total_50h", emoji: "⏳", title: "Acharnée", desc: "50h d'activité totale", condition: (s) => (s.totalTime || 0) >= 180000, tier: "Argent", tierEmoji: "🥈" },
  { id: "total_100h", emoji: "⏳", title: "Centurion", desc: "100h d'activité totale", condition: (s) => (s.totalTime || 0) >= 360000, tier: "Or", tierEmoji: "🥇" },
  { id: "total_500h", emoji: "⏳", title: "Titan", desc: "500h d'activité totale", condition: (s) => (s.totalTime || 0) >= 1800000, tier: "Diamant", tierEmoji: "💎" },
];

const ALL_BADGES = [...generateActivityBadges(), ...SPECIAL_BADGES];

const MOTIVATIONAL_MESSAGES = [
  "Tu gères, Morgane ! 🌟", "Chaque petit pas compte ! 🦶", "Tu es incroyable ! 💖",
  "Continue comme ça ! 🚀", "Fière de toi ! 🎉", "Tu es sur la bonne voie ! 🌈",
  "Rien ne t'arrête ! 💪", "Bravo pour ta persévérance ! 🏅", "Tu brilles aujourd'hui ! ✨",
  "Le monde a de la chance de t'avoir ! 🌍", "Ta détermination est inspirante ! 🔥",
  "Chaque effort te rapproche de tes rêves ! 🌙",
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const getToday = () => new Date().toISOString().split("T")[0];
const getTomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; };

// Returns the longest consecutive-day streak from an array of date strings "YYYY-MM-DD"
const getWaterStreak = (goalDates) => {
  if (!goalDates || goalDates.length === 0) return 0;
  const unique = [...new Set(goalDates)].sort();
  let maxStreak = 1, cur = 1;
  for (let i = 1; i < unique.length; i++) {
    const diff = Math.round((new Date(unique[i]) - new Date(unique[i - 1])) / 86400000);
    if (diff === 1) { cur++; if (cur > maxStreak) maxStreak = cur; }
    else if (diff > 1) cur = 1;
  }
  return maxStreak;
};
const formatTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};
const formatDuration = (totalSec) => {
  if (!totalSec || totalSec <= 0) return "0min";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h === 0) return `${m}min`;
  return `${h}h${m.toString().padStart(2, "0")}`;
};
const load = (key, fb) => { try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fb; } catch { return fb; } };
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y, m) => (new Date(y, m, 1).getDay() + 6) % 7;

const scheduleNotification = (title, body, delayMs) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  setTimeout(() => { try { new Notification(title, { body }); } catch {} }, Math.max(0, delayMs));
};

// ─── Sub-components ─────────────────────────────────────────────────────────
const BubbleBackground = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
    {[...Array(8)].map((_, i) => (
      <div key={i} style={{
        position: "absolute", borderRadius: "50%",
        background: [
          "radial-gradient(circle, rgba(255,154,158,0.15), transparent)",
          "radial-gradient(circle, rgba(168,130,255,0.12), transparent)",
          "radial-gradient(circle, rgba(0,201,167,0.1), transparent)",
          "radial-gradient(circle, rgba(255,199,95,0.12), transparent)",
          "radial-gradient(circle, rgba(132,94,194,0.1), transparent)",
          "radial-gradient(circle, rgba(255,107,107,0.08), transparent)",
          "radial-gradient(circle, rgba(0,137,186,0.1), transparent)",
          "radial-gradient(circle, rgba(214,93,177,0.1), transparent)",
        ][i],
        width: `${120 + i * 60}px`, height: `${120 + i * 60}px`,
        left: `${(i * 13 + 5) % 80}%`, top: `${(i * 17 + 10) % 70}%`,
        animation: `float${i % 3} ${15 + i * 3}s ease-in-out infinite`,
        animationDelay: `${i * -2}s`,
      }} />
    ))}
    <style>{`
      @keyframes float0 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.1)} }
      @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,30px) scale(0.9)} }
      @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,20px) scale(1.05)} 66%{transform:translate(-15px,-10px) scale(0.95)} }
    `}</style>
  </div>
);

const NavButton = ({ icon, label, active, onClick, badge }) => (
  <button onClick={onClick} style={{
    display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
    background: active ? "rgba(132,94,194,0.15)" : "transparent",
    border: "none", borderRadius: "12px", padding: "6px 10px", cursor: "pointer",
    color: active ? "#845EC2" : "#8E8EA0", fontSize: "20px", transition: "all 0.2s",
    minWidth: "52px", position: "relative",
  }}>
    <span>{icon}</span>
    <span style={{ fontSize: "9px", fontWeight: active ? 700 : 500, letterSpacing: "0.02em" }}>{label}</span>
    {badge && <span style={{
      position: "absolute", top: "1px", right: "2px", background: "#FF6B6B",
      color: "#FFF", fontSize: "8px", fontWeight: 700, borderRadius: "6px",
      padding: "1px 4px", minWidth: "14px", textAlign: "center", lineHeight: "14px",
    }}>{badge}</span>}
  </button>
);

const BadgePopup = ({ badge, onClose }) => {
  if (!badge) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center",
      justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
      animation: "fadeIn 0.3s ease",
    }} onClick={onClose}>
      <div style={{
        background: "linear-gradient(135deg, #FFF5F5, #FFF0F6, #F0F0FF)", borderRadius: "28px",
        padding: "36px 32px", textAlign: "center", maxWidth: "300px", width: "90%",
        boxShadow: "0 20px 60px rgba(132,94,194,0.3)", animation: "popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: "60px", marginBottom: "4px", animation: "bounce 0.6s ease infinite alternate" }}>{badge.emoji}</div>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>{badge.tierEmoji}</div>
        <h2 style={{ fontFamily: "'Quicksand', sans-serif", color: "#845EC2", fontSize: "20px", margin: "0 0 4px" }}>🎉 Badge débloqué !</h2>
        <h3 style={{ fontFamily: "'Quicksand', sans-serif", color: "#4B4453", fontSize: "17px", margin: "0 0 4px" }}>{badge.title}</h3>
        <p style={{ color: "#8E8EA0", fontSize: "13px", margin: "0 0 18px" }}>{badge.desc}</p>
        <button onClick={onClose} style={{
          background: "linear-gradient(135deg, #845EC2, #D65DB1)", color: "#FFF",
          border: "none", borderRadius: "14px", padding: "12px 32px", fontSize: "15px",
          fontWeight: 700, cursor: "pointer", fontFamily: "'Quicksand', sans-serif",
        }}>Merci ! 💖</button>
      </div>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes bounce { from{transform:translateY(0)} to{transform:translateY(-10px)} }
      `}</style>
    </div>
  );
};

const Card = ({ children, style }) => (
  <div style={{
    background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)",
    borderRadius: "20px", padding: "18px", marginBottom: "14px",
    border: "1px solid rgba(132,94,194,0.08)", ...style,
  }}>{children}</div>
);
const CardTitle = ({ children, color = "#845EC2", right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
    <h3 style={{ margin: 0, color, fontSize: "15px", fontWeight: 700 }}>{children}</h3>
    {right && <span style={{ fontSize: "12px", color: "#8E8EA0", fontWeight: 600 }}>{right}</span>}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
export default function MorganeApp() {
  const [tab, setTab] = useState("home");
  const [tasks, setTasks] = useState(() => load("mg_tasks", []));
  const [meds, setMeds] = useState(() => load("mg_meds", { morning: false, evening: false, date: getToday() }));
  const [water, setWater] = useState(() => load("mg_water", { amount: 0, date: getToday() }));
  const [timerActivity, setTimerActivity] = useState(() => load("mg_timer_activity", null));
  const [timerSeconds, setTimerSeconds] = useState(() => load("mg_timer_seconds", 0));
  const [timerRunning, setTimerRunning] = useState(() => load("mg_timer_running", false));
  const [timerStartedAt, setTimerStartedAt] = useState(() => load("mg_timer_started_at", null));
  const [stats, setStats] = useState(() => load("mg_stats", {}));
  const [badges, setBadges] = useState(() => load("mg_badges", []));
  const [newBadge, setNewBadge] = useState(null);
  const [funFact, setFunFact] = useState(() => {
    const saved = load("mg_funfact", null);
    if (saved && saved.date === getToday()) return saved.fact;
    const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    save("mg_funfact", { fact, date: getToday() });
    return fact;
  });

  // Load extended fun-facts from JSON (replaces hardcoded list if today's fact not yet set)
  useEffect(() => {
    const saved = load("mg_funfact", null);
    if (saved && saved.date === getToday()) return;
    fetch("/fun-facts.json")
      .then(r => r.json())
      .then(facts => {
        if (!Array.isArray(facts) || facts.length === 0) return;
        const fact = facts[Math.floor(Math.random() * facts.length)];
        setFunFact(fact);
        save("mg_funfact", { fact, date: getToday() });
      })
      .catch(() => {});
  }, []);
  const [newTask, setNewTask] = useState("");
  const [taskFor, setTaskFor] = useState("today");
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calEvents, setCalEvents] = useState(() => load("mg_cal_events", {}));
  const [showEventModal, setShowEventModal] = useState(null);
  const [eventInput, setEventInput] = useState("");
  const [eventTimeInput, setEventTimeInput] = useState("09:00");
  const [scheduledActivities, setScheduledActivities] = useState(() => load("mg_scheduled", []));
  const [schedActivityId, setSchedActivityId] = useState("");
  const [schedTime, setSchedTime] = useState("14:00");
  const [schedDuration, setSchedDuration] = useState(60);
  const [showMotivation, setShowMotivation] = useState(false);
  const [badgeFilter, setBadgeFilter] = useState("all");

  const timerRef = useRef(null);
  const notifTimers = useRef([]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  }, []);

  // Daily reset
  useEffect(() => {
    const today = getToday();
    if (meds.date !== today) {
      if (meds.morning && meds.evening) {
        setStats(s => { const n = { ...s, medStreak: (s.medStreak || 0) + 1 }; save("mg_stats", n); return n; });
      }
      setMeds(m => { const nm = { morning: false, evening: false, date: today }; save("mg_meds", nm); return nm; });
    }
    if (water.date !== today) {
      if (water.amount >= WATER_GOAL) {
        setStats(s => {
          const dates = s.waterGoalDates || [];
          if (dates.includes(water.date)) return s;
          const n = { ...s, waterGoalDates: [...dates, water.date] };
          save("mg_stats", n); return n;
        });
      }
      setWater(() => { const nw = { amount: 0, date: today }; save("mg_water", nw); return nw; });
    }
    // Clear scheduled activities from previous days
    setScheduledActivities(sa => {
      const filtered = sa.filter(s => !s.date || s.date === today);
      save("mg_scheduled", filtered);
      return filtered;
    });
  }, []);

  // Timer with recovery — recalculates from timestamp to stay accurate when backgrounded
  useEffect(() => {
    if (timerRunning && timerStartedAt) {
      const recalc = () => {
        const elapsed = Math.floor((Date.now() - timerStartedAt) / 1000);
        setTimerSeconds(elapsed);
        save("mg_timer_seconds", elapsed);
      };
      recalc();
      timerRef.current = setInterval(recalc, 1000);
      const handleVisibility = () => { if (!document.hidden) recalc(); };
      document.addEventListener("visibilitychange", handleVisibility);
      return () => {
        clearInterval(timerRef.current);
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerStartedAt]);

  // Schedule notifications
  useEffect(() => {
    notifTimers.current.forEach(t => clearTimeout(t));
    notifTimers.current = [];
    const now = Date.now();
    const today = getToday();

    scheduledActivities.forEach(sa => {
      const act = ACTIVITIES.find(a => a.id === sa.activityId);
      if (!act || !sa.time) return;
      const [h, m] = sa.time.split(":").map(Number);
      const target = new Date(); target.setHours(h, m, 0, 0);
      const rem = target.getTime() - 10 * 60 * 1000;
      if (rem > now) {
        notifTimers.current.push(setTimeout(() => {
          scheduleNotification(`${act.emoji} ${act.label} dans 10 min !`, `Prépare-toi Morgane !`, 0);
        }, rem - now));
      }
    });

    (calEvents[today] || []).forEach(evt => {
      if (!evt.time) return;
      const [h, m] = evt.time.split(":").map(Number);
      const target = new Date(); target.setHours(h, m, 0, 0);
      const rem = target.getTime() - 10 * 60 * 1000;
      if (rem > now) {
        notifTimers.current.push(setTimeout(() => {
          scheduleNotification("📅 RDV dans 10 min", evt.text, 0);
        }, rem - now));
      }
    });

    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const tKey = tomorrow.toISOString().split("T")[0];
    if ((calEvents[tKey] || []).length > 0) {
      const t20 = new Date(); t20.setHours(20, 0, 0, 0);
      if (t20.getTime() > now) {
        const evtTexts = (calEvents[tKey] || []).map(e => `${e.time} — ${e.text}`).join(", ");
        notifTimers.current.push(setTimeout(() => {
          scheduleNotification("📅 RDV demain", evtTexts, 0);
        }, t20.getTime() - now));
      }
    }

    return () => notifTimers.current.forEach(t => clearTimeout(t));
  }, [scheduledActivities, calEvents]);

  // Motivation
  useEffect(() => {
    const iv = setInterval(() => { setShowMotivation(true); setTimeout(() => setShowMotivation(false), 4000); }, 300000);
    return () => clearInterval(iv);
  }, []);

  // Badge checker — reactive via useEffect, reads latest badges from localStorage
  // to avoid stale closure issues
  useEffect(() => {
    const currentBadges = load("mg_badges", []);
    const queue = [];
    ALL_BADGES.forEach(b => {
      if (!currentBadges.includes(b.id) && b.condition(stats)) queue.push(b);
    });
    if (queue.length > 0) {
      const nb = [...currentBadges, ...queue.map(b => b.id)];
      setBadges(nb); save("mg_badges", nb);
      setNewBadge(queue[0]);
    }
  }, [stats]);

  useEffect(() => save("mg_tasks", tasks), [tasks]);

  const startTimer = (actId) => {
    setTimerActivity(actId); save("mg_timer_activity", actId);
    setTimerSeconds(0); save("mg_timer_seconds", 0);
    const now = Date.now();
    setTimerStartedAt(now); save("mg_timer_started_at", now);
    setTimerRunning(true); save("mg_timer_running", true);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false); save("mg_timer_running", false);
    if (timerActivity && timerSeconds > 0) {
      setStats(s => {
        const ua = new Set(load("mg_unique_acts", []));
        ua.add(timerActivity); save("mg_unique_acts", [...ua]);
        const n = {
          ...s,
          [timerActivity]: (s[timerActivity] || 0) + timerSeconds,
          totalSessions: (s.totalSessions || 0) + 1,
          totalTime: (s.totalTime || 0) + timerSeconds,
          uniqueActivities: ua.size,
        };
        save("mg_stats", n); return n;
      });
    }
    setTimerActivity(null); save("mg_timer_activity", null);
    setTimerStartedAt(null); save("mg_timer_started_at", null);
    setTimerSeconds(0); save("mg_timer_seconds", 0);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text: newTask, done: false, date: taskFor === "tomorrow" ? getTomorrow() : getToday() }]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(t => t.map(tk => {
      if (tk.id === id && !tk.done) {
        setStats(s => { const n = { ...s, tasksCompleted: (s.tasksCompleted || 0) + 1 }; save("mg_stats", n); return n; });
      }
      return tk.id === id ? { ...tk, done: !tk.done } : tk;
    }));
  };

  const toggleMed = (period) => {
    const nm = { ...meds, [period]: !meds[period] };
    setMeds(nm); save("mg_meds", nm);
    if (period === "morning" && !meds[period] && new Date().getHours() < 8) {
      setStats(s => { const n = { ...s, earlyMeds: (s.earlyMeds || 0) + 1 }; save("mg_stats", n); return n; });
    }
  };

  const addWater = () => {
    const nw = { ...water, amount: Math.min(water.amount + WATER_STEP, 4000) };
    setWater(nw); save("mg_water", nw);
    // Record this date only once, only when crossing the goal threshold
    if (nw.amount >= WATER_GOAL && water.amount < WATER_GOAL) {
      setStats(s => {
        const today = getToday();
        const dates = s.waterGoalDates || [];
        if (dates.includes(today)) return s;
        const n = { ...s, waterGoalDates: [...dates, today] };
        save("mg_stats", n); return n;
      });
    }
  };

  const removeWater = () => {
    if (water.amount <= 0) return;
    const nw = { ...water, amount: Math.max(water.amount - WATER_STEP, 0) };
    setWater(nw); save("mg_water", nw);
  };

  const addCalEvent = () => {
    if (!eventInput.trim() || !showEventModal) return;
    const key = showEventModal;
    const evts = { ...calEvents, [key]: [...(calEvents[key] || []), { text: eventInput, time: eventTimeInput, id: Date.now() }] };
    setCalEvents(evts); save("mg_cal_events", evts);
    setEventInput(""); setShowEventModal(null);
  };

  const removeCalEvent = (dateKey, eventId) => {
    const evts = { ...calEvents, [dateKey]: (calEvents[dateKey] || []).filter(e => e.id !== eventId) };
    if (evts[dateKey]?.length === 0) delete evts[dateKey];
    setCalEvents(evts); save("mg_cal_events", evts);
  };

  const addScheduledActivity = () => {
    if (!schedActivityId) return;
    const act = ACTIVITIES.find(a => a.id === schedActivityId);
    if (!act) return;
    const today = getToday();
    const sid = Date.now();

    const ns = [...scheduledActivities, { activityId: schedActivityId, time: schedTime, duration: schedDuration, id: sid, date: today }];
    setScheduledActivities(ns); save("mg_scheduled", ns);

    const eventText = `${act.emoji} ${act.label} (${schedDuration}min)`;
    const evts = { ...calEvents, [today]: [...(calEvents[today] || []), { text: eventText, time: schedTime, id: sid + 1, isActivity: true }] };
    setCalEvents(evts); save("mg_cal_events", evts);

    setTasks(t => [...t, { id: sid + 2, text: `${act.emoji} ${act.label} — ${schedTime} (${schedDuration}min)`, done: false, date: today, isActivity: true }]);

    const [h, m] = schedTime.split(":").map(Number);
    const target = new Date(); target.setHours(h, m, 0, 0);
    const delay = target.getTime() - 10 * 60 * 1000 - Date.now();
    if (delay > 0) scheduleNotification(`${act.emoji} ${act.label} dans 10 min !`, `Prépare-toi Morgane !`, delay);

    setSchedActivityId("");
  };

  // ─── Computed ───
  const todayTasks = tasks.filter(t => t.date === getToday());
  const tomorrowTasks = tasks.filter(t => t.date === getTomorrow());
  const currentAct = ACTIVITIES.find(a => a.id === timerActivity);
  const waterPercent = Math.min((water.amount / WATER_GOAL) * 100, 100);
  const greeting = (() => { const h = new Date().getHours(); if (h < 6) return "Bonne nuit"; if (h < 12) return "Bonjour"; if (h < 18) return "Bon après-midi"; return "Bonsoir"; })();

  const upcomingEvents = useMemo(() => {
    const events = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      (calEvents[key] || []).forEach(e => {
        events.push({ ...e, dateKey: key, dateLabel: i === 0 ? "Aujourd'hui" : i === 1 ? "Demain" : d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }) });
      });
    }
    return events.sort((a, b) => `${a.dateKey}${a.time}`.localeCompare(`${b.dateKey}${b.time}`));
  }, [calEvents]);

  const liveStats = useMemo(() => {
    if (timerRunning && timerActivity) {
      return { ...stats, [timerActivity]: (stats[timerActivity] || 0) + timerSeconds, totalTime: (stats.totalTime || 0) + timerSeconds };
    }
    return stats;
  }, [stats, timerRunning, timerActivity, timerSeconds]);

  const filteredBadges = useMemo(() => {
    if (badgeFilter === "all") return ALL_BADGES;
    if (badgeFilter === "unlocked") return ALL_BADGES.filter(b => badges.includes(b.id));
    if (badgeFilter === "special") return SPECIAL_BADGES;
    return ALL_BADGES.filter(b => b.actId === badgeFilter);
  }, [badgeFilter, badges]);

  const todayScheduled = scheduledActivities;

  // ═══ RENDER ═══
  return (
    <div style={{
      fontFamily: "'Quicksand', sans-serif", minHeight: "100vh",
      background: "linear-gradient(160deg, #FFF5F5 0%, #FFF0F6 25%, #F5F0FF 50%, #F0F8FF 75%, #F0FFF4 100%)",
      position: "relative", overflow: "hidden", paddingBottom: "80px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Comfortaa:wght@400;600;700&display=swap" rel="stylesheet" />
      <BubbleBackground />

      {showMotivation && (
        <div style={{
          position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #845EC2, #D65DB1)", color: "#FFF",
          padding: "14px 28px", borderRadius: "20px", zIndex: 9000, fontSize: "15px",
          fontWeight: 600, boxShadow: "0 8px 30px rgba(132,94,194,0.4)",
          animation: "slideDown 0.4s ease", whiteSpace: "nowrap",
        }}>{MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]}</div>
      )}

      <BadgePopup badge={newBadge} onClose={() => setNewBadge(null)} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "480px", margin: "0 auto", padding: "16px" }}>

        {/* ═══ HOME ═══ */}
        {tab === "home" && (<div>
          <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
            <h1 style={{
              fontFamily: "'Comfortaa', sans-serif", fontSize: "28px",
              background: "linear-gradient(135deg, #845EC2, #D65DB1, #FF6F91)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0,
            }}>{greeting}, Morgane ✨</h1>
            <p style={{ color: "#8E8EA0", fontSize: "13px", margin: "6px 0 0", textTransform: "capitalize" }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          <Card style={{ background: "linear-gradient(135deg, rgba(132,94,194,0.06), rgba(214,93,177,0.06))" }}>
            <p style={{ fontSize: "13px", color: "#4B4453", lineHeight: 1.6, margin: 0 }}>{funFact}</p>
          </Card>

          {timerRunning && currentAct && (
            <Card style={{ background: `linear-gradient(135deg, ${currentAct.color}15, ${currentAct.color}08)`, border: `1px solid ${currentAct.color}30` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "28px" }}>{currentAct.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: currentAct.color, fontSize: "13px" }}>{currentAct.label} en cours</div>
                    <div style={{ fontFamily: "'Comfortaa'", fontWeight: 700, fontSize: "20px", color: "#4B4453" }}>{formatTime(timerSeconds)}</div>
                  </div>
                </div>
                <button onClick={stopTimer} style={{ background: "#FF6B6B", color: "#FFF", border: "none", borderRadius: "12px", padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontSize: "12px", fontFamily: "'Quicksand'" }}>⏹ Stop</button>
              </div>
            </Card>
          )}

          <Card>
            <CardTitle>💊 Médicaments</CardTitle>
            <div style={{ display: "flex", gap: "10px" }}>
              {[["morning", "🌅 Matin"], ["evening", "🌙 Soir"]].map(([p, lbl]) => (
                <button key={p} onClick={() => toggleMed(p)} style={{
                  flex: 1, padding: "14px", borderRadius: "16px", border: "none", cursor: "pointer",
                  background: meds[p] ? "linear-gradient(135deg, #00C9A7, #00B4D8)" : "linear-gradient(135deg, #F0F0F5, #E8E8F0)",
                  color: meds[p] ? "#FFF" : "#8E8EA0", fontFamily: "'Quicksand'", fontWeight: 700, fontSize: "13px",
                  transition: "all 0.3s", boxShadow: meds[p] ? "0 4px 15px rgba(0,201,167,0.3)" : "none",
                }}>{lbl}{meds[p] && " ✓"}</button>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle color="#0089BA">💧 Hydratation — {water.amount}ml / {WATER_GOAL}ml</CardTitle>
            <div style={{ background: "#E8F4FD", borderRadius: "12px", height: "24px", overflow: "hidden", position: "relative", marginBottom: "10px" }}>
              <div style={{
                height: "100%", borderRadius: "12px", transition: "width 0.5s ease",
                background: waterPercent >= 100 ? "linear-gradient(90deg, #00C9A7, #00B4D8)" : "linear-gradient(90deg, #89CFF0, #0089BA)",
                width: `${waterPercent}%`,
              }} />
              {waterPercent >= 100 && <span style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "13px" }}>🎉</span>}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={removeWater} disabled={water.amount <= 0} style={{
                padding: "10px 14px", borderRadius: "14px", border: "none",
                background: "rgba(255,107,107,0.15)", color: "#FF6B6B", fontWeight: 700,
                cursor: "pointer", fontSize: "13px", fontFamily: "'Quicksand'",
                opacity: water.amount <= 0 ? 0.3 : 1,
              }}>−</button>
              <button onClick={addWater} disabled={water.amount >= 4000} style={{
                flex: 1, padding: "10px", borderRadius: "14px", border: "none",
                background: waterPercent >= 100 ? "linear-gradient(135deg, #00C9A7, #00B4D8)" : "linear-gradient(135deg, #89CFF0, #0089BA)",
                color: "#FFF", fontWeight: 700, cursor: "pointer", fontSize: "13px", fontFamily: "'Quicksand'", opacity: water.amount >= 4000 ? 0.5 : 1,
              }}>+ 1 verre (250ml) 🥤</button>
            </div>
          </Card>

          {todayScheduled.length > 0 && (
            <Card>
              <CardTitle>🗓️ Activités programmées</CardTitle>
              {todayScheduled.map(sa => {
                const act = ACTIVITIES.find(a => a.id === sa.activityId);
                return (
                  <div key={sa.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", background: `${act?.color || "#845EC2"}10`, borderRadius: "14px", marginBottom: "6px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "22px" }}>{act?.emoji}</span>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#4B4453" }}>{act?.label}</div>
                        <div style={{ fontSize: "11px", color: "#8E8EA0" }}>{sa.time} • {sa.duration}min</div>
                      </div>
                    </div>
                    <button onClick={() => startTimer(sa.activityId)} style={{
                      background: act?.color || "#845EC2", color: "#FFF", border: "none", borderRadius: "10px",
                      padding: "7px 14px", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'Quicksand'",
                    }}>▶ Go</button>
                  </div>
                );
              })}
            </Card>
          )}

          <Card>
            <CardTitle right={taskFor === "today" ? `${todayTasks.filter(t => t.done).length}/${todayTasks.length}` : `${tomorrowTasks.filter(t => t.done).length}/${tomorrowTasks.length}`}>
              📋 Tâches {taskFor === "today" ? "du jour" : "de demain"}
            </CardTitle>
            <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
              {["today", "tomorrow"].map(d => (
                <button key={d} onClick={() => setTaskFor(d)} style={{
                  flex: 1, padding: "7px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Quicksand'", transition: "all 0.2s",
                  background: taskFor === d ? "linear-gradient(135deg, #845EC2, #D65DB1)" : "rgba(0,0,0,0.05)",
                  color: taskFor === d ? "#FFF" : "#8E8EA0",
                }}>{d === "today" ? "Aujourd'hui" : "Demain"}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
              <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()}
                placeholder={taskFor === "tomorrow" ? "Ajouter pour demain..." : "Ajouter une tâche..."} style={{
                  flex: 1, padding: "10px 14px", borderRadius: "12px", border: "1px solid rgba(132,94,194,0.15)",
                  background: "rgba(255,255,255,0.85)", fontFamily: "'Quicksand'", fontSize: "13px", outline: "none",
                }} />
              <button onClick={addTask} style={{
                padding: "10px 16px", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg, #845EC2, #D65DB1)", color: "#FFF", fontWeight: 700, cursor: "pointer", fontSize: "16px",
              }}>+</button>
            </div>
            {(taskFor === "today" ? todayTasks : tomorrowTasks).length === 0 ? (
              <p style={{ color: "#AEAEB2", fontSize: "13px", fontStyle: "italic", margin: 0, textAlign: "center", padding: "8px 0" }}>Rien pour le moment 🌸</p>
            ) : (taskFor === "today" ? todayTasks : tomorrowTasks).map(t => (
              <div key={t.id} onClick={() => toggleTask(t.id)} style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "9px 4px", cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,0.04)",
              }}>
                <span style={{
                  width: "22px", height: "22px", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", flexShrink: 0, background: t.done ? "linear-gradient(135deg, #00C9A7, #00B4D8)" : "rgba(0,0,0,0.06)",
                  color: "#FFF", transition: "all 0.2s",
                }}>{t.done ? "✓" : ""}</span>
                <span style={{ fontSize: "13px", color: t.done ? "#AEAEB2" : "#4B4453", textDecoration: t.done ? "line-through" : "none", flex: 1 }}>{t.text}</span>
                <button onClick={(e) => { e.stopPropagation(); setTasks(ts => ts.filter(tk => tk.id !== t.id)); }} style={{
                  background: "none", border: "none", color: "#D0D0D0", fontSize: "16px", cursor: "pointer",
                }}>×</button>
              </div>
            ))}
          </Card>

          <Card>
            <CardTitle>📅 Prochains RDV</CardTitle>
            {upcomingEvents.length === 0 ? (
              <p style={{ color: "#AEAEB2", fontSize: "13px", margin: 0, textAlign: "center", padding: "8px 0" }}>Aucun événement cette semaine</p>
            ) : upcomingEvents.slice(0, 8).map((e, i) => (
              <div key={`${e.dateKey}-${e.id}`} style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "8px 6px",
                borderBottom: i < Math.min(upcomingEvents.length, 8) - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
              }}>
                <div style={{
                  background: e.dateLabel === "Aujourd'hui" ? "rgba(132,94,194,0.12)" : "rgba(132,94,194,0.06)",
                  borderRadius: "8px", padding: "4px 10px", fontSize: "10px", fontWeight: 700,
                  color: "#845EC2", minWidth: "70px", textAlign: "center",
                }}>{e.dateLabel}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#4B4453" }}>{e.text}</div>
                  <div style={{ fontSize: "11px", color: "#8E8EA0" }}>{e.time}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <CardTitle>🏅 Progression</CardTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", textAlign: "center" }}>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#845EC2" }}>{badges.length}</div>
                <div style={{ fontSize: "10px", color: "#8E8EA0" }}>badges</div>
              </div>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#00C9A7" }}>{stats.tasksCompleted || 0}</div>
                <div style={{ fontSize: "10px", color: "#8E8EA0" }}>tâches</div>
              </div>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#FF6B6B" }}>{formatDuration(liveStats.totalTime || 0)}</div>
                <div style={{ fontSize: "10px", color: "#8E8EA0" }}>activités</div>
              </div>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#0089BA" }}>{getWaterStreak(stats.waterGoalDates || [])}j</div>
                <div style={{ fontSize: "10px", color: "#8E8EA0" }}>eau ok</div>
              </div>
            </div>
          </Card>
        </div>)}

        {/* ═══ TIMER ═══ */}
        {tab === "timer" && (<div>
          <h2 style={{ fontFamily: "'Comfortaa'", textAlign: "center", color: "#845EC2", fontSize: "22px", margin: "20px 0 16px" }}>⏱️ Chrono d'activité</h2>

          {!timerRunning ? (<>
            <p style={{ textAlign: "center", color: "#8E8EA0", fontSize: "13px", margin: "0 0 18px" }}>Choisis ton activité et c'est parti !</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
              {ACTIVITIES.map(a => (
                <button key={a.id} onClick={() => startTimer(a.id)} style={{
                  background: "rgba(255,255,255,0.8)", border: "2px solid transparent", borderRadius: "18px",
                  padding: "14px 6px", cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: "5px", transition: "all 0.2s", backdropFilter: "blur(8px)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "scale(1)"; }}>
                  <span style={{ fontSize: "30px" }}>{a.emoji}</span>
                  <span style={{ fontSize: "10px", color: "#4B4453", fontWeight: 600 }}>{a.label}</span>
                </button>
              ))}
            </div>

            <Card>
              <CardTitle>📅 Programmer une activité</CardTitle>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <select value={schedActivityId} onChange={e => setSchedActivityId(e.target.value)} style={{
                  flex: "1 1 100px", padding: "10px", borderRadius: "12px", border: "1px solid #E0E0E0", fontFamily: "'Quicksand'", fontSize: "13px",
                }}>
                  <option value="">Activité</option>
                  {ACTIVITIES.map(a => <option key={a.id} value={a.id}>{a.emoji} {a.label}</option>)}
                </select>
                <input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} style={{
                  padding: "10px", borderRadius: "12px", border: "1px solid #E0E0E0", fontFamily: "'Quicksand'", fontSize: "13px", width: "90px",
                }} />
                <select value={schedDuration} onChange={e => setSchedDuration(Number(e.target.value))} style={{
                  padding: "10px", borderRadius: "12px", border: "1px solid #E0E0E0", fontFamily: "'Quicksand'", fontSize: "13px", width: "75px",
                }}>
                  {[15, 30, 45, 60, 90, 120, 180].map(d => <option key={d} value={d}>{d}min</option>)}
                </select>
                <button onClick={addScheduledActivity} style={{
                  padding: "10px 16px", borderRadius: "12px", border: "none",
                  background: "linear-gradient(135deg, #845EC2, #D65DB1)", color: "#FFF", fontWeight: 700, cursor: "pointer", fontSize: "14px",
                }}>+</button>
              </div>
              <p style={{ fontSize: "11px", color: "#AEAEB2", margin: "8px 0 0", lineHeight: 1.4 }}>
                🔔 Rappel 10 min avant • Ajouté à l'agenda + tâches
              </p>
              {todayScheduled.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  {todayScheduled.map(sa => {
                    const act = ACTIVITIES.find(a => a.id === sa.activityId);
                    return (
                      <div key={sa.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 12px", background: `${act?.color || "#845EC2"}10`, borderRadius: "10px", marginBottom: "6px", fontSize: "13px",
                      }}>
                        <span>{act?.emoji} {act?.label} à {sa.time} ({sa.duration}min)</span>
                        <button onClick={() => {
                          const ns = scheduledActivities.filter(s => s.id !== sa.id);
                          setScheduledActivities(ns); save("mg_scheduled", ns);
                        }} style={{ background: "none", border: "none", color: "#FF6B6B", cursor: "pointer", fontSize: "16px" }}>×</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card>
              <CardTitle>📊 Temps cumulé</CardTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {ACTIVITIES.filter(a => (liveStats[a.id] || 0) > 0).map(a => (
                  <div key={a.id} style={{ background: `${a.color}12`, borderRadius: "14px", padding: "12px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: "22px" }}>{a.emoji}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: a.color, marginTop: "4px" }}>{formatDuration(liveStats[a.id] || 0)}</div>
                  </div>
                ))}
              </div>
              {ACTIVITIES.filter(a => (liveStats[a.id] || 0) > 0).length === 0 && (
                <p style={{ color: "#AEAEB2", fontSize: "13px", textAlign: "center", margin: 0 }}>Pas encore de stats — lance ton premier chrono !</p>
              )}
            </Card>
          </>) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: "220px", height: "220px", borderRadius: "50%", margin: "0 auto 24px",
                background: `conic-gradient(${currentAct?.color || "#845EC2"} ${(timerSeconds % 3600) / 36}%, rgba(0,0,0,0.05) 0)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 40px ${currentAct?.color || "#845EC2"}30`,
              }}>
                <div style={{
                  width: "190px", height: "190px", borderRadius: "50%", background: "rgba(255,255,255,0.95)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: "48px", marginBottom: "8px" }}>{currentAct?.emoji}</span>
                  <span style={{ fontFamily: "'Comfortaa'", fontSize: "28px", fontWeight: 700, color: currentAct?.color || "#845EC2" }}>{formatTime(timerSeconds)}</span>
                  <span style={{ fontSize: "13px", color: "#8E8EA0", marginTop: "4px" }}>{currentAct?.label}</span>
                </div>
              </div>
              <button onClick={stopTimer} style={{
                background: "linear-gradient(135deg, #FF6B6B, #FF8E8E)", color: "#FFF",
                border: "none", borderRadius: "18px", padding: "16px 48px", fontSize: "16px",
                fontWeight: 700, cursor: "pointer", fontFamily: "'Quicksand'", boxShadow: "0 6px 20px rgba(255,107,107,0.3)",
              }}>⏹ Arrêter</button>
            </div>
          )}
        </div>)}

        {/* ═══ TASKS ═══ */}
        {tab === "tasks" && (<div>
          <h2 style={{ fontFamily: "'Comfortaa'", textAlign: "center", color: "#845EC2", fontSize: "22px", margin: "20px 0 16px" }}>✅ To-Do List</h2>
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
            {["today", "tomorrow"].map(d => (
              <button key={d} onClick={() => setTaskFor(d)} style={{
                flex: 1, padding: "10px", borderRadius: "14px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                fontFamily: "'Quicksand'", transition: "all 0.2s",
                background: taskFor === d ? "linear-gradient(135deg, #845EC2, #D65DB1)" : "rgba(255,255,255,0.7)",
                color: taskFor === d ? "#FFF" : "#8E8EA0",
                boxShadow: taskFor === d ? "0 4px 12px rgba(132,94,194,0.3)" : "none",
              }}>{d === "today" ? "📋 Aujourd'hui" : "🌙 Demain"}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
            <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()}
              placeholder={taskFor === "tomorrow" ? "Ajouter pour demain..." : "Ajouter une tâche..."} style={{
                flex: 1, padding: "14px 18px", borderRadius: "16px", border: "1px solid rgba(132,94,194,0.15)",
                background: "rgba(255,255,255,0.85)", fontFamily: "'Quicksand'", fontSize: "14px", outline: "none", backdropFilter: "blur(8px)",
              }} />
            <button onClick={addTask} style={{
              padding: "14px 20px", borderRadius: "16px", border: "none",
              background: "linear-gradient(135deg, #845EC2, #D65DB1)", color: "#FFF", fontWeight: 700, cursor: "pointer", fontSize: "18px",
            }}>+</button>
          </div>
          <Card style={{ padding: "14px" }}>
            {(taskFor === "today" ? todayTasks : tomorrowTasks).length === 0 ? (
              <p style={{ color: "#AEAEB2", textAlign: "center", fontSize: "14px", padding: "20px 0" }}>
                {taskFor === "today" ? "Rien pour le moment 🌸 Ajoute tes objectifs du jour !" : "Aucune tâche pour demain 🌙 Prépare ta journée !"}
              </p>
            ) : (taskFor === "today" ? todayTasks : tomorrowTasks).map(t => (
              <div key={t.id} style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "12px 8px",
                borderBottom: "1px solid rgba(0,0,0,0.04)", cursor: "pointer",
              }} onClick={() => toggleTask(t.id)}>
                <div style={{
                  width: "26px", height: "26px", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: t.done ? "linear-gradient(135deg, #00C9A7, #00B4D8)" : "rgba(0,0,0,0.06)",
                  color: "#FFF", fontSize: "14px", fontWeight: 700, transition: "all 0.3s",
                }}>{t.done && "✓"}</div>
                <span style={{ flex: 1, fontSize: "14px", color: t.done ? "#AEAEB2" : "#4B4453", textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                <button onClick={(e) => { e.stopPropagation(); setTasks(ts => ts.filter(tk => tk.id !== t.id)); }} style={{
                  background: "none", border: "none", color: "#D0D0D0", fontSize: "18px", cursor: "pointer",
                }}>×</button>
              </div>
            ))}
          </Card>
        </div>)}

        {/* ═══ CALENDAR ═══ */}
        {tab === "calendar" && (<div>
          <h2 style={{ fontFamily: "'Comfortaa'", textAlign: "center", color: "#845EC2", fontSize: "22px", margin: "20px 0 10px" }}>📅 Calendrier</h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", padding: "0 8px" }}>
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }} style={{
              background: "rgba(132,94,194,0.1)", border: "none", borderRadius: "12px", padding: "8px 14px", cursor: "pointer", fontSize: "16px", color: "#845EC2",
            }}>◀</button>
            <span style={{ fontWeight: 700, color: "#4B4453", fontSize: "16px", textTransform: "capitalize" }}>
              {new Date(calYear, calMonth).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </span>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }} style={{
              background: "rgba(132,94,194,0.1)", border: "none", borderRadius: "12px", padding: "8px 14px", cursor: "pointer", fontSize: "16px", color: "#845EC2",
            }}>▶</button>
          </div>
          <Card style={{ padding: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "6px" }}>
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: "11px", color: "#8E8EA0", fontWeight: 600, padding: "4px 0" }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
              {[...Array(getFirstDayOfMonth(calYear, calMonth))].map((_, i) => <div key={`e${i}`} />)}
              {[...Array(getDaysInMonth(calYear, calMonth))].map((_, i) => {
                const day = i + 1;
                const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isToday = dateKey === getToday();
                const hasEvents = calEvents[dateKey]?.length > 0;
                return (
                  <button key={day} onClick={() => { setShowEventModal(dateKey); setEventInput(""); setEventTimeInput("09:00"); }} style={{
                    aspectRatio: "1", borderRadius: "12px", border: "none", cursor: "pointer",
                    background: isToday ? "linear-gradient(135deg, #845EC2, #D65DB1)" : hasEvents ? "rgba(132,94,194,0.1)" : "transparent",
                    color: isToday ? "#FFF" : "#4B4453", fontWeight: isToday ? 700 : 500,
                    fontSize: "13px", position: "relative", fontFamily: "'Quicksand'", transition: "all 0.2s",
                  }}>
                    {day}
                    {hasEvents && <span style={{ position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", width: "5px", height: "5px", borderRadius: "50%", background: isToday ? "#FFF" : "#D65DB1" }} />}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardTitle>📌 Événements du jour</CardTitle>
            {(calEvents[getToday()] || []).length === 0 ? (
              <p style={{ color: "#AEAEB2", fontSize: "13px", margin: 0 }}>Rien de prévu aujourd'hui</p>
            ) : (calEvents[getToday()] || []).sort((a, b) => a.time.localeCompare(b.time)).map(e => (
              <div key={e.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 10px", background: "rgba(132,94,194,0.06)", borderRadius: "10px", marginBottom: "6px", fontSize: "13px",
              }}>
                <span><strong>{e.time}</strong> — {e.text}</span>
                <button onClick={() => removeCalEvent(getToday(), e.id)} style={{ background: "none", border: "none", color: "#FF6B6B", cursor: "pointer", fontSize: "16px" }}>×</button>
              </div>
            ))}
          </Card>

          {showEventModal && (
            <div style={{
              position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "center",
              justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)",
            }} onClick={() => setShowEventModal(null)}>
              <div style={{
                background: "#FFF", borderRadius: "24px", padding: "28px", width: "90%", maxWidth: "360px",
                boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
              }} onClick={e => e.stopPropagation()}>
                <h3 style={{ margin: "0 0 6px", color: "#845EC2", fontFamily: "'Comfortaa'" }}>Ajouter un événement</h3>
                <p style={{ color: "#8E8EA0", fontSize: "13px", margin: "0 0 16px", textTransform: "capitalize" }}>
                  {new Date(showEventModal + "T12:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <input value={eventInput} onChange={e => setEventInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addCalEvent()}
                  placeholder="Description..." autoFocus style={{
                    width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #E0E0E0",
                    fontFamily: "'Quicksand'", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box",
                  }} />
                <input type="time" value={eventTimeInput} onChange={e => setEventTimeInput(e.target.value)} style={{
                  width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #E0E0E0",
                  fontFamily: "'Quicksand'", fontSize: "14px", marginBottom: "6px", boxSizing: "border-box",
                }} />
                <p style={{ fontSize: "11px", color: "#AEAEB2", margin: "2px 0 14px" }}>🔔 Rappel 10 min avant + la veille à 20h</p>
                {(calEvents[showEventModal] || []).length > 0 && (
                  <div style={{ marginBottom: "14px" }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#845EC2", margin: "0 0 6px" }}>Déjà prévu :</p>
                    {(calEvents[showEventModal] || []).sort((a, b) => a.time.localeCompare(b.time)).map(e => (
                      <div key={e.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "6px 10px", background: "rgba(132,94,194,0.06)", borderRadius: "8px", marginBottom: "4px", fontSize: "12px",
                      }}>
                        <span><strong>{e.time}</strong> — {e.text}</span>
                        <button onClick={() => removeCalEvent(showEventModal, e.id)} style={{ background: "none", border: "none", color: "#FF6B6B", cursor: "pointer" }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setShowEventModal(null)} style={{
                    flex: 1, padding: "12px", borderRadius: "14px", border: "1px solid #E0E0E0",
                    background: "#FFF", color: "#8E8EA0", fontWeight: 700, cursor: "pointer", fontFamily: "'Quicksand'",
                  }}>Annuler</button>
                  <button onClick={addCalEvent} style={{
                    flex: 1, padding: "12px", borderRadius: "14px", border: "none",
                    background: "linear-gradient(135deg, #845EC2, #D65DB1)", color: "#FFF",
                    fontWeight: 700, cursor: "pointer", fontFamily: "'Quicksand'",
                  }}>Ajouter</button>
                </div>
              </div>
            </div>
          )}
        </div>)}

        {/* ═══ BADGES ═══ */}
        {tab === "badges" && (<div>
          <h2 style={{ fontFamily: "'Comfortaa'", textAlign: "center", color: "#845EC2", fontSize: "22px", margin: "20px 0 8px" }}>🏅 Badges & Récompenses</h2>
          <p style={{ textAlign: "center", color: "#8E8EA0", fontSize: "13px", margin: "0 0 14px" }}>{badges.length}/{ALL_BADGES.length} débloqués</p>

          <div style={{
            display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "14px",
            WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
          }}>
            {[
              { id: "all", label: "Tous" }, { id: "unlocked", label: "✅ Débloqués" }, { id: "special", label: "⭐ Spéciaux" },
              ...ACTIVITIES.map(a => ({ id: a.id, label: `${a.emoji}` })),
            ].map(f => (
              <button key={f.id} onClick={() => setBadgeFilter(f.id)} style={{
                padding: "6px 12px", borderRadius: "20px", border: "none", cursor: "pointer",
                background: badgeFilter === f.id ? "linear-gradient(135deg, #845EC2, #D65DB1)" : "rgba(255,255,255,0.7)",
                color: badgeFilter === f.id ? "#FFF" : "#8E8EA0", fontSize: "11px",
                fontWeight: 600, whiteSpace: "nowrap", fontFamily: "'Quicksand'", flexShrink: 0,
              }}>{f.label}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {filteredBadges.map(b => {
              const unlocked = badges.includes(b.id);
              return (
                <div key={b.id} style={{
                  background: unlocked ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.03)",
                  borderRadius: "18px", padding: "14px 6px", textAlign: "center",
                  border: unlocked ? "2px solid rgba(132,94,194,0.2)" : "2px solid transparent",
                  opacity: unlocked ? 1 : 0.4, transition: "all 0.3s", backdropFilter: "blur(8px)",
                }}>
                  <div style={{ fontSize: "26px", marginBottom: "2px", filter: unlocked ? "none" : "grayscale(1)" }}>{b.emoji}</div>
                  <div style={{ fontSize: "14px", marginBottom: "2px" }}>{b.tierEmoji}</div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: unlocked ? "#845EC2" : "#AEAEB2", lineHeight: 1.3 }}>{b.title}</div>
                  <div style={{ fontSize: "9px", color: "#8E8EA0", marginTop: "2px", lineHeight: 1.3 }}>{b.desc}</div>
                </div>
              );
            })}
          </div>
          {filteredBadges.length === 0 && (
            <p style={{ textAlign: "center", color: "#AEAEB2", fontSize: "13px", marginTop: "20px" }}>Aucun badge dans cette catégorie</p>
          )}
        </div>)}
      </div>

      {/* NAV */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(132,94,194,0.08)",
        display: "flex", justifyContent: "center", gap: "4px", padding: "8px 12px",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
      }}>
        <NavButton icon="🏠" label="Accueil" active={tab === "home"} onClick={() => setTab("home")} />
        <NavButton icon="⏱️" label="Chrono" active={tab === "timer"} onClick={() => setTab("timer")} badge={timerRunning ? "●" : null} />
        <NavButton icon="✅" label="Tâches" active={tab === "tasks"} onClick={() => setTab("tasks")} badge={todayTasks.filter(t => !t.done).length || null} />
        <NavButton icon="📅" label="Agenda" active={tab === "calendar"} onClick={() => setTab("calendar")} badge={(calEvents[getToday()] || []).length || null} />
        <NavButton icon="🏅" label="Badges" active={tab === "badges"} onClick={() => setTab("badges")} />
      </div>

      <style>{`
        @keyframes slideDown { from{transform:translate(-50%,-100%);opacity:0} to{transform:translate(-50%,0);opacity:1} }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        input:focus, select:focus { outline: 2px solid rgba(132,94,194,0.3); }
        button:active { transform: scale(0.96) !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(132,94,194,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}
