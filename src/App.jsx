import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d0f18; --card: #13151f; --card2: #181a27;
    --border: #1e2135; --border2: #252840;
    --purple: #6c5ce7; --green: #00b894; --orange: #e17055;
    --yellow: #fdcb6e; --blue: #0984e3; --red: #d63031;
    --text: #eef0f8; --muted: #8890b0; --muted2: #555;
    --radius: 14px; --radius-sm: 8px;
    --safe-bottom: env(safe-area-inset-bottom, 0px);
  }
  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  body { overflow: hidden; }
  #root { display: flex; flex-direction: column; max-width: 480px; margin: 0 auto; }
  .app-shell { display: flex; flex-direction: column; height: 100vh; height: 100dvh; }
  .tab-content { flex: 1; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; padding-bottom: calc(80px + var(--safe-bottom)); }

  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: rgba(13,15,24,0.96); backdrop-filter: blur(20px); border-top: 1px solid var(--border); display: flex; padding-bottom: var(--safe-bottom); z-index: 100; }
  .nav-tab { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 4px 8px; cursor: pointer; border: none; background: none; color: var(--muted2); transition: color 0.2s; -webkit-tap-highlight-color: transparent; }
  .nav-tab.active { color: var(--purple); }
  .nav-tab span { font-family: 'Bebas Neue', sans-serif; font-size: 10px; letter-spacing: 0.5px; }
  .nav-icon { font-size: 22px; line-height: 1; }

  .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; margin: 0 16px 12px; }
  .card-tap { cursor: pointer; transition: background 0.15s, border-color 0.15s; -webkit-tap-highlight-color: transparent; }
  .card-tap:active { background: var(--card2); border-color: var(--border2); }
  .card-sm { padding: 12px 14px; margin-bottom: 8px; }

  .bebas { font-family: 'Bebas Neue', sans-serif; }
  .section-label { font-family: 'Bebas Neue', sans-serif; font-size: 12px; letter-spacing: 1.5px; color: var(--muted); padding: 0 16px; margin-bottom: 8px; margin-top: 20px; display: flex; align-items: center; gap: 8px; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .page-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 1px; line-height: 1; }
  .page-sub { font-size: 13px; color: var(--muted); margin-top: 3px; }

  .btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 20px; border-radius: var(--radius); border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; transition: opacity 0.15s, transform 0.1s; -webkit-tap-highlight-color: transparent; width: 100%; }
  .btn:active { transform: scale(0.97); opacity: 0.85; }
  .btn-primary { background: var(--purple); color: white; }
  .btn-green { background: var(--green); color: #001a12; }
  .btn-ghost { background: transparent; border: 1px solid var(--border2); color: var(--muted); }
  .btn-sm { padding: 9px 14px; font-size: 13px; width: auto; border-radius: var(--radius-sm); }
  .btn-row { display: flex; gap: 10px; padding: 0 16px; margin-bottom: 12px; }
  .btn-row .btn { flex: 1; }

  .input { background: #0d0f18; border: 2px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 13px 14px; width: 100%; outline: none; transition: border-color 0.2s; line-height: 1.5; }
  .input:focus { border-color: var(--purple); }
  .input::placeholder { color: var(--muted2); }
  textarea.input { resize: vertical; }
  .input-label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .input-group { margin-bottom: 14px; }

  .chip { padding: 9px 16px; border-radius: 20px; border: 1.5px solid var(--border); background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; -webkit-tap-highlight-color: transparent; white-space: nowrap; }
  .chip.active-purple { border-color: var(--purple); background: rgba(108,92,231,0.15); color: var(--purple); }
  .chip.active-green { border-color: var(--green); background: rgba(0,184,148,0.12); color: var(--green); }
  .chip.active-orange { border-color: var(--orange); background: rgba(225,112,85,0.12); color: var(--orange); }
  .chip.active-yellow { border-color: var(--yellow); background: rgba(253,203,110,0.1); color: var(--yellow); }
  .chip-row { display: flex; gap: 8px; flex-wrap: wrap; }

  .badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 10px; font-size: 11px; font-weight: 600; }
  .badge-purple { background: rgba(108,92,231,0.18); color: var(--purple); }
  .badge-green { background: rgba(0,184,148,0.15); color: var(--green); }
  .badge-orange { background: rgba(225,112,85,0.15); color: var(--orange); }
  .badge-yellow { background: rgba(253,203,110,0.12); color: var(--yellow); }
  .badge-muted { background: rgba(136,144,176,0.12); color: var(--muted); }

  .check-row { display: flex; align-items: flex-start; gap: 12px; }
  .check-box { width: 26px; height: 26px; min-width: 26px; border-radius: 8px; border: 2px solid var(--border2); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; -webkit-tap-highlight-color: transparent; flex-shrink: 0; margin-top: 1px; }
  .check-box.done { background: var(--green); border-color: var(--green); }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 200; display: flex; flex-direction: column; justify-content: flex-end; }
  .modal-sheet { background: var(--card); border-radius: 20px 20px 0 0; padding: 20px 16px; padding-bottom: calc(20px + var(--safe-bottom)); max-height: 90dvh; overflow-y: auto; }
  .modal-handle { width: 36px; height: 4px; background: var(--border2); border-radius: 2px; margin: 0 auto 20px; }
  .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1px; margin-bottom: 16px; }

  .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid var(--border2); border-top-color: var(--purple); border-radius: 50%; animation: spin 0.7s linear infinite; }
  .spinner-lg { width: 48px; height: 48px; border-width: 3px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.25s ease forwards; }

  .progress-track { background: var(--border); border-radius: 99px; height: 4px; overflow: hidden; margin-bottom: 24px; }
  .progress-fill { height: 100%; border-radius: 99px; transition: width 0.4s ease; background: var(--purple); }

  .found-row { display: flex; align-items: flex-start; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--border); }
  .found-row:last-child { border-bottom: none; }
  .missing-chip { display: inline-flex; align-items: center; gap: 5px; background: rgba(214,48,49,0.1); border: 1px solid rgba(214,48,49,0.3); border-radius: 8px; padding: 5px 10px; font-size: 12px; color: #ff7675; font-weight: 600; margin: 3px; }

  .draft-box { background: #0d0f18; border: 1.5px solid var(--border2); border-radius: var(--radius-sm); padding: 16px; font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.7; color: #c8d0f0; white-space: pre-wrap; width: 100%; resize: vertical; outline: none; min-height: 140px; }
  .draft-box:focus { border-color: var(--purple); }
  .double-check-box { background: #0d1a0d; border: 1px solid rgba(0,184,148,0.3); border-radius: var(--radius-sm); padding: 14px; margin-top: 12px; }

  .bubble-in { background: var(--border); border-radius: 14px 14px 14px 4px; padding: 11px 14px; font-size: 13px; color: #c8d0f0; line-height: 1.6; max-width: 82%; }
  .bubble-out { background: #1e1b4b; border: 1px solid #3730a3; border-radius: 14px 14px 4px 14px; padding: 11px 14px; font-size: 13px; color: #c7d2fe; line-height: 1.6; max-width: 82%; margin-left: auto; }

  .stage-pill { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 10px; font-size: 11px; font-weight: 600; }
  .back-btn { display: flex; align-items: center; gap: 6px; color: var(--purple); font-size: 15px; font-weight: 600; padding: 14px 16px 4px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .row { display: flex; align-items: center; gap: 8px; }
  .row-between { display: flex; align-items: center; justify-content: space-between; }
  .col { display: flex; flex-direction: column; gap: 4px; }
  .flex-1 { flex: 1; }
  .text-sm { font-size: 13px; } .text-xs { font-size: 11px; }
  .text-muted { color: var(--muted); } .text-green { color: var(--green); }
  .text-orange { color: var(--orange); } .text-purple { color: var(--purple); }
  .fw-600 { font-weight: 600; }
  .mt-4{margin-top:4px} .mt-8{margin-top:8px} .mt-12{margin-top:12px} .mt-16{margin-top:16px}
  .mb-4{margin-bottom:4px} .mb-8{margin-bottom:8px} .mb-12{margin-bottom:12px} .mb-16{margin-bottom:16px}
  .dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
  .earnings-card { background: linear-gradient(135deg, #1a1030 0%, #13151f 100%); border: 1px solid rgba(108,92,231,0.25); border-radius: var(--radius); padding: 16px; margin: 0 16px 12px; }
  .empty-state { text-align: center; padding: 48px 24px; color: var(--muted); }
  .empty-state .icon { font-size: 44px; margin-bottom: 12px; }
  .empty-state h3 { font-family: 'Bebas Neue', sans-serif; font-size: 20px; margin-bottom: 6px; color: var(--text); }
  .pill-tabs { display: flex; gap: 8px; padding: 0 16px; overflow-x: auto; scrollbar-width: none; }
  .pill-tabs::-webkit-scrollbar { display: none; }
  .pill-tab { padding: 7px 14px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.15s; -webkit-tap-highlight-color: transparent; }
  .pill-tab.active { background: var(--purple); border-color: var(--purple); color: white; }
  .toast { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); background: var(--card2); border: 1px solid var(--border2); border-radius: 12px; padding: 11px 20px; font-weight: 700; font-size: 14px; z-index: 999; white-space: nowrap; }
  .type-card { background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 14px 16px; cursor: pointer; transition: all 0.18s; display: flex; align-items: center; gap: 12px; margin-bottom: 10px; -webkit-tap-highlight-color: transparent; }
  .type-card:active { background: var(--card2); }
`;

/* ─────────────────────────────────────────────
   DATA LAYER
───────────────────────────────────────────── */
const db = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  getAll: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : []; } catch { return []; } },
  upsert: (k, item) => {
    const items = db.getAll(k);
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) items[idx] = item; else items.push(item);
    db.set(k, items); return item;
  },
  remove: (k, id) => { db.set(k, db.getAll(k).filter(i => i.id !== id)); },
};

const uid = () => Math.random().toString(36).slice(2, 10);
const todayStr = () => new Date().toISOString().split("T")[0];
const nowStr = () => new Date().toISOString();
const fmtDate = d => { if (!d) return ""; return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };
const daysSince = d => Math.floor((Date.now() - new Date(d)) / 86400000);

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const STAGES = [
  { id: "new_enquiry",    label: "New Enquiry",   color: "#fdcb6e" },
  { id: "replied",        label: "Replied",        color: "#6c5ce7" },
  { id: "interested",     label: "Interested",     color: "#0984e3" },
  { id: "meet_arranged",  label: "Meet Arranged",  color: "#00b894" },
  { id: "met",            label: "Met",            color: "#00b894" },
  { id: "active",         label: "Active Client",  color: "#00b894" },
  { id: "gone_quiet",     label: "Gone Quiet",     color: "#e17055" },
  { id: "not_proceeding", label: "Not Proceeding", color: "#555"    },
];
const STAGE_MAP = Object.fromEntries(STAGES.map(s => [s.id, s]));
const PLATFORMS = ["Rover", "Bark", "Direct", "Other"];
const SERVICES = [
  { id: "dog_walk",  label: "Dog Walk",    icon: "🦮" },
  { id: "drop_in",   label: "Dog Drop-in", icon: "🐕" },
  { id: "cat_visit", label: "Cat Visit",   icon: "🐱" },
  { id: "home_sit",  label: "Home Sit",    icon: "🏡" },
  { id: "stay_over", label: "Stay Over",   icon: "🌙" },
];
const SERVICE_MAP = Object.fromEntries(SERVICES.map(s => [s.id, s]));

const ENQUIRY_TYPES = [
  { id: "new_client",      label: "New Client",       icon: "👋", color: "#6c5ce7", desc: "Someone reaching out for the first time" },
  { id: "existing_client", label: "Existing Client",  icon: "🐾", color: "#00b894", desc: "A client you already walk for" },
  { id: "quote",           label: "Price Enquiry",    icon: "💷", color: "#fdcb6e", desc: "They want to know what you charge" },
  { id: "confirm",         label: "General Response", icon: "💬", color: "#0984e3", desc: "Follow ups, anything else" },
  { id: "decline",         label: "Turn Down a Job",  icon: "🙏", color: "#e17055", desc: "Can't take it — be kind about it" },
];

const FIELD_LABELS = {
  client_name: { label: "Client name",   icon: "👤" },
  dog_name:    { label: "Dog name(s)",   icon: "🐕" },
  service:     { label: "Service",       icon: "🦮" },
  dates:       { label: "Dates / times", icon: "📅" },
  location:    { label: "Location",      icon: "📍" },
  rate:        { label: "Rate / price",  icon: "💷" },
  recurring:   { label: "Regular work?", icon: "🔁" },
  notes:       { label: "Other notes",   icon: "📝" },
};

const SYSTEM_PROMPTS = {
  new_client: `You are a communication coach helping Freddie, a professional young dog walker in Winchester, reply to a new client enquiry.

Rules for the DRAFT REPLY:
- Be warm, friendly and professional
- Structure the reply in this exact priority order:
  1. Thank them and express interest
  2. If location is unknown, ask for it naturally
  3. If dates or times are unknown, ask for them naturally
  4. If platform is "Direct" or "Other" AND rate has not been agreed, mention the rate clearly. If platform is "Rover" or "Bark" NEVER mention rate — it is handled by the platform
  5. THEN suggest a short meet-and-greet naturally
  6. Close warmly
- Never invent or guess a rate — only use one if explicitly provided
- Sign off as Freddie. Use British English.

Format with ONLY these two sections:
DRAFT REPLY
QUESTIONS TO ASK`,

  existing_client: `You are helping Freddie, a professional dog walker, reply to an existing client.
Skip all introductions and meet-and-greet suggestions. Warm, efficient, professional.
Sign off as Freddie. Use British English.
Format with ONLY:
DRAFT REPLY`,

  quote: `You are helping Freddie respond to a price enquiry. State the rate clearly and confidently.
If platform is Rover or Bark, NEVER mention rate.
Sign off as Freddie. Use British English.
Format with ONLY:
DRAFT REPLY
WHAT TO MENTION`,

  confirm: `You are helping Freddie send a general response. Cover agreed details.
Sign off as Freddie. Use British English.
Format with ONLY:
DRAFT REPLY
MISSING INFO TO GET`,

  decline: `You are helping Freddie politely decline a job. Be kind and brief. Do not burn bridges.
Sign off as Freddie. Use British English.
Format with ONLY:
DRAFT REPLY
ONE TIP`,
};

/* ─────────────────────────────────────────────
   AI HELPERS
───────────────────────────────────────────── */
async function callClaude(prompt, maxTokens = 1200) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const r = await fetch("/api/chat", {
      method: "POST", signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] }),
    });
    clearTimeout(timeout);
    if (!r.ok) throw new Error("API " + r.status);
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    return d.content?.[0]?.text || "";
  } catch (e) { clearTimeout(timeout); throw e; }
}

async function callClaudeJSON(prompt) {
  const text = await callClaude(prompt, 1200);
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); } catch { return {}; }
}

function parseSections(text) {
  const sections = [];
  const patterns = [
    { key: "draft",  labels: ["DRAFT REPLY"] },
    { key: "extra1", labels: ["QUESTIONS TO ASK", "WHAT TO MENTION", "MISSING INFO TO GET", "ONE TIP"] },
  ];
  for (const p of patterns) {
    for (const label of p.labels) {
      const idx = text.toUpperCase().indexOf(label);
      if (idx !== -1) {
        let content = text.slice(idx + label.length).replace(/^[\s:*#-]+/, "");
        const next = content.search(/\n[A-Z][A-Z ]{2,}(\n|:)/);
        if (next !== -1) content = content.slice(0, next);
        sections.push({ key: p.key, label, content: content.trim() });
        break;
      }
    }
  }
  if (!sections.length) sections.push({ key: "draft", label: "RESPONSE", content: text.trim() });
  return sections;
}

/* ─────────────────────────────────────────────
   CHASE LOGIC
───────────────────────────────────────────── */
function computeActions(people) {
  const actions = [];
  for (const p of people) {
    if (p.stage === "not_proceeding") continue;
    const msgs = p.messages || [];
    const lastOut = [...msgs].reverse().find(m => m.role === "freddie");
    const lastIn  = [...msgs].reverse().find(m => m.role === "client");
    const unreplied = lastIn && (!lastOut || lastIn.date > lastOut.date);
    if (unreplied && (Date.now() - new Date(lastIn.date)) / 3600000 > 12)
      actions.push({ personId: p.id, type: "reply", label: `Reply to ${p.name || "someone"}`, urgency: "high", stage: p.stage });
    if (p.stage === "new_enquiry")
      actions.push({ personId: p.id, type: "reply_new", label: `Reply to ${p.name || "new enquiry"}`, urgency: "high", stage: p.stage });
    if (p.stage === "replied" && daysSince(p.lastActionDate || p.createdAt) >= 1)
      actions.push({ personId: p.id, type: "chase", label: `Chase ${p.name} — no reply for ${daysSince(p.lastActionDate || p.createdAt)}d`, urgency: "medium", stage: p.stage });
    if (p.stage === "interested" && daysSince(p.lastActionDate || p.createdAt) >= 1)
      actions.push({ personId: p.id, type: "arrange_meet", label: `Arrange meet with ${p.name}`, urgency: "medium", stage: p.stage });
    if (p.stage === "meet_arranged" && daysSince(p.lastActionDate || p.createdAt) >= 2)
      actions.push({ personId: p.id, type: "chase", label: `Chase ${p.name} — meet booked but gone quiet`, urgency: "medium", stage: p.stage });
    if (p.stage === "met" && daysSince(p.lastActionDate || p.createdAt) >= 1)
      actions.push({ personId: p.id, type: "chase_booking", label: `Follow up ${p.name} — met but no booking yet`, urgency: "medium", stage: p.stage });
  }
  return actions;
}

/* ─────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────── */
function StagePill({ stageId }) {
  const s = STAGE_MAP[stageId] || { label: stageId, color: "#555" };
  return <span className="stage-pill" style={{ background: s.color + "22", color: s.color }}>{s.label}</span>;
}
function Spinner({ large }) { return <div className={`spinner${large ? " spinner-lg" : ""}`} />; }
function BackBtn({ onBack, label = "Back" }) { return <div className="back-btn" onClick={onBack}>← {label}</div>; }
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className="btn btn-ghost mt-8" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      {copied ? "✓ Copied!" : "📋 Copy to clipboard"}
    </button>
  );
}
function Chip({ label, active, color = "purple", onClick }) {
  return <button className={`chip${active ? ` active-${color}` : ""}`} onClick={onClick}>{label}</button>;
}
function CheckBox({ done, onToggle }) {
  return <div className={`check-box${done ? " done" : ""}`} onClick={onToggle}>{done && <span style={{ color: "#001a12", fontSize: 13, fontWeight: 800 }}>✓</span>}</div>;
}

/* ─────────────────────────────────────────────
   MESSAGING FLOW
───────────────────────────────────────────── */
function MessagingFlow({ person, onBack, onPersonUpdated }) {
  const [screen, setScreen] = useState(() => (person?.messages?.length) ? "thread" : "type");
  const [enquiryType, setEnquiryType] = useState(null);
  const [platform, setPlatform] = useState(person?.platform || "Rover");
  const [rawMessage, setRawMessage] = useState("");
  const [extracted, setExtracted] = useState({});
  const [dynamicQs, setDynamicQs] = useState([]);
  const [qStep, setQStep] = useState(0);
  const [qAnswers, setQAnswers] = useState({});
  const [qInput, setQInput] = useState("");
  const [sections, setSections] = useState([]);
  const [draftText, setDraftText] = useState("");
  const [followUpMsg, setFollowUpMsg] = useState("");
  const [toast, setToast] = useState(null);
  const [currentPerson, setCurrentPerson] = useState(person);
  const inputRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const typeColor = enquiryType?.color || "#6c5ce7";

  const savePerson = (updates) => {
    const people = db.getAll("people");
    const existing = people.find(p => p.id === currentPerson?.id);
    if (existing) {
      const merged = { ...existing, ...updates };
      db.upsert("people", merged);
      setCurrentPerson(merged);
      onPersonUpdated?.();
      return merged;
    } else {
      const newP = { id: uid(), createdAt: nowStr(), lastActionDate: nowStr(), stage: "new_enquiry", messages: [], ...updates };
      db.upsert("people", newP);
      setCurrentPerson(newP);
      onPersonUpdated?.();
      return newP;
    }
  };

  const analyseMessage = async () => {
    if (!rawMessage.trim()) return;
    setScreen("analysing");
    const prompt = `You are helping Freddie, a dog walker, analyse an enquiry on ${platform}.
Enquiry type: ${enquiryType.label}
Message: """${rawMessage}"""

Extract all visible info. Identify what is genuinely missing.
Reply with ONLY valid JSON:
{
  "extracted": { "client_name": null, "dog_name": null, "service": null, "dates": null, "location": null, "rate": null, "recurring": null, "notes": null },
  "questions": [{ "field": "field_name", "question": "friendly question", "hint": "short hint", "required": true }]
}
Rules:
- Only ask about genuinely missing fields
- dog_name: if missing, hint "Check the ${platform} profile or type unknown", required: false
- location: if missing, required: true
- rate: ONLY ask if platform is "Direct" or "Other". NEVER for Rover or Bark
${enquiryType.id === "existing_client" ? "- Existing client — minimal questions, skip rate/service" : ""}
- questions can be empty []`;
    try {
      const result = await callClaudeJSON(prompt);
      setExtracted(result.extracted || {});
      setDynamicQs(result.questions || []);
      setQStep(0); setQAnswers({});
      setScreen("summary");
    } catch { setScreen("error"); }
  };

  const generateReply = async (finalAnswers) => {
    setScreen("loading");
    const allData = { ...extracted, ...finalAnswers };
    const context = Object.entries(allData).filter(([, v]) => v && v !== "null").map(([k, v]) => `${k}: ${v}`).join("\n");
    const history = (currentPerson?.messages || []).map(m => `${m.role === "client" ? "Client" : "Freddie"}: ${m.text || m.draft}`).join("\n\n");

    const prompt = `${SYSTEM_PROMPTS[enquiryType.id]}
Platform: ${platform}
Original message: ${rawMessage}
${history ? `\nConversation so far:\n${history}` : ""}
Known information:\n${context || "(none)"}`;

    try {
      const raw = await callClaude(prompt, 1000);
      const parsed = parseSections(raw);
      const draftSection = parsed.find(s => s.key === "draft");
      setSections(parsed);
      setDraftText(draftSection?.content || raw);

      const clientMsg = { role: "client", text: rawMessage, date: nowStr() };
      const extra = parsed.find(s => s.key === "extra1");
      const freddieMsg = { role: "freddie", draft: draftSection?.content || raw, questions: extra?.content || null, questionsLabel: extra?.label || null, date: nowStr() };

      const name = allData.client_name && allData.client_name !== "null" ? allData.client_name : currentPerson?.name || "Unknown";
      savePerson({
        name,
        platform,
        stage: currentPerson?.stage === "new_enquiry" ? "replied" : (currentPerson?.stage || "replied"),
        lastActionDate: nowStr(),
        extracted: allData,
        messages: [...(currentPerson?.messages || []), clientMsg, freddieMsg],
        serviceType: allData.service || currentPerson?.serviceType,
        address: allData.location || currentPerson?.address,
      });
      setScreen("result");
    } catch { setScreen("error"); }
  };

  const generateFollowUp = async () => {
    if (!followUpMsg.trim() || !currentPerson) return;
    setScreen("loading");
    const history = (currentPerson.messages || []).map(m => `${m.role === "client" ? "Client" : "Freddie"}: ${m.text || m.draft}`).join("\n\n");
    const known = Object.entries(currentPerson.extracted || {}).filter(([, v]) => v && v !== "null").map(([k, v]) => `${k}: ${v}`).join("\n");

    const prompt = `You are helping Freddie, a dog walker, reply to a follow-up message.
Conversation so far:\n${history}
Client's latest message: "${followUpMsg}"
Known about this client:\n${known || "(not much yet)"}
Write a warm, natural reply. Don't re-introduce. Sign off as Freddie. British English.
Format with:
DRAFT REPLY
ONE TIP`;

    try {
      const raw = await callClaude(prompt, 1000);
      const parsed = parseSections(raw);
      const draftSection = parsed.find(s => s.key === "draft");
      setSections(parsed);
      setDraftText(draftSection?.content || raw);
      const clientMsg = { role: "client", text: followUpMsg, date: nowStr() };
      const extra = parsed.find(s => s.key === "extra1");
      const freddieMsg = { role: "freddie", draft: draftSection?.content || raw, questions: extra?.content || null, date: nowStr() };
      savePerson({ messages: [...(currentPerson.messages || []), clientMsg, freddieMsg], lastActionDate: nowStr() });
      setFollowUpMsg("");
      setScreen("result");
    } catch { showToast("Couldn't generate — try again"); setScreen("thread"); }
  };

  const nextQ = () => {
    if (!qInput.trim()) return;
    const q = dynamicQs[qStep];
    const next = { ...qAnswers, [q.field]: qInput.trim() };
    setQAnswers(next); setQInput("");
    if (qStep < dynamicQs.length - 1) { setQStep(q => q + 1); setTimeout(() => inputRef.current?.focus(), 80); }
    else generateReply(next);
  };

  const skipQ = () => {
    const q = dynamicQs[qStep];
    const next = { ...qAnswers, [q.field]: "unknown" };
    setQAnswers(next); setQInput("");
    if (qStep < dynamicQs.length - 1) setQStep(q => q + 1);
    else generateReply(next);
  };

  const currentQ = dynamicQs[qStep];

  /* ── THREAD */
  if (screen === "thread") {
    const msgs = currentPerson?.messages || [];
    return (
      <div className="fade-up">
        <BackBtn onBack={onBack} />
        <div style={{ padding: "0 16px 16px" }}>

          {/* What we know */}
          {currentPerson?.extracted && Object.values(currentPerson.extracted).some(v => v && v !== "null") && (
            <>
              <div className="section-label">WHAT WE KNOW</div>
              <div className="card" style={{ marginLeft: 0, marginRight: 0 }}>
                {Object.entries(FIELD_LABELS).map(([field, meta]) => {
                  const val = currentPerson.extracted[field];
                  if (!val || val === "null") return null;
                  return (
                    <div key={field} className="found-row">
                      <span style={{ fontSize: 16, width: 22, flexShrink: 0 }}>{meta.icon}</span>
                      <div className="flex-1">
                        <div style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{meta.label}</div>
                        <div style={{ fontSize: 13, color: "#c8d0f0", marginTop: 2 }}>{val}</div>
                      </div>
                      <span className="text-green">✓</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Conversation */}
          {msgs.length > 0 && <>
            <div className="section-label mt-16">CONVERSATION</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {msgs.map((msg, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: "var(--muted2)", marginBottom: 5, textAlign: msg.role === "freddie" ? "right" : "left" }}>
                    {msg.role === "client" ? currentPerson?.name || "Client" : "Freddie"} · {fmtDate(msg.date)}
                  </div>
                  {msg.role === "client" ? (
                    <div className="bubble-in">{msg.text}</div>
                  ) : (
                    <div>
                      <div className="bubble-out" style={{ whiteSpace: "pre-wrap" }}>{msg.draft || msg.text}</div>
                      {msg.questions && (
                        <div className="double-check-box" style={{ marginLeft: "auto", maxWidth: "82%" }}>
                          <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>✅ Double check you've asked</div>
                          <div style={{ fontSize: 12, color: "#a8d5b5", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.questions}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>}

          {/* Follow-up */}
          <div className="card mt-16" style={{ marginLeft: 0, marginRight: 0 }}>
            <div className="section-label" style={{ paddingLeft: 0, marginTop: 0 }}>THEIR LATEST MESSAGE</div>
            <div className="text-sm text-muted mb-8">Paste their reply — I'll draft a response with full context.</div>
            <textarea className="input" rows={4} value={followUpMsg} onChange={e => setFollowUpMsg(e.target.value)} placeholder="Paste their latest message here..." />
            <button className="btn btn-primary mt-8" disabled={!followUpMsg.trim()} style={{ opacity: followUpMsg.trim() ? 1 : 0.4 }} onClick={generateFollowUp}>Generate Follow-up ✨</button>
          </div>

          {/* New message type */}
          <div className="section-label mt-16">NEW MESSAGE TYPE</div>
          {ENQUIRY_TYPES.map(t => (
            <div key={t.id} className="type-card" onClick={() => { setEnquiryType(t); setRawMessage(""); setScreen("paste"); }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: t.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{t.icon}</div>
              <div className="flex-1"><div style={{ fontWeight: 600, fontSize: 14 }}>{t.label}</div><div className="text-xs text-muted">{t.desc}</div></div>
              <span className="text-muted">›</span>
            </div>
          ))}
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  /* ── TYPE */
  if (screen === "type") {
    return (
      <div className="fade-up">
        <BackBtn onBack={onBack} />
        <div style={{ padding: "0 16px 24px" }}>
          <div className="page-title mb-4">New Message</div>
          <div className="page-sub mb-16">What kind of message is this?</div>
          {ENQUIRY_TYPES.map(t => (
            <div key={t.id} className="type-card" onClick={() => { setEnquiryType(t); setScreen(person?.platform ? "paste" : "platform"); }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: t.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
              <div className="flex-1"><div style={{ fontWeight: 700, fontSize: 15 }}>{t.label}</div><div className="text-sm text-muted">{t.desc}</div></div>
              <span style={{ color: t.color, fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── PLATFORM */
  if (screen === "platform") {
    return (
      <div className="fade-up">
        <BackBtn onBack={() => setScreen("type")} />
        <div style={{ padding: "0 16px 24px" }}>
          <div className="page-title mb-4">Which Platform?</div>
          <div className="page-sub mb-16">Where did they message Freddie?</div>
          {PLATFORMS.map(p => (
            <div key={p} className="type-card" onClick={() => { setPlatform(p); setScreen("paste"); }}>
              <div style={{ fontWeight: 700, fontSize: 16, flex: 1 }}>{p}</div>
              {(p === "Rover" || p === "Bark") && <span className="badge badge-muted">Platform sets rates</span>}
              <span className="text-muted">›</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── PASTE */
  if (screen === "paste") {
    return (
      <div className="fade-up">
        <BackBtn onBack={() => setScreen(person?.platform ? "type" : "platform")} />
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: 11, color: typeColor, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>STEP 1 OF 3 — THE MESSAGE</div>
          <div className="page-title mb-4">Paste their message</div>
          <div className="page-sub mb-16">Copy from {platform} and paste here. More detail = fewer questions.</div>
          <textarea ref={inputRef} className="input" rows={7} value={rawMessage} onChange={e => setRawMessage(e.target.value)} placeholder={`Paste the message from ${platform} here...`} autoFocus />
          <button className="btn btn-primary mt-12" disabled={!rawMessage.trim()} style={{ background: rawMessage.trim() ? typeColor : undefined, opacity: rawMessage.trim() ? 1 : 0.4 }} onClick={analyseMessage}>
            Analyse Message →
          </button>
        </div>
      </div>
    );
  }

  /* ── ANALYSING */
  if (screen === "analysing") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
        <Spinner large />
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, color: "var(--muted)" }}>READING THE MESSAGE...</div>
        <div className="text-sm text-muted">Working out what I know and what to ask</div>
      </div>
    );
  }

  /* ── SUMMARY */
  if (screen === "summary") {
    const foundCount = Object.values(extracted).filter(v => v && v !== "null").length;
    return (
      <div className="fade-up">
        <BackBtn onBack={() => setScreen("paste")} />
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: 11, color: typeColor, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>STEP 2 OF 3 — WHAT I FOUND</div>
          <div className="page-title mb-4">Here's what I got</div>
          <div className="page-sub mb-16">Review, then I'll ask for anything missing.</div>

          <div className="card" style={{ marginLeft: 0, marginRight: 0, marginBottom: 14 }}>
            {foundCount === 0
              ? <div className="text-sm text-muted">Couldn't extract much — questions will fill in the gaps.</div>
              : Object.entries(FIELD_LABELS).map(([field, meta]) => {
                const val = extracted[field];
                if (!val || val === "null") return null;
                return (
                  <div key={field} className="found-row">
                    <span style={{ fontSize: 18, width: 26, flexShrink: 0 }}>{meta.icon}</span>
                    <div className="flex-1">
                      <div style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{meta.label}</div>
                      <div style={{ fontSize: 14, color: "#c8d0f0", marginTop: 2 }}>{val}</div>
                    </div>
                    <span className="text-green" style={{ fontSize: 16 }}>✓</span>
                  </div>
                );
              })
            }
            {dynamicQs.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Still need ({dynamicQs.length})</div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {dynamicQs.map(q => <span key={q.field} className="missing-chip">{FIELD_LABELS[q.field]?.icon} {FIELD_LABELS[q.field]?.label || q.field}</span>)}
                </div>
              </div>
            )}
            {dynamicQs.length === 0 && (
              <div style={{ marginTop: 12, background: "rgba(0,184,148,0.08)", border: "1px solid rgba(0,184,148,0.2)", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                Got everything — ready to generate!
              </div>
            )}
          </div>

          <button className="btn btn-primary" style={{ background: typeColor }} onClick={() => dynamicQs.length > 0 ? setScreen("questions") : generateReply({})}>
            {dynamicQs.length > 0 ? `Answer ${dynamicQs.length} question${dynamicQs.length !== 1 ? "s" : ""} →` : "Generate Reply ✨"}
          </button>
        </div>
      </div>
    );
  }

  /* ── QUESTIONS */
  if (screen === "questions" && currentQ) {
    return (
      <div className="fade-up">
        <BackBtn onBack={() => qStep === 0 ? setScreen("summary") : setQStep(q => q - 1)} />
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: 11, color: typeColor, fontWeight: 700, letterSpacing: 0.5, marginBottom: 12 }}>QUESTION {qStep + 1} OF {dynamicQs.length}</div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${(qStep / dynamicQs.length) * 100}%`, background: typeColor }} /></div>
          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>{currentQ.question}</div>
          <div className="text-sm text-muted mb-16">{currentQ.hint}</div>
          <input ref={inputRef} className="input" type="text" value={qInput} onChange={e => setQInput(e.target.value)} placeholder="Your answer..." onKeyDown={e => e.key === "Enter" && nextQ()} autoFocus />
          {qStep > 0 && (
            <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--bg)", borderRadius: 8 }}>
              {dynamicQs.slice(0, qStep).map(q => (
                <div key={q.field} className="text-xs text-muted">{FIELD_LABELS[q.field]?.label || q.field}: <span style={{ color: "var(--text)" }}>{qAnswers[q.field]}</span></div>
              ))}
            </div>
          )}
          <div className="btn-row mt-12" style={{ padding: 0 }}>
            {!currentQ.required && <button className="btn btn-ghost" onClick={skipQ}>Skip</button>}
            <button className="btn btn-primary" disabled={!qInput.trim()} style={{ background: qInput.trim() ? typeColor : undefined, opacity: qInput.trim() ? 1 : 0.4 }} onClick={nextQ}>
              {qStep === dynamicQs.length - 1 ? "Generate Reply ✨" : "Next →"}
            </button>
          </div>
          <div className="text-xs text-muted mt-8" style={{ textAlign: "center" }}>Press Enter to continue</div>
        </div>
      </div>
    );
  }

  /* ── LOADING */
  if (screen === "loading") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
        <Spinner large />
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, color: "var(--muted)" }}>CRAFTING YOUR REPLY...</div>
        <div className="text-sm text-muted">Putting it all together</div>
      </div>
    );
  }

  /* ── ERROR */
  if (screen === "error") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 44 }}>⚠️</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "var(--orange)" }}>SOMETHING WENT WRONG</div>
        <div className="text-sm text-muted">Could not generate the reply — usually temporary. Try again.</div>
        <button className="btn btn-primary" onClick={() => generateReply(qAnswers)}>Try Again</button>
        <button className="btn btn-ghost mt-4" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  /* ── RESULT */
  if (screen === "result" && sections.length > 0) {
    const extra = sections.find(s => s.key === "extra1");
    return (
      <div className="fade-up">
        <BackBtn onBack={() => setScreen("thread")} label="View Thread" />
        <div style={{ padding: "0 16px 24px" }}>
          <div className="row mb-16">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: typeColor + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{enquiryType?.icon}</div>
            <div><div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 1, color: typeColor }}>{enquiryType?.label}</div><div className="text-xs text-muted">{platform} · {new Date().toLocaleDateString("en-GB")}</div></div>
          </div>

          <div className="section-label" style={{ paddingLeft: 0, marginTop: 0 }}>DRAFT REPLY</div>
          <div className="text-xs text-muted mb-8">Tap to edit before copying</div>
          <textarea className="draft-box" value={draftText} onChange={e => setDraftText(e.target.value)} rows={9} />
          <CopyBtn text={draftText} />

          {extra && (
            <div className="double-check-box mt-12">
              <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>✅ Double check you've asked</div>
              <div style={{ fontSize: 13, color: "#a8d5b5", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{extra.content}</div>
            </div>
          )}

          <div className="btn-row mt-16" style={{ padding: 0 }}>
            <button className="btn btn-ghost" onClick={() => setScreen("thread")}>View Thread</button>
            <button className="btn btn-ghost" onClick={onBack}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ─────────────────────────────────────────────
   DOG WIZARD
───────────────────────────────────────────── */
function DogWizard({ personId, existingDog, onSave, onBack }) {
  const init = existingDog || { id: uid(), personId, name: "", breed: "", age: "", size: "", goodWithDogs: "", goodOnLead: "", healthIssues: "No", healthNotes: "", spooks: "", vet: "", vetPhone: "", personality: "", meetGreetResult: "" };
  const [dog, setDog] = useState(init);
  const [step, setStep] = useState(0);
  const set = (k, v) => setDog(d => ({ ...d, [k]: v }));
  const steps = [
    { title: "Dog's Name", body: <input className="input" placeholder="e.g. Buddy" value={dog.name} onChange={e => set("name", e.target.value)} style={{ fontSize: 20, fontWeight: 700 }} />, valid: !!dog.name.trim() },
    { title: "Breed & Age", body: <><div className="input-group"><div className="input-label">Breed</div><input className="input" placeholder="e.g. Labrador" value={dog.breed} onChange={e => set("breed", e.target.value)} /></div><div className="input-group"><div className="input-label">Age</div><input className="input" placeholder="e.g. 3 years" value={dog.age} onChange={e => set("age", e.target.value)} /></div></>, valid: true },
    { title: "Size", body: <div className="chip-row">{["S","M","L"].map(s => <Chip key={s} label={s==="S"?"Small":s==="M"?"Medium":"Large"} active={dog.size===s} onClick={() => set("size",s)} />)}</div>, valid: !!dog.size },
    { title: "Good with other dogs?", body: <div className="chip-row">{["Yes","No","Unpredictable"].map(v => <Chip key={v} label={v} active={dog.goodWithDogs===v} color={v==="Yes"?"green":v==="No"?"orange":"yellow"} onClick={() => set("goodWithDogs",v)} />)}</div>, valid: !!dog.goodWithDogs },
    { title: "Good on lead?", body: <div className="chip-row">{["Yes","Fine","Pulls"].map(v => <Chip key={v} label={v} active={dog.goodOnLead===v} color={v==="Yes"?"green":v==="Pulls"?"orange":"purple"} onClick={() => set("goodOnLead",v)} />)}</div>, valid: !!dog.goodOnLead },
    { title: "Any health issues?", body: <><div className="chip-row mb-8">{["No","Yes"].map(v => <Chip key={v} label={v} active={dog.healthIssues===v} color={v==="No"?"green":"orange"} onClick={() => set("healthIssues",v)} />)}</div>{dog.healthIssues==="Yes"&&<textarea className="input" rows={3} placeholder="Describe..." value={dog.healthNotes} onChange={e => set("healthNotes",e.target.value)} />}</>, valid: !!dog.healthIssues },
    { title: "Anything that spooks them?", body: <textarea className="input" rows={3} placeholder="e.g. loud noises, bikes... (optional)" value={dog.spooks} onChange={e => set("spooks",e.target.value)} />, valid: true },
    { title: "Vet details", body: <><div className="input-group"><div className="input-label">Vet name</div><input className="input" placeholder="e.g. Winchester Vets" value={dog.vet} onChange={e => set("vet",e.target.value)} /></div><div className="input-group"><div className="input-label">Vet phone</div><input className="input" type="tel" placeholder="01962..." value={dog.vetPhone} onChange={e => set("vetPhone",e.target.value)} /></div></>, valid: true },
    { title: "Personality notes", body: <textarea className="input" rows={4} placeholder="What's their character like? (optional)" value={dog.personality} onChange={e => set("personality",e.target.value)} />, valid: true },
    { title: "How did the meet & greet go?", body: <div className="chip-row">{["Great","Fine","Concerns"].map(v => <Chip key={v} label={v} active={dog.meetGreetResult===v} color={v==="Great"?"green":v==="Fine"?"purple":"orange"} onClick={() => set("meetGreetResult",v)} />)}</div>, valid: true },
  ];
  const s = steps[step]; const isLast = step === steps.length - 1;
  return (
    <div>
      <BackBtn onBack={step === 0 ? onBack : () => setStep(p => p - 1)} />
      <div style={{ padding: "0 16px 24px" }}>
        <div style={{ fontSize: 11, color: "var(--purple)", fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>{step + 1} OF {steps.length}</div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${(step / steps.length) * 100}%` }} /></div>
        <div className="page-title mb-16">{s.title}</div>
        {s.body}
        <button className="btn btn-primary mt-16" disabled={!s.valid} onClick={() => { if (isLast) { db.upsert("dogs", dog); onSave(dog); } else setStep(p => p + 1); }}>
          {isLast ? "Save Dog ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CAT WIZARD
───────────────────────────────────────────── */
function CatWizard({ personId, existingCat, onSave, onBack }) {
  const init = existingCat || { id: uid(), personId, name: "", age: "", indoorOutdoor: "", feedingRoutine: "", litterNotes: "", medication: "No", medicationNotes: "", personality: "" };
  const [cat, setCat] = useState(init);
  const [step, setStep] = useState(0);
  const set = (k, v) => setCat(c => ({ ...c, [k]: v }));
  const steps = [
    { title: "Cat's Name", body: <input className="input" placeholder="e.g. Mochi" value={cat.name} onChange={e => set("name",e.target.value)} style={{ fontSize: 20, fontWeight: 700 }} />, valid: !!cat.name.trim() },
    { title: "Age", body: <input className="input" placeholder="e.g. 4 years" value={cat.age} onChange={e => set("age",e.target.value)} />, valid: true },
    { title: "Indoor / Outdoor?", body: <div className="chip-row">{["Indoor","Outdoor","Both"].map(v => <Chip key={v} label={v} active={cat.indoorOutdoor===v} onClick={() => set("indoorOutdoor",v)} />)}</div>, valid: !!cat.indoorOutdoor },
    { title: "Feeding routine", body: <textarea className="input" rows={3} placeholder="e.g. Wet food twice a day..." value={cat.feedingRoutine} onChange={e => set("feedingRoutine",e.target.value)} />, valid: true },
    { title: "Litter notes", body: <textarea className="input" rows={3} placeholder="e.g. Litter tray in bathroom..." value={cat.litterNotes} onChange={e => set("litterNotes",e.target.value)} />, valid: true },
    { title: "Any medication?", body: <><div className="chip-row mb-8">{["No","Yes"].map(v => <Chip key={v} label={v} active={cat.medication===v} color={v==="No"?"green":"orange"} onClick={() => set("medication",v)} />)}</div>{cat.medication==="Yes"&&<textarea className="input" rows={3} placeholder="What and how often?" value={cat.medicationNotes} onChange={e => set("medicationNotes",e.target.value)} />}</>, valid: true },
    { title: "Personality notes", body: <textarea className="input" rows={4} placeholder="What are they like? (optional)" value={cat.personality} onChange={e => set("personality",e.target.value)} />, valid: true },
  ];
  const s = steps[step]; const isLast = step === steps.length - 1;
  return (
    <div>
      <BackBtn onBack={step === 0 ? onBack : () => setStep(p => p - 1)} />
      <div style={{ padding: "0 16px 24px" }}>
        <div style={{ fontSize: 11, color: "var(--purple)", fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>{step + 1} OF {steps.length}</div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${(step / steps.length) * 100}%` }} /></div>
        <div className="page-title mb-16">{s.title}</div>
        {s.body}
        <button className="btn btn-primary mt-16" disabled={!s.valid} onClick={() => { if (isLast) { db.upsert("cats", cat); onSave(cat); } else setStep(p => p + 1); }}>
          {isLast ? "Save Cat ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PERSON DETAIL
───────────────────────────────────────────── */
function PersonDetail({ personId, onBack, onUpdate }) {
  const [view, setView] = useState("profile");
  const [selectedDog, setSelectedDog] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showMoveStage, setShowMoveStage] = useState(false);
  const [tick, setTick] = useState(0);

  const person = db.getAll("people").find(p => p.id === personId);
  const dogs = db.getAll("dogs").filter(d => d.personId === personId);
  const cats = db.getAll("cats").filter(c => c.personId === personId);
  const visits = db.getAll("visits").filter(v => v.personId === personId).sort((a, b) => b.date.localeCompare(a.date));

  if (!person) return <div><BackBtn onBack={onBack} /><div style={{ padding: 24 }} className="text-muted">Not found</div></div>;

  const refresh = () => { setTick(t => t + 1); onUpdate?.(); };

  const moveStage = (stageId) => {
    const all = db.getAll("people");
    const idx = all.findIndex(p => p.id === personId);
    if (idx >= 0) { all[idx].stage = stageId; all[idx].lastActionDate = nowStr(); db.set("people", all); }
    setShowMoveStage(false); refresh();
  };

  const togglePaid = (visitId) => {
    const all = db.getAll("visits");
    const idx = all.findIndex(v => v.id === visitId);
    if (idx >= 0) { all[idx].paid = !all[idx].paid; db.set("visits", all); refresh(); }
  };

  if (view === "message") return <MessagingFlow person={person} onBack={() => { setView("profile"); refresh(); }} onPersonUpdated={refresh} />;
  if (view === "add_dog" || selectedDog) return <DogWizard personId={personId} existingDog={selectedDog} onSave={() => { setSelectedDog(null); setView("profile"); refresh(); }} onBack={() => { setSelectedDog(null); setView("profile"); }} />;
  if (view === "add_cat" || selectedCat) return <CatWizard personId={personId} existingCat={selectedCat} onSave={() => { setSelectedCat(null); setView("profile"); refresh(); }} onBack={() => { setSelectedCat(null); setView("profile"); }} />;

  return (
    <div key={tick}>
      {showMoveStage && (
        <div className="modal-overlay" onClick={() => setShowMoveStage(false)}>
          <div className="modal-sheet">
            <div className="modal-handle" />
            <div className="modal-title">Move Stage</div>
            {STAGES.map(s => (
              <div key={s.id} className="card card-tap" onClick={() => moveStage(s.id)}>
                <div className="row-between"><span style={{ fontWeight: 600 }}>{s.label}</span>{person.stage === s.id && <span className="text-green">✓</span>}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <BackBtn onBack={onBack} />
      <div style={{ padding: "0 16px 8px" }}>
        <div className="row-between mb-8">
          <div><div className="page-title">{person.name || "Unknown"}</div><div className="page-sub">{person.address || person.extracted?.location || ""}</div></div>
          <StagePill stageId={person.stage} />
        </div>
      </div>

      <div className="btn-row">
        <button className="btn btn-primary btn-sm" onClick={() => setView("message")}>💬 Message</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowMoveStage(true)}>Stage</button>
        {person.stage !== "active" && <button className="btn btn-green btn-sm" onClick={() => moveStage("active")}>Make Active ✓</button>}
      </div>

      {/* Contact */}
      <div className="section-label">Contact</div>
      <div className="card">
        {[["📞", person.phone], ["🏠", person.address || person.extracted?.location], ["📮", person.postcode], ["📱", person.platform], ["💷", person.rate ? `£${person.rate}/walk` : null]].filter(([,v]) => v).map(([icon, val], i) => (
          <div key={i} className="row mt-4"><span style={{ fontSize: 14, minWidth: 20 }}>{icon}</span><span className="text-sm">{val}</span></div>
        ))}
        {person.notes && <div className="text-sm text-muted mt-8">{person.notes}</div>}
      </div>

      {/* From messages */}
      {person.extracted && Object.values(person.extracted).some(v => v && v !== "null") && (
        <>
          <div className="section-label">From Messages</div>
          <div className="card">
            {Object.entries(FIELD_LABELS).map(([field, meta]) => {
              const val = person.extracted[field];
              if (!val || val === "null") return null;
              return <div key={field} className="row mt-4"><span style={{ fontSize: 14, minWidth: 20 }}>{meta.icon}</span><div><div className="text-xs text-muted">{meta.label}</div><div className="text-sm">{val}</div></div></div>;
            })}
          </div>
        </>
      )}

      {/* Dogs */}
      {dogs.length > 0 && <><div className="section-label">Dogs</div>{dogs.map(dog => (
        <div key={dog.id} className="card card-tap" onClick={() => setSelectedDog(dog)}>
          <div className="row-between"><div><div style={{ fontWeight: 600 }}>🐕 {dog.name}</div><div className="text-sm text-muted">{dog.breed} · {dog.age}</div><div className="row mt-4" style={{ gap: 6 }}>{dog.size && <span className="badge badge-muted">{dog.size==="S"?"Small":dog.size==="M"?"Medium":"Large"}</span>}{dog.goodWithDogs && <span className={`badge ${dog.goodWithDogs==="Yes"?"badge-green":dog.goodWithDogs==="No"?"badge-orange":"badge-yellow"}`}>{dog.goodWithDogs} with dogs</span>}</div></div><span className="text-muted">›</span></div>
        </div>
      ))}</>}

      {/* Cats */}
      {cats.length > 0 && <><div className="section-label">Cats</div>{cats.map(cat => (
        <div key={cat.id} className="card card-tap" onClick={() => setSelectedCat(cat)}>
          <div className="row-between"><div><div style={{ fontWeight: 600 }}>🐱 {cat.name}</div><div className="text-sm text-muted">{cat.age} · {cat.indoorOutdoor}</div></div><span className="text-muted">›</span></div>
        </div>
      ))}</>}

      <div className="btn-row mt-4">
        <button className="btn btn-ghost btn-sm" onClick={() => setView("add_dog")}>+ Add Dog</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setView("add_cat")}>+ Add Cat</button>
      </div>

      {/* Visits */}
      {visits.length > 0 && <><div className="section-label">Visits</div>{visits.map(v => (
        <div key={v.id} className="card card-sm">
          <div className="row-between">
            <div><div style={{ fontWeight: 600, fontSize: 14 }}>{SERVICE_MAP[v.serviceType]?.icon} {SERVICE_MAP[v.serviceType]?.label}</div><div className="text-xs text-muted">{fmtDate(v.date)} {v.time && `· ${v.time}`} {v.duration && `· ${v.duration}`}</div></div>
            <div className="row">{v.amount && <span className="text-sm text-muted">£{v.amount}</span>}<div className={`check-box${v.paid?" done":""}`} style={{ width: 22, height: 22, borderRadius: 6 }} onClick={() => togglePaid(v.id)}>{v.paid && <span style={{ color: "#001a12", fontSize: 11, fontWeight: 800 }}>✓</span>}</div></div>
          </div>
        </div>
      ))}</>}

      <div style={{ height: 32 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: TODAY
───────────────────────────────────────────── */
function TabToday({ onOpenPerson }) {
  const [completedActions, setCompletedActions] = useState(() => db.get("completedActions") || {});
  const [completedVisits, setCompletedVisits] = useState(() => db.get("completedVisits") || {});

  const people = db.getAll("people");
  const visits = db.getAll("visits");
  const todayVisits = visits.filter(v => v.date === todayStr() && v.status !== "cancelled").sort((a, b) => (a.time||"").localeCompare(b.time||""));
  const actions = computeActions(people);
  const waiting = people.filter(p => p.stage === "replied");

  const thisWeekVisits = visits.filter(v => {
    const d = new Date(v.date), now = new Date();
    const start = new Date(now); start.setDate(now.getDate() - now.getDay() + 1); start.setHours(0,0,0,0);
    const end = new Date(start); end.setDate(start.getDate() + 6);
    return d >= start && d <= end;
  });
  const earned = thisWeekVisits.filter(v => v.paid && v.amount).reduce((s, v) => s + parseFloat(v.amount||0), 0);
  const outstanding = thisWeekVisits.filter(v => !v.paid && v.amount).reduce((s, v) => s + parseFloat(v.amount||0), 0);

  const toggleAction = (id) => { const next = { ...completedActions, [id]: !completedActions[id] }; setCompletedActions(next); db.set("completedActions", next); };
  const toggleVisit = (id) => {
    const next = { ...completedVisits, [id]: !completedVisits[id] }; setCompletedVisits(next); db.set("completedVisits", next);
    const all = db.getAll("visits"); const idx = all.findIndex(v => v.id === id);
    if (idx >= 0) { all[idx].status = next[id] ? "completed" : "confirmed"; db.set("visits", all); }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <div style={{ padding: "20px 16px 12px" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 2, color: "var(--muted)", marginBottom: 4 }}>WALKS & WHISKERS</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, lineHeight: 1 }}>{greeting}, Freddie 👋</div>
        <div className="text-sm text-muted mt-4">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
      </div>

      <div className="section-label">WALKS TODAY</div>
      {todayVisits.length === 0
        ? <div style={{ padding: "8px 16px 4px" }}><div className="text-sm text-muted">No walks booked today 🌿</div></div>
        : todayVisits.map(v => {
          const p = people.find(x => x.id === v.personId);
          const dogs = db.getAll("dogs").filter(d => d.personId === v.personId);
          const done = completedVisits[v.id];
          return (
            <div key={v.id} className="card" style={{ opacity: done ? 0.5 : 1 }}>
              <div className="check-row">
                <CheckBox done={done} onToggle={() => toggleVisit(v.id)} />
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => p && onOpenPerson(p.id)}>
                  <div className="row-between">
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{v.time || "—"} · {dogs.map(d => d.name).join(", ") || "Dog"}</div>
                    <span className="badge badge-purple">{v.duration || SERVICE_MAP[v.serviceType]?.label}</span>
                  </div>
                  <div className="text-sm text-muted mt-4">{p?.name} · {(p?.address || p?.extracted?.location || "").split(",")[0]}</div>
                  <div className="text-xs text-muted mt-4">{SERVICE_MAP[v.serviceType]?.icon} {SERVICE_MAP[v.serviceType]?.label}</div>
                </div>
              </div>
            </div>
          );
        })
      }

      <div className="section-label">TO DO</div>
      {actions.length === 0
        ? <div style={{ padding: "8px 16px 4px" }}><div className="text-sm text-muted">All caught up 🎉</div></div>
        : actions.map(action => {
          const actionId = `${action.personId}-${action.type}`;
          const done = completedActions[actionId];
          const p = people.find(x => x.id === action.personId);
          return (
            <div key={actionId} className="card" style={{ opacity: done ? 0.4 : 1 }}>
              <div className="check-row">
                <CheckBox done={done} onToggle={() => toggleAction(actionId)} />
                <div style={{ flex: 1 }}>
                  <div className="row-between">
                    <div className="row flex-1" style={{ cursor: "pointer" }} onClick={() => !done && p && onOpenPerson(p.id)}>
                      <span className="dot" style={{ background: action.urgency === "high" ? "var(--orange)" : "var(--yellow)" }} />
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{action.label}</span>
                    </div>
                    {!done && p && (
                      <button className="btn btn-primary btn-sm" style={{ marginLeft: 8, flexShrink: 0 }} onClick={() => onOpenPerson(p.id)}>
                        💬 Reply
                      </button>
                    )}
                  </div>
                  <div className="mt-4"><StagePill stageId={action.stage} /></div>
                </div>
              </div>
            </div>
          );
        })
      }

      {waiting.length > 0 && <>
        <div className="section-label">WAITING ON</div>
        {waiting.map(p => (
          <div key={p.id} className="card card-tap card-sm" onClick={() => onOpenPerson(p.id)}>
            <div className="row-between"><div><div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div><div className="text-xs text-muted">Replied — awaiting their response</div></div><span className="text-muted">›</span></div>
          </div>
        ))}
      </>}

      <div className="section-label">THIS WEEK</div>
      <div className="earnings-card">
        <div className="row-between">
          <div><div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: "var(--green)" }}>£{earned.toFixed(0)}</div><div className="text-xs text-muted">earned</div></div>
          {outstanding > 0 && <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "var(--yellow)" }}>£{outstanding.toFixed(0)}</div><div className="text-xs text-muted">outstanding</div></div>}
          {earned === 0 && outstanding === 0 && <div className="text-sm text-muted">No paid visits logged yet</div>}
        </div>
      </div>

      <div style={{ height: 16 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: PEOPLE
───────────────────────────────────────────── */
function TabPeople({ onOpenPerson, onNewEnquiry }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const people = db.getAll("people");
  const filters = [
    { id: "all",            label: `All (${people.length})` },
    { id: "active",         label: `Active (${people.filter(p => p.stage==="active").length})` },
    { id: "enquiries",      label: `Enquiries (${people.filter(p => !["active","not_proceeding"].includes(p.stage)).length})` },
    { id: "not_proceeding", label: "Not proceeding" },
  ];

  const filtered = people.filter(p => {
    if (filter === "active") return p.stage === "active";
    if (filter === "enquiries") return !["active","not_proceeding"].includes(p.stage);
    if (filter === "not_proceeding") return p.stage === "not_proceeding";
    return true;
  }).filter(p => !search || (p.name||"").toLowerCase().includes(search.toLowerCase()) || (p.address||"").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ padding: "16px 16px 8px" }}>
        <div className="row-between">
          <div className="page-title">People</div>
          <button className="btn btn-primary btn-sm" onClick={onNewEnquiry}>+ New Enquiry</button>
        </div>
      </div>
      <div style={{ padding: "8px 16px" }}>
        <input className="input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="pill-tabs mb-12">
        {filters.map(f => <button key={f.id} className={`pill-tab${filter===f.id?" active":""}`} onClick={() => setFilter(f.id)}>{f.label}</button>)}
      </div>
      {filtered.length === 0
        ? <div className="empty-state"><div className="icon">🐾</div><h3>Nobody here yet</h3><p>Tap + New Enquiry to get started</p></div>
        : filtered.map(p => {
          const dogs = db.getAll("dogs").filter(d => d.personId === p.id);
          const cats = db.getAll("cats").filter(c => c.personId === p.id);
          const msgCount = (p.messages||[]).length;
          return (
            <div key={p.id} className="card card-tap" onClick={() => onOpenPerson(p.id)}>
              <div className="row-between">
                <div className="flex-1">
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name || "Unknown"}</div>
                  <div className="row mt-4" style={{ gap: 6, flexWrap: "wrap" }}>
                    <StagePill stageId={p.stage} />
                    {p.platform && <span className="badge badge-muted">{p.platform}</span>}
                  </div>
                  <div className="text-sm text-muted mt-4">
                    {dogs.map(d => `🐕 ${d.name}`).join(" · ")}{cats.map(c => ` 🐱 ${c.name}`).join(" · ")}
                    {!dogs.length && !cats.length && (p.extracted?.dog_name || p.extracted?.location || "")}
                  </div>
                  {msgCount > 0 && <div className="text-xs text-muted mt-4">💬 {msgCount} message{msgCount!==1?"s":""}</div>}
                </div>
                <span className="text-muted">›</span>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: SCHEDULE
───────────────────────────────────────────── */
function TabSchedule({ onOpenPerson }) {
  const visits = db.getAll("visits").filter(v => v.status !== "cancelled").sort((a, b) => a.date.localeCompare(b.date) || (a.time||"").localeCompare(b.time||""));
  const people = db.getAll("people");
  const grouped = {};
  for (const v of visits) { if (!grouped[v.date]) grouped[v.date] = []; grouped[v.date].push(v); }
  const today = todayStr();
  const upcoming = Object.keys(grouped).filter(d => d >= today).sort();
  const past = Object.keys(grouped).filter(d => d < today).sort().reverse().slice(0, 7);

  const renderDay = (dateStr, isPast) => {
    const d = new Date(dateStr + "T12:00:00");
    const isToday = dateStr === today;
    return (
      <div key={dateStr}>
        <div className="section-label" style={{ color: isToday ? "var(--green)" : undefined }}>
          {isToday ? "TODAY · " : ""}{d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
        </div>
        {grouped[dateStr].map(v => {
          const p = people.find(x => x.id === v.personId);
          const dogs = db.getAll("dogs").filter(d => d.personId === v.personId);
          return (
            <div key={v.id} className="card card-tap card-sm" style={{ opacity: isPast || v.status === "completed" ? 0.5 : 1 }} onClick={() => p && onOpenPerson(p.id)}>
              <div className="row-between">
                <div>
                  <div className="row" style={{ gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{v.time || "—"}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{SERVICE_MAP[v.serviceType]?.icon} {dogs.map(d => d.name).join(", ") || p?.name || "—"}</span>
                  </div>
                  <div className="text-xs text-muted mt-2">{SERVICE_MAP[v.serviceType]?.label} {v.duration ? `· ${v.duration}` : ""}</div>
                  {p && <div className="text-xs text-muted">{(p.address || p.extracted?.location || "").split(",")[0]}</div>}
                </div>
                {v.status === "completed" && <span className="badge badge-green">Done</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div style={{ padding: "16px 16px 8px" }}>
        <div className="page-title">Schedule</div>
        <div className="page-sub">All upcoming confirmed visits</div>
      </div>
      {upcoming.length === 0 && <div className="empty-state"><div className="icon">📅</div><h3>Nothing booked yet</h3><p>Visits appear here once confirmed through messaging</p></div>}
      {upcoming.map(d => renderDay(d, false))}
      {past.length > 0 && past.map(d => renderDay(d, true))}
      <div style={{ height: 16 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
const TABS = [
  { id: "today",    label: "Today",    icon: "🏠" },
  { id: "people",   label: "People",   icon: "🐾" },
  { id: "schedule", label: "Schedule", icon: "📅" },
];

export default function App() {
  const [tab, setTab] = useState("today");
  const [openPersonId, setOpenPersonId] = useState(null);
  const [showNewEnquiry, setShowNewEnquiry] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  // New enquiry — no person yet
  if (showNewEnquiry) return (
    <>
      <style>{CSS}</style>
      <div className="app-shell"><div className="tab-content">
        <MessagingFlow person={null} onBack={() => { setShowNewEnquiry(false); refresh(); }} onPersonUpdated={refresh} />
      </div></div>
    </>
  );

  // Person detail
  if (openPersonId) return (
    <>
      <style>{CSS}</style>
      <div className="app-shell"><div className="tab-content">
        <PersonDetail personId={openPersonId} onBack={() => { setOpenPersonId(null); refresh(); }} onUpdate={refresh} />
      </div></div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        <div className="tab-content">
          {tab === "today"    && <TabToday    key={tick} onOpenPerson={setOpenPersonId} />}
          {tab === "people"   && <TabPeople   key={tick} onOpenPerson={setOpenPersonId} onNewEnquiry={() => setShowNewEnquiry(true)} />}
          {tab === "schedule" && <TabSchedule key={tick} onOpenPerson={setOpenPersonId} />}
        </div>
        <nav className="bottom-nav">
          {TABS.map(t => (
            <button key={t.id} className={`nav-tab${tab===t.id?" active":""}`} onClick={() => setTab(t.id)}>
              <span className="nav-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
