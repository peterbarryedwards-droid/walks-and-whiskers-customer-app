import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d0f18;
    --card: #13151f;
    --card2: #181a27;
    --border: #1e2135;
    --border2: #252840;
    --purple: #6c5ce7;
    --purple-dim: #4a3fa3;
    --green: #00b894;
    --orange: #e17055;
    --yellow: #fdcb6e;
    --blue: #0984e3;
    --red: #d63031;
    --text: #eef0f8;
    --muted: #8890b0;
    --muted2: #555;
    --radius: 14px;
    --radius-sm: 8px;
    --safe-bottom: env(safe-area-inset-bottom, 0px);
  }
  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  body { overflow: hidden; }
  #root { display: flex; flex-direction: column; max-width: 480px; margin: 0 auto; }

  .app-shell { display: flex; flex-direction: column; height: 100vh; height: 100dvh; }
  .tab-content { flex: 1; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; padding-bottom: calc(80px + var(--safe-bottom)); }

  /* NAV */
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: rgba(13,15,24,0.96); backdrop-filter: blur(20px); border-top: 1px solid var(--border); display: flex; padding-bottom: var(--safe-bottom); z-index: 100; }
  .nav-tab { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 4px 8px; cursor: pointer; border: none; background: none; color: var(--muted2); transition: color 0.2s; -webkit-tap-highlight-color: transparent; }
  .nav-tab.active { color: var(--purple); }
  .nav-tab span { font-family: 'Bebas Neue', sans-serif; font-size: 10px; letter-spacing: 0.5px; }
  .nav-icon { font-size: 22px; line-height: 1; }

  /* CARDS */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; margin: 0 16px 12px; }
  .card-tap { cursor: pointer; transition: background 0.15s, border-color 0.15s; -webkit-tap-highlight-color: transparent; }
  .card-tap:active { background: var(--card2); border-color: var(--border2); }
  .card-sm { padding: 12px 14px; margin-bottom: 8px; }

  /* TYPOGRAPHY */
  .bebas { font-family: 'Bebas Neue', sans-serif; }
  .section-label { font-family: 'Bebas Neue', sans-serif; font-size: 12px; letter-spacing: 1.5px; color: var(--muted); padding: 0 16px; margin-bottom: 8px; margin-top: 20px; display: flex; align-items: center; gap: 8px; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .page-header { padding: 16px 16px 0; }
  .page-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 1px; color: var(--text); line-height: 1; }
  .page-sub { font-size: 13px; color: var(--muted); margin-top: 3px; }

  /* BUTTONS */
  .btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 20px; border-radius: var(--radius); border: none; cursor: pointer; font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 1px; transition: opacity 0.15s, transform 0.1s; -webkit-tap-highlight-color: transparent; width: 100%; }
  .btn:active { transform: scale(0.97); opacity: 0.85; }
  .btn-primary { background: var(--purple); color: white; }
  .btn-green { background: var(--green); color: #001a12; }
  .btn-ghost { background: transparent; border: 1px solid var(--border2); color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0; padding: 12px 16px; }
  .btn-orange { background: var(--orange); color: white; }
  .btn-sm { padding: 10px 16px; font-size: 14px; width: auto; }
  .btn-row { display: flex; gap: 10px; padding: 0 16px; margin-bottom: 12px; }
  .btn-row .btn { flex: 1; }

  /* INPUTS */
  .input { background: #0d0f18; border: 1px solid var(--border2); border-radius: var(--radius-sm); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 13px 14px; width: 100%; outline: none; transition: border-color 0.2s; }
  .input:focus { border-color: var(--purple); }
  .input::placeholder { color: var(--muted2); }
  textarea.input { resize: none; line-height: 1.5; }
  .input-label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .input-group { margin-bottom: 14px; }

  /* CHIPS / TAGS */
  .chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .chip { padding: 9px 16px; border-radius: 20px; border: 1px solid var(--border2); background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; -webkit-tap-highlight-color: transparent; }
  .chip.active { border-color: var(--purple); background: rgba(108,92,231,0.15); color: var(--purple); }
  .chip-green.active { border-color: var(--green); background: rgba(0,184,148,0.12); color: var(--green); }
  .chip-orange.active { border-color: var(--orange); background: rgba(225,112,85,0.12); color: var(--orange); }
  .chip-yellow.active { border-color: var(--yellow); background: rgba(253,203,110,0.1); color: var(--yellow); }

  /* BADGES */
  .badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 10px; font-size: 11px; font-weight: 600; }
  .badge-purple { background: rgba(108,92,231,0.18); color: var(--purple); }
  .badge-green { background: rgba(0,184,148,0.15); color: var(--green); }
  .badge-orange { background: rgba(225,112,85,0.15); color: var(--orange); }
  .badge-yellow { background: rgba(253,203,110,0.12); color: var(--yellow); }
  .badge-muted { background: rgba(136,144,176,0.12); color: var(--muted); }
  .badge-red { background: rgba(214,48,49,0.15); color: var(--red); }

  /* CHECKBOX */
  .check-row { display: flex; align-items: flex-start; gap: 12px; }
  .check-box { width: 26px; height: 26px; min-width: 26px; border-radius: 8px; border: 2px solid var(--border2); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; -webkit-tap-highlight-color: transparent; flex-shrink: 0; margin-top: 1px; }
  .check-box.done { background: var(--green); border-color: var(--green); }
  .check-content { flex: 1; }

  /* DIVIDER */
  .divider { height: 1px; background: var(--border); margin: 12px 16px; }

  /* PILL TABS */
  .pill-tabs { display: flex; gap: 8px; padding: 0 16px; margin-bottom: 16px; overflow-x: auto; scrollbar-width: none; }
  .pill-tabs::-webkit-scrollbar { display: none; }
  .pill-tab { padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all 0.15s; -webkit-tap-highlight-color: transparent; }
  .pill-tab.active { background: var(--purple); border-color: var(--purple); color: white; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; flex-direction: column; justify-content: flex-end; }
  .modal-sheet { background: var(--card); border-radius: 20px 20px 0 0; padding: 20px 16px; padding-bottom: calc(20px + var(--safe-bottom)); max-height: 90dvh; overflow-y: auto; }
  .modal-handle { width: 36px; height: 4px; background: var(--border2); border-radius: 2px; margin: 0 auto 20px; }
  .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1px; margin-bottom: 16px; }

  /* LOADING */
  .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid var(--border2); border-top-color: var(--purple); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-bar { height: 3px; background: linear-gradient(90deg, transparent, var(--purple), transparent); background-size: 200% 100%; animation: loadbar 1.2s ease-in-out infinite; border-radius: 2px; }
  @keyframes loadbar { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  /* MISC */
  .tag { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--muted); }
  .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  .dot-purple { background: var(--purple); }
  .dot-green { background: var(--green); }
  .dot-orange { background: var(--orange); }
  .dot-yellow { background: var(--yellow); }
  .dot-red { background: var(--red); }
  .dot-muted { background: var(--muted2); }
  .empty-state { text-align: center; padding: 48px 24px; color: var(--muted); }
  .empty-state .icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state h3 { font-family: 'Bebas Neue', sans-serif; font-size: 20px; margin-bottom: 8px; color: var(--text); }
  .empty-state p { font-size: 14px; line-height: 1.6; }
  .row { display: flex; align-items: center; gap: 8px; }
  .row-between { display: flex; align-items: center; justify-content: space-between; }
  .col { display: flex; flex-direction: column; gap: 4px; }
  .flex-1 { flex: 1; }
  .mt-4 { margin-top: 4px; }
  .mt-8 { margin-top: 8px; }
  .mt-12 { margin-top: 12px; }
  .mt-16 { margin-top: 16px; }
  .mb-4 { margin-bottom: 4px; }
  .mb-8 { margin-bottom: 8px; }
  .mb-12 { margin-bottom: 12px; }
  .mb-16 { margin-bottom: 16px; }
  .text-sm { font-size: 13px; }
  .text-xs { font-size: 11px; }
  .text-muted { color: var(--muted); }
  .text-green { color: var(--green); }
  .text-orange { color: var(--orange); }
  .text-purple { color: var(--purple); }
  .text-yellow { color: var(--yellow); }
  .text-red { color: var(--red); }
  .fw-600 { font-weight: 600; }
  .back-btn { display: flex; align-items: center; gap: 6px; color: var(--purple); font-size: 15px; font-weight: 600; padding: 16px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .draft-box { background: #0d0f18; border: 1px solid var(--border2); border-radius: var(--radius-sm); padding: 14px; font-size: 14px; line-height: 1.7; white-space: pre-wrap; color: var(--text); }
  .copy-btn { display: flex; align-items: center; gap: 6px; color: var(--purple); font-size: 13px; font-weight: 600; cursor: pointer; padding: 8px 0; -webkit-tap-highlight-color: transparent; }
  .step-indicator { font-size: 12px; color: var(--muted); text-align: center; margin-bottom: 8px; }
  .progress-dots { display: flex; gap: 6px; justify-content: center; margin-bottom: 20px; }
  .progress-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border2); transition: background 0.2s; }
  .progress-dot.active { background: var(--purple); }
  .highlight-box { background: rgba(108,92,231,0.08); border: 1px solid rgba(108,92,231,0.2); border-radius: var(--radius-sm); padding: 12px 14px; }
  .earnings-card { background: linear-gradient(135deg, #1a1030 0%, #13151f 100%); border: 1px solid rgba(108,92,231,0.3); border-radius: var(--radius); padding: 16px; margin: 0 16px 12px; }
  .stage-pill { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 10px; font-size: 11px; font-weight: 600; }
`;

/* ─────────────────────────────────────────────
   DATA LAYER
───────────────────────────────────────────── */
const db = {
  get(k) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  },
  getAll(k) { return this.get(k) || []; },
  save(k, items) { this.set(k, items); },
  upsert(k, item) {
    const items = this.getAll(k);
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) items[idx] = item; else items.push(item);
    this.save(k, items);
    return item;
  },
  remove(k, id) {
    const items = this.getAll(k).filter(i => i.id !== id);
    this.save(k, items);
  }
};

const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().split("T")[0];
const now = () => new Date().toISOString();
const fmtDate = d => { if (!d) return ""; const dt = new Date(d); return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };
const fmtTime = t => { if (!t) return ""; return t; };
const daysDiff = (d1, d2) => { const a = new Date(d1), b = new Date(d2); return Math.floor((b - a) / 86400000); };
const daysSince = d => daysDiff(d, now());

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const PIPELINE_STAGES = [
  { id: "new_enquiry",       label: "New Enquiry",        color: "#fdcb6e", dot: "dot-yellow" },
  { id: "replied",           label: "Replied",             color: "#6c5ce7", dot: "dot-purple" },
  { id: "interested",        label: "Interested",          color: "#0984e3", dot: "dot-purple" },
  { id: "meet_arranged",     label: "Meet Arranged",       color: "#00b894", dot: "dot-green" },
  { id: "met",               label: "Met",                 color: "#00b894", dot: "dot-green" },
  { id: "first_walk_booked", label: "First Walk Booked",   color: "#00b894", dot: "dot-green" },
  { id: "gone_quiet",        label: "Gone Quiet",          color: "#e17055", dot: "dot-orange" },
  { id: "not_proceeding",    label: "Not Proceeding",      color: "#555",    dot: "dot-muted" },
];

const STAGE_COLOR = Object.fromEntries(PIPELINE_STAGES.map(s => [s.id, s.color]));
const STAGE_LABEL = Object.fromEntries(PIPELINE_STAGES.map(s => [s.id, s.label]));

const SERVICES = [
  { id: "dog_walk",    label: "Dog Walk",        icon: "🦮" },
  { id: "drop_in",     label: "Dog Drop-in",     icon: "🐕" },
  { id: "cat_visit",   label: "Cat Visit",        icon: "🐱" },
  { id: "home_sit",    label: "Dog Home Sit",     icon: "🏡" },
  { id: "stay_over",   label: "Dog Stay Over",    icon: "🌙" },
];
const SERVICE_LABEL = Object.fromEntries(SERVICES.map(s => [s.id, s.label]));
const SERVICE_ICON  = Object.fromEntries(SERVICES.map(s => [s.id, s.icon]));

const PLATFORMS = ["Rover", "Bark", "Direct", "Other"];

const DURATIONS = ["30 min", "45 min", "60 min"];

/* ─────────────────────────────────────────────
   AI HELPERS
───────────────────────────────────────────── */
async function callClaude(prompt, maxTokens = 1200) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    clearTimeout(timeout);
    if (!r.ok) throw new Error("API error " + r.status);
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    return d.content?.[0]?.text || "";
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

async function callClaudeJSON(prompt) {
  const text = await callClaude(prompt, 1200);
  const clean = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(clean); } catch { return {}; }
}

/* ─────────────────────────────────────────────
   CHASE / ACTION LOGIC
───────────────────────────────────────────── */
function computeActions(contacts, messages, visits) {
  const actions = [];
  const msgByContact = {};
  for (const m of messages) {
    if (!msgByContact[m.contactId]) msgByContact[m.contactId] = [];
    msgByContact[m.contactId].push(m);
  }

  for (const c of contacts) {
    if (c.stage === "not_proceeding") continue;

    const contactMsgs = msgByContact[c.id] || [];
    const lastMsg = contactMsgs.length ? contactMsgs[contactMsgs.length - 1] : null;
    const lastMsgAge = lastMsg ? daysSince(lastMsg.date) : null;
    const lastInbound = [...contactMsgs].reverse().find(m => m.direction === "in");
    const lastOutbound = [...contactMsgs].reverse().find(m => m.direction === "out");

    // Unreplied inbound message (>12h)
    if (lastInbound && (!lastOutbound || lastInbound.date > lastOutbound.date)) {
      const hoursAgo = (Date.now() - new Date(lastInbound.date)) / 3600000;
      if (hoursAgo > 12) {
        actions.push({ contactId: c.id, type: "reply_needed", label: `Reply to ${c.name}`, urgency: "high", stage: c.stage });
      }
    }

    if (c.stage === "new_enquiry") {
      actions.push({ contactId: c.id, type: "reply_new", label: `Reply to ${c.name} — new enquiry`, urgency: "high", stage: c.stage });
    }
    if (c.stage === "replied" && lastMsgAge !== null && lastMsgAge >= 1) {
      actions.push({ contactId: c.id, type: "chase", label: `Chase ${c.name} — no reply in ${lastMsgAge}d`, urgency: "medium", stage: c.stage });
    }
    if (c.stage === "interested") {
      const age = daysSince(c.lastActionDate || c.createdAt);
      if (age >= 1) actions.push({ contactId: c.id, type: "arrange_meet", label: `Arrange meet with ${c.name}`, urgency: "medium", stage: c.stage });
    }
    if (c.stage === "meet_arranged") {
      const age = daysSince(c.lastActionDate || c.createdAt);
      if (age >= 2) actions.push({ contactId: c.id, type: "chase", label: `Chase ${c.name} — meet arranged but quiet`, urgency: "medium", stage: c.stage });
    }
    if (c.stage === "met") {
      const age = daysSince(c.lastActionDate || c.createdAt);
      if (age >= 1) actions.push({ contactId: c.id, type: "chase_booking", label: `Follow up ${c.name} — met, no booking yet`, urgency: "medium", stage: c.stage });
    }
    if (c.stage === "gone_quiet") {
      const age = daysSince(c.lastActionDate || c.createdAt);
      if (age >= 3) actions.push({ contactId: c.id, type: "re_engage", label: `Re-engage ${c.name} — gone quiet`, urgency: "low", stage: c.stage });
    }
  }

  return actions;
}

/* ─────────────────────────────────────────────
   SMALL REUSABLE COMPONENTS
───────────────────────────────────────────── */
function Chip({ label, active, onClick, color = "purple" }) {
  return (
    <button className={`chip chip-${color} ${active ? "active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

function CheckBox({ done, onToggle }) {
  return (
    <div className={`check-box ${done ? "done" : ""}`} onClick={onToggle}>
      {done && <span style={{ color: "#001a12", fontSize: 14, fontWeight: 700 }}>✓</span>}
    </div>
  );
}

function StagePill({ stageId }) {
  const color = STAGE_COLOR[stageId] || "#555";
  return (
    <span className="stage-pill" style={{ background: color + "22", color }}>
      {STAGE_LABEL[stageId] || stageId}
    </span>
  );
}

function Spinner() { return <div className="spinner" /> }

function BackBtn({ onBack, label = "Back" }) {
  return <div className="back-btn" onClick={onBack}>← {label}</div>;
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="copy-btn" onClick={copy}>
      {copied ? "✓ Copied!" : "📋 Copy to clipboard"}
    </div>
  );
}

function UrgencyDot({ urgency }) {
  const cls = urgency === "high" ? "dot-orange" : urgency === "medium" ? "dot-yellow" : "dot-muted";
  return <span className={`dot ${cls}`} />;
}

/* ─────────────────────────────────────────────
   MESSAGING TOOL
───────────────────────────────────────────── */
const ENQUIRY_TYPES = [
  { id: "new_client",   label: "New Client Enquiry",   icon: "👋", desc: "First time reaching out" },
  { id: "sit_stay",     label: "Sit / Stay Over",       icon: "🌙", desc: "Home sitting or stay over enquiry" },
  { id: "existing",     label: "Existing Client",       icon: "🐾", desc: "Client you already walk for" },
  { id: "quote",        label: "Price Enquiry",         icon: "💷", desc: "They want to know rates" },
  { id: "follow_up",    label: "Follow Up / Chase",     icon: "📲", desc: "Checking in or chasing" },
  { id: "general",      label: "General Response",      icon: "💬", desc: "General questions, follow ups" },
  { id: "decline",      label: "Turn Down a Job",       icon: "🙏", desc: "Can't take it — be kind" },
];

function MessagingTool({ contact, onBack, onSaved }) {
  const [step, setStep] = useState("type"); // type | platform | context | questions | draft
  const [enquiryType, setEnquiryType] = useState(null);
  const [platform, setPlatform] = useState(contact?.platform || "");
  const [messageText, setMessageText] = useState("");
  const [answers, setAnswers] = useState({});
  const [aiQuestions, setAiQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [draft, setDraft] = useState("");
  const [doubleCheck, setDoubleCheck] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const contactMessages = db.getAll("messages").filter(m => m.contactId === contact?.id);
  const threadContext = contactMessages.map(m => `[${m.direction === "out" ? "Freddie" : contact?.name}]: ${m.text}`).join("\n");

  const buildPrompt = (qas) => {
    const rate = (platform === "Direct" || platform === "Other") ? (contact?.rate || "not set") : "N/A (platform sets this)";
    const neverRate = platform === "Rover" || platform === "Bark";
    const dogs = db.getAll("dogs").filter(d => d.contactId === contact?.id);
    const dogInfo = dogs.length ? dogs.map(d => `${d.name} (${d.breed})`).join(", ") : "unknown";

    const qaBlock = Object.entries(qas).map(([q, a]) => `Q: ${q}\nA: ${a}`).join("\n");

    return `You are a communication assistant for Freddie, an 18-year-old professional dog walker in Winchester.

CONTACT INFO:
Name: ${contact?.name || "unknown"}
Platform: ${platform || "unknown"}
Stage: ${contact?.stage || "unknown"}
Dogs: ${dogInfo}
Rate: ${rate}
${neverRate ? "IMPORTANT: NEVER mention rates — the platform sets these." : ""}

MESSAGE FROM CLIENT:
${messageText || "(no message — this is a proactive follow up)"}

CONVERSATION HISTORY:
${threadContext || "(no prior messages)"}

ADDITIONAL CONTEXT:
${qaBlock || "(none)"}

ENQUIRY TYPE: ${enquiryType}

RULES:
- Warm, professional, British English
- Sign off as Freddie
- For new clients: location and dates first, then meet and greet naturally
- For sits/stay overs: ask about whether dog can be left alone and for how long
- For existing clients: skip introductions, skip meet and greet suggestion
- ${neverRate ? "NEVER mention rate or price." : "Mention rate naturally if relevant."}
- Never invent or guess a rate

Respond with exactly two sections:

DRAFT REPLY
[The reply for Freddie to copy and send]

DOUBLE CHECK
[2-3 bullet points of things Freddie should verify before sending — keep these SHORT]`;
  };

  const analyseAndQuestion = async () => {
    setLoading(true);
    setError("");
    try {
      const rate = platform === "Direct" || platform === "Other";
      const result = await callClaudeJSON(`You are helping Freddie the dog walker reply to a client.

Contact: ${contact?.name || "unknown"}, Platform: ${platform}
Enquiry type: ${enquiryType}
Message: ${messageText || "(proactive follow up)"}
History: ${threadContext || "(none)"}

Identify the MOST IMPORTANT missing pieces of info needed to write a good reply.
For "new_client": check if location, dates, and service type are known.
For "sit_stay": also check if accompaniment needs and max alone time are known.
For "existing": minimal questions needed.
For "follow_up" or "decline": no questions needed.

Return JSON: { "questions": [{"q": "question text", "hint": "why this matters"}] }
Maximum 3 questions. If none needed, return { "questions": [] }`);

      const qs = result.questions || [];
      if (qs.length === 0) {
        await generateDraft({});
      } else {
        setAiQuestions(qs);
        setCurrentQ(0);
        setStep("questions");
      }
    } catch (e) {
      setError("Couldn't connect — try again");
    }
    setLoading(false);
  };

  const generateDraft = async (qas) => {
    setLoading(true);
    setError("");
    try {
      const text = await callClaude(buildPrompt(qas), 1000);
      const draftMatch = text.match(/DRAFT REPLY\s*([\s\S]*?)(?=DOUBLE CHECK|$)/i);
      const checkMatch = text.match(/DOUBLE CHECK\s*([\s\S]*)/i);
      setDraft(draftMatch?.[1]?.trim() || text.trim());
      setDoubleCheck(checkMatch?.[1]?.trim() || "");

      if (contact) {
        const savedMsg = {
          id: uid(),
          contactId: contact.id,
          direction: "out",
          text: draftMatch?.[1]?.trim() || text.trim(),
          date: now(),
          platform,
        };
        db.upsert("messages", savedMsg);
        // Advance stage
        const contacts = db.getAll("contacts");
        const ci = contacts.findIndex(c => c.id === contact.id);
        if (ci >= 0 && contacts[ci].stage === "new_enquiry") {
          contacts[ci].stage = "replied";
          contacts[ci].lastActionDate = now();
          db.save("contacts", contacts);
        }
        onSaved?.();
      }

      setStep("draft");
    } catch (e) {
      setError("Couldn't generate — try again");
    }
    setLoading(false);
  };

  const answerQuestion = (q, a) => {
    const next = { ...answers, [q]: a };
    setAnswers(next);
    if (currentQ + 1 >= aiQuestions.length) {
      generateDraft(next);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  // STEP: type selection
  if (step === "type") {
    return (
      <div>
        <BackBtn onBack={onBack} />
        <div className="page-header mb-16">
          <div className="page-title">Message Tool</div>
          {contact && <div className="page-sub">{contact.name}</div>}
        </div>
        <div className="section-label">What kind of message?</div>
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {ENQUIRY_TYPES.map(t => (
            <div key={t.id} className="card card-tap" onClick={() => {
              setEnquiryType(t.id);
              if (contact?.platform) { setPlatform(contact.platform); setStep("context"); }
              else setStep("platform");
            }}>
              <div className="row">
                <span style={{ fontSize: 24 }}>{t.icon}</span>
                <div className="col flex-1">
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{t.label}</div>
                  <div className="text-sm text-muted">{t.desc}</div>
                </div>
                <span className="text-muted">›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // STEP: platform
  if (step === "platform") {
    return (
      <div>
        <BackBtn onBack={() => setStep("type")} />
        <div className="page-header mb-16">
          <div className="page-title">Which Platform?</div>
        </div>
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {PLATFORMS.map(p => (
            <div key={p} className="card card-tap" onClick={() => { setPlatform(p); setStep("context"); }}>
              <div className="row-between">
                <span style={{ fontWeight: 600, fontSize: 16 }}>{p}</span>
                {(p === "Rover" || p === "Bark") && <span className="badge badge-muted">Platform sets rates</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // STEP: context (paste message)
  if (step === "context") {
    return (
      <div>
        <BackBtn onBack={() => setStep(contact?.platform ? "type" : "platform")} />
        <div className="page-header mb-16">
          <div className="page-title">Their Message</div>
          <div className="page-sub">Paste what they sent — or leave blank for a proactive message</div>
        </div>
        <div style={{ padding: "0 16px" }}>
          <textarea
            className="input"
            rows={6}
            placeholder="Paste their message here..."
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
          />
          <div className="mt-16">
            <button className="btn btn-primary" onClick={analyseAndQuestion} disabled={loading}>
              {loading ? <Spinner /> : "Next →"}
            </button>
          </div>
          {error && <div className="text-orange text-sm mt-8">{error}</div>}
        </div>
      </div>
    );
  }

  // STEP: questions
  if (step === "questions") {
    const q = aiQuestions[currentQ];
    return (
      <div>
        <BackBtn onBack={() => setStep("context")} />
        <div className="page-header mb-8">
          <div className="page-title">Quick Q</div>
        </div>
        <div className="step-indicator">{currentQ + 1} of {aiQuestions.length}</div>
        <div className="progress-dots">
          {aiQuestions.map((_, i) => <div key={i} className={`progress-dot ${i <= currentQ ? "active" : ""}`} />)}
        </div>
        <div style={{ padding: "0 16px" }}>
          <div className="card" style={{ marginLeft: 0, marginRight: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{q.q}</div>
            {q.hint && <div className="text-sm text-muted">{q.hint}</div>}
          </div>
          <div className="mt-16">
            <textarea
              className="input"
              rows={3}
              placeholder="Type your answer..."
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey && e.target.value.trim()) {
                  e.preventDefault();
                  answerQuestion(q.q, e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
            <button className="btn btn-primary mt-8" onClick={e => {
              const ta = e.target.closest("div").previousElementSibling;
              if (ta.value.trim()) { answerQuestion(q.q, ta.value.trim()); ta.value = ""; }
            }}>
              {loading ? <Spinner /> : currentQ + 1 >= aiQuestions.length ? "Generate Draft" : "Next →"}
            </button>
            <button className="btn btn-ghost mt-8" onClick={() => answerQuestion(q.q, "unknown")}>
              Skip this one
            </button>
          </div>
          {error && <div className="text-orange text-sm mt-8">{error}</div>}
        </div>
      </div>
    );
  }

  // STEP: draft
  if (step === "draft") {
    const [editedDraft, setEditedDraft] = useState(draft);
    return (
      <div>
        <BackBtn onBack={onBack} label="Done" />
        <div className="page-header mb-16">
          <div className="page-title">Draft Reply</div>
          <div className="page-sub">Edit, then copy and send</div>
        </div>
        <div style={{ padding: "0 16px" }}>
          <textarea
            className="input"
            rows={12}
            value={editedDraft}
            onChange={e => setEditedDraft(e.target.value)}
          />
          <CopyBtn text={editedDraft} />
          {doubleCheck && (
            <div className="highlight-box mt-12">
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "var(--yellow)" }}>⚠️ Double check before sending</div>
              <div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--muted)" }}>{doubleCheck}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

/* ─────────────────────────────────────────────
   DOG PROFILE WIZARD
───────────────────────────────────────────── */
function DogWizard({ contactId, existingDog, onSave, onBack }) {
  const init = existingDog || { id: uid(), contactId, name: "", breed: "", age: "", size: "", goodWithDogs: "", goodOnLead: "", healthIssues: "No", healthNotes: "", spooks: "", vet: "", vetPhone: "", personality: "", meetGreetResult: "", meetGreetDate: "" };
  const [dog, setDog] = useState(init);
  const [step, setStep] = useState(0);

  const set = (k, v) => setDog(d => ({ ...d, [k]: v }));

  const steps = [
    {
      title: "Dog's Name", content: (
        <div className="input-group">
          <input className="input" placeholder="e.g. Buddy" value={dog.name} onChange={e => set("name", e.target.value)} style={{ fontSize: 20, fontWeight: 600 }} />
        </div>
      ), valid: !!dog.name.trim()
    },
    {
      title: "Breed & Age", content: (
        <>
          <div className="input-group"><div className="input-label">Breed</div><input className="input" placeholder="e.g. Labrador" value={dog.breed} onChange={e => set("breed", e.target.value)} /></div>
          <div className="input-group"><div className="input-label">Age</div><input className="input" placeholder="e.g. 3 years" value={dog.age} onChange={e => set("age", e.target.value)} /></div>
        </>
      ), valid: true
    },
    {
      title: "Size", content: (
        <div className="chip-row">
          {["S", "M", "L"].map(s => <Chip key={s} label={s === "S" ? "Small" : s === "M" ? "Medium" : "Large"} active={dog.size === s} onClick={() => set("size", s)} />)}
        </div>
      ), valid: !!dog.size
    },
    {
      title: "Good with other dogs?", content: (
        <div className="chip-row">
          {["Yes", "No", "Unpredictable"].map(v => <Chip key={v} label={v} active={dog.goodWithDogs === v} onClick={() => set("goodWithDogs", v)} color={v === "Yes" ? "green" : v === "No" ? "orange" : "yellow"} />)}
        </div>
      ), valid: !!dog.goodWithDogs
    },
    {
      title: "Good on lead?", content: (
        <div className="chip-row">
          {["Yes", "Fine", "Pulls"].map(v => <Chip key={v} label={v} active={dog.goodOnLead === v} onClick={() => set("goodOnLead", v)} color={v === "Yes" ? "green" : v === "Fine" ? "purple" : "orange"} />)}
        </div>
      ), valid: !!dog.goodOnLead
    },
    {
      title: "Any health issues?", content: (
        <>
          <div className="chip-row mb-12">
            {["No", "Yes"].map(v => <Chip key={v} label={v} active={dog.healthIssues === v} onClick={() => set("healthIssues", v)} color={v === "No" ? "green" : "orange"} />)}
          </div>
          {dog.healthIssues === "Yes" && <textarea className="input" rows={3} placeholder="Describe health issues..." value={dog.healthNotes} onChange={e => set("healthNotes", e.target.value)} />}
        </>
      ), valid: !!dog.healthIssues
    },
    {
      title: "Anything that spooks them?", content: (
        <textarea className="input" rows={3} placeholder="e.g. loud noises, bikes, other dogs... (optional)" value={dog.spooks} onChange={e => set("spooks", e.target.value)} />
      ), valid: true
    },
    {
      title: "Vet details", content: (
        <>
          <div className="input-group"><div className="input-label">Vet name</div><input className="input" placeholder="e.g. Winchester Vets" value={dog.vet} onChange={e => set("vet", e.target.value)} /></div>
          <div className="input-group"><div className="input-label">Vet phone</div><input className="input" placeholder="01962..." type="tel" value={dog.vetPhone} onChange={e => set("vetPhone", e.target.value)} /></div>
        </>
      ), valid: true
    },
    {
      title: "Personality notes", content: (
        <textarea className="input" rows={4} placeholder="What's their character like? Any quirks? (optional)" value={dog.personality} onChange={e => set("personality", e.target.value)} />
      ), valid: true
    },
    {
      title: "How did the meet & greet go?", content: (
        <div className="chip-row">
          {["Great", "Fine", "Concerns"].map(v => <Chip key={v} label={v} active={dog.meetGreetResult === v} onClick={() => set("meetGreetResult", v)} color={v === "Great" ? "green" : v === "Fine" ? "purple" : "orange"} />)}
        </div>
      ), valid: true
    },
  ];

  const s = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div>
      <BackBtn onBack={step === 0 ? onBack : () => setStep(s => s - 1)} />
      <div className="page-header mb-8">
        <div className="page-title">{s.title}</div>
      </div>
      <div className="step-indicator">{step + 1} of {steps.length}</div>
      <div className="progress-dots">
        {steps.map((_, i) => <div key={i} className={`progress-dot ${i === step ? "active" : i < step ? "active" : ""}`} style={i < step ? { background: "var(--green)" } : {}} />)}
      </div>
      <div style={{ padding: "0 16px" }}>
        {s.content}
        <div className="mt-16">
          <button className="btn btn-primary" disabled={!s.valid} onClick={() => {
            if (isLast) { db.upsert("dogs", dog); onSave(dog); }
            else setStep(s => s + 1);
          }}>
            {isLast ? "Save Dog Profile ✓" : "Next →"}
          </button>
          {!s.valid && <div className="text-sm text-muted mt-8" style={{ textAlign: "center" }}>Tap an option to continue</div>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CAT PROFILE WIZARD
───────────────────────────────────────────── */
function CatWizard({ contactId, existingCat, onSave, onBack }) {
  const init = existingCat || { id: uid(), contactId, name: "", age: "", indoorOutdoor: "", feedingRoutine: "", litterNotes: "", medication: "No", medicationNotes: "", personality: "" };
  const [cat, setCat] = useState(init);
  const [step, setStep] = useState(0);
  const set = (k, v) => setCat(c => ({ ...c, [k]: v }));

  const steps = [
    { title: "Cat's Name", content: <input className="input" placeholder="e.g. Mochi" value={cat.name} onChange={e => set("name", e.target.value)} style={{ fontSize: 20, fontWeight: 600 }} />, valid: !!cat.name.trim() },
    { title: "Age", content: <input className="input" placeholder="e.g. 4 years" value={cat.age} onChange={e => set("age", e.target.value)} />, valid: true },
    { title: "Indoor / Outdoor?", content: <div className="chip-row">{["Indoor", "Outdoor", "Both"].map(v => <Chip key={v} label={v} active={cat.indoorOutdoor === v} onClick={() => set("indoorOutdoor", v)} />)}</div>, valid: !!cat.indoorOutdoor },
    { title: "Feeding routine", content: <textarea className="input" rows={3} placeholder="e.g. Wet food twice a day — morning and evening..." value={cat.feedingRoutine} onChange={e => set("feedingRoutine", e.target.value)} />, valid: true },
    { title: "Litter notes", content: <textarea className="input" rows={3} placeholder="e.g. Litter tray in bathroom, change every other day..." value={cat.litterNotes} onChange={e => set("litterNotes", e.target.value)} />, valid: true },
    {
      title: "Any medication?", content: (
        <>
          <div className="chip-row mb-12">{["No", "Yes"].map(v => <Chip key={v} label={v} active={cat.medication === v} onClick={() => set("medication", v)} color={v === "No" ? "green" : "orange"} />)}</div>
          {cat.medication === "Yes" && <textarea className="input" rows={3} placeholder="What medication and how often?" value={cat.medicationNotes} onChange={e => set("medicationNotes", e.target.value)} />}
        </>
      ), valid: true
    },
    { title: "Personality notes", content: <textarea className="input" rows={4} placeholder="What are they like? Shy, affectionate, indoor only... (optional)" value={cat.personality} onChange={e => set("personality", e.target.value)} />, valid: true },
  ];

  const s = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div>
      <BackBtn onBack={step === 0 ? onBack : () => setStep(s => s - 1)} />
      <div className="page-header mb-8"><div className="page-title">{s.title}</div></div>
      <div className="step-indicator">{step + 1} of {steps.length}</div>
      <div className="progress-dots">{steps.map((_, i) => <div key={i} className={`progress-dot ${i <= step ? "active" : ""}`} style={i < step ? { background: "var(--green)" } : {}} />)}</div>
      <div style={{ padding: "0 16px" }}>
        {s.content}
        <div className="mt-16">
          <button className="btn btn-primary" disabled={!s.valid} onClick={() => {
            if (isLast) { db.upsert("cats", cat); onSave(cat); }
            else setStep(s => s + 1);
          }}>
            {isLast ? "Save Cat Profile ✓" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NEW CONTACT WIZARD (pipeline entry)
───────────────────────────────────────────── */
function NewContactWizard({ onSave, onBack }) {
  const [contact, setContact] = useState({ id: uid(), name: "", phone: "", address: "", postcode: "", platform: "", serviceType: "", notes: "", stage: "new_enquiry", createdAt: now(), lastActionDate: now() });
  const [step, setStep] = useState(0);
  const set = (k, v) => setContact(c => ({ ...c, [k]: v }));

  const steps = [
    { title: "Their Name", content: <input className="input" placeholder="Full name" value={contact.name} onChange={e => set("name", e.target.value)} style={{ fontSize: 20, fontWeight: 600 }} />, valid: !!contact.name.trim() },
    { title: "Which Platform?", content: <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{PLATFORMS.map(p => <div key={p} className="card card-tap" style={{ margin: 0 }} onClick={() => set("platform", p)}><div className="row-between"><span style={{ fontWeight: 600 }}>{p}</span>{contact.platform === p && <span className="text-green">✓</span>}</div></div>)}</div>, valid: !!contact.platform },
    { title: "What service?", content: <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{SERVICES.map(s => <div key={s.id} className="card card-tap" style={{ margin: 0 }} onClick={() => set("serviceType", s.id)}><div className="row"><span style={{ fontSize: 20 }}>{s.icon}</span><span style={{ fontWeight: 600 }}>{s.label}</span>{contact.serviceType === s.id && <span className="text-green ml-auto">✓</span>}</div></div>)}</div>, valid: !!contact.serviceType },
    { title: "Phone number", content: <input className="input" placeholder="07..." type="tel" value={contact.phone} onChange={e => set("phone", e.target.value)} />, valid: true },
    { title: "Address", content: <><input className="input mb-8" placeholder="Street address" value={contact.address} onChange={e => set("address", e.target.value)} /><input className="input" placeholder="Postcode" value={contact.postcode} onChange={e => set("postcode", e.target.value)} /></>, valid: true },
    { title: "Any initial notes?", content: <textarea className="input" rows={4} placeholder="Anything useful to note... (optional)" value={contact.notes} onChange={e => set("notes", e.target.value)} />, valid: true },
  ];

  const s = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div>
      <BackBtn onBack={step === 0 ? onBack : () => setStep(s => s - 1)} />
      <div className="page-header mb-8"><div className="page-title">New Enquiry</div><div className="page-sub">Add them to your pipeline</div></div>
      <div className="step-indicator">{step + 1} of {steps.length}</div>
      <div className="progress-dots">{steps.map((_, i) => <div key={i} className={`progress-dot ${i <= step ? "active" : ""}`} style={i < step ? { background: "var(--green)" } : {}} />)}</div>
      <div style={{ padding: "0 16px" }}>
        <div className="mb-8"><div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{s.title}</div>{s.content}</div>
        <div className="mt-16">
          <button className="btn btn-primary" disabled={!s.valid} onClick={() => {
            if (isLast) { db.upsert("contacts", contact); onSave(contact); }
            else setStep(s => s + 1);
          }}>
            {isLast ? "Add to Pipeline ✓" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NEW VISIT MODAL
───────────────────────────────────────────── */
function NewVisitModal({ onSave, onClose }) {
  const contacts = db.getAll("contacts").filter(c => c.stage === "active" || c.stage === "first_walk_booked");
  const allContacts = db.getAll("contacts");
  const activeContacts = allContacts.filter(c => !["not_proceeding", "gone_quiet"].includes(c.stage));

  const [visit, setVisit] = useState({ id: uid(), contactId: "", animalIds: [], serviceType: "dog_walk", date: today(), time: "09:00", duration: "30 min", status: "confirmed", paid: false, amount: "" });
  const set = (k, v) => setVisit(v2 => ({ ...v2, [k]: v }));

  const selectedContact = activeContacts.find(c => c.id === visit.contactId);
  const dogs = visit.contactId ? db.getAll("dogs").filter(d => d.contactId === visit.contactId) : [];
  const cats = visit.contactId ? db.getAll("cats").filter(d => d.contactId === visit.contactId) : [];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">Book a Visit</div>

        <div className="input-group">
          <div className="input-label">Client</div>
          <select className="input" value={visit.contactId} onChange={e => set("contactId", e.target.value)}>
            <option value="">Select client...</option>
            {activeContacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="input-group">
          <div className="input-label">Service</div>
          <div className="chip-row">
            {SERVICES.map(s => <Chip key={s.id} label={s.icon + " " + s.label} active={visit.serviceType === s.id} onClick={() => set("serviceType", s.id)} />)}
          </div>
        </div>

        <div className="input-group">
          <div className="input-label">Date</div>
          <input className="input" type="date" value={visit.date} onChange={e => set("date", e.target.value)} />
        </div>

        <div className="input-group">
          <div className="input-label">Time</div>
          <input className="input" type="time" value={visit.time} onChange={e => set("time", e.target.value)} />
        </div>

        {(visit.serviceType === "dog_walk") && (
          <div className="input-group">
            <div className="input-label">Duration</div>
            <div className="chip-row">
              {DURATIONS.map(d => <Chip key={d} label={d} active={visit.duration === d} onClick={() => set("duration", d)} />)}
            </div>
          </div>
        )}

        <div className="btn-row mt-16">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!visit.contactId || !visit.date} onClick={() => { db.upsert("visits", visit); onSave(visit); onClose(); }}>
            Book Visit ✓
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONTACT DETAIL VIEW
───────────────────────────────────────────── */
function ContactDetail({ contact, onBack, onUpdate }) {
  const [view, setView] = useState("profile"); // profile | message | add_dog | add_cat | edit
  const [editContact, setEditContact] = useState(contact);
  const dogs = db.getAll("dogs").filter(d => d.contactId === contact.id);
  const cats = db.getAll("cats").filter(c => c.contactId === contact.id);
  const visits = db.getAll("visits").filter(v => v.contactId === contact.id).sort((a, b) => b.date.localeCompare(a.date));
  const msgs = db.getAll("messages").filter(m => m.contactId === contact.id).sort((a, b) => a.date.localeCompare(b.date));

  const [selectedDog, setSelectedDog] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showMoveStage, setShowMoveStage] = useState(false);

  const refreshed = db.getAll("contacts").find(c => c.id === contact.id) || contact;

  if (view === "message") return <MessagingTool contact={refreshed} onBack={() => setView("profile")} onSaved={() => { onUpdate?.(); }} />;
  if (view === "add_dog" || selectedDog) return <DogWizard contactId={contact.id} existingDog={selectedDog} onSave={() => { setSelectedDog(null); setView("profile"); onUpdate?.(); }} onBack={() => { setSelectedDog(null); setView("profile"); }} />;
  if (view === "add_cat" || selectedCat) return <CatWizard contactId={contact.id} existingCat={selectedCat} onSave={() => { setSelectedCat(null); setView("profile"); onUpdate?.(); }} onBack={() => { setSelectedCat(null); setView("profile"); }} />;

  const moveStage = (stageId) => {
    const contacts = db.getAll("contacts");
    const idx = contacts.findIndex(c => c.id === contact.id);
    if (idx >= 0) { contacts[idx].stage = stageId; contacts[idx].lastActionDate = now(); db.save("contacts", contacts); }
    setShowMoveStage(false);
    onUpdate?.();
  };

  const makeActive = () => {
    const contacts = db.getAll("contacts");
    const idx = contacts.findIndex(c => c.id === contact.id);
    if (idx >= 0) { contacts[idx].stage = "active"; contacts[idx].lastActionDate = now(); db.save("contacts", contacts); }
    onUpdate?.();
  };

  const togglePaid = (visitId) => {
    const visits = db.getAll("visits");
    const idx = visits.findIndex(v => v.id === visitId);
    if (idx >= 0) { visits[idx].paid = !visits[idx].paid; db.save("visits", visits); onUpdate?.(); }
  };

  return (
    <div>
      {showMoveStage && (
        <div className="modal-overlay" onClick={() => setShowMoveStage(false)}>
          <div className="modal-sheet">
            <div className="modal-handle" />
            <div className="modal-title">Move Stage</div>
            {PIPELINE_STAGES.map(s => (
              <div key={s.id} className="card card-tap" onClick={() => moveStage(s.id)}>
                <div className="row"><span className="dot" style={{ background: s.color, minWidth: 8, height: 8, borderRadius: "50%" }} /><span style={{ fontWeight: 600 }}>{s.label}</span>{refreshed.stage === s.id && <span className="text-green ml-auto">✓ Current</span>}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <BackBtn onBack={onBack} />
      <div className="page-header">
        <div className="row-between">
          <div>
            <div className="page-title">{contact.name}</div>
            <div className="page-sub">{contact.address}</div>
          </div>
          <StagePill stageId={refreshed.stage} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="btn-row mt-16">
        <button className="btn btn-primary btn-sm" onClick={() => setView("message")}>💬 Message</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowMoveStage(true)}>Move Stage</button>
        {refreshed.stage !== "active" && <button className="btn btn-green btn-sm" onClick={makeActive}>Make Active</button>}
      </div>

      {/* Contact info */}
      <div className="section-label">Contact Info</div>
      <div className="card">
        {[["📞", contact.phone], ["🏠", contact.address], ["📮", contact.postcode], ["🔑", contact.accessNotes], ["📱", contact.platform], ["💷", contact.rate ? `£${contact.rate}/walk` : null]].filter(([, v]) => v).map(([icon, val], i) => (
          <div key={i} className="row mt-4"><span style={{ fontSize: 14, minWidth: 20 }}>{icon}</span><span className="text-sm">{val}</span></div>
        ))}
        {contact.notes && <div className="mt-8 text-sm text-muted">{contact.notes}</div>}
      </div>

      {/* Dogs */}
      {dogs.length > 0 && <>
        <div className="section-label">Dogs</div>
        {dogs.map(dog => (
          <div key={dog.id} className="card card-tap" onClick={() => setSelectedDog(dog)}>
            <div className="row-between">
              <div>
                <div style={{ fontWeight: 600 }}>🐕 {dog.name}</div>
                <div className="text-sm text-muted">{dog.breed} · {dog.age}</div>
                <div className="row mt-4 gap-4">
                  {dog.size && <span className="badge badge-muted">{dog.size === "S" ? "Small" : dog.size === "M" ? "Medium" : "Large"}</span>}
                  {dog.goodWithDogs && <span className={`badge ${dog.goodWithDogs === "Yes" ? "badge-green" : dog.goodWithDogs === "No" ? "badge-orange" : "badge-yellow"}`}>{dog.goodWithDogs} with dogs</span>}
                  {dog.meetGreetResult && <span className={`badge ${dog.meetGreetResult === "Great" ? "badge-green" : dog.meetGreetResult === "Fine" ? "badge-purple" : "badge-orange"}`}>{dog.meetGreetResult}</span>}
                </div>
              </div>
              <span className="text-muted">›</span>
            </div>
          </div>
        ))}
      </>}

      {/* Cats */}
      {cats.length > 0 && <>
        <div className="section-label">Cats</div>
        {cats.map(cat => (
          <div key={cat.id} className="card card-tap" onClick={() => setSelectedCat(cat)}>
            <div className="row-between"><div><div style={{ fontWeight: 600 }}>🐱 {cat.name}</div><div className="text-sm text-muted">{cat.age} · {cat.indoorOutdoor}</div></div><span className="text-muted">›</span></div>
          </div>
        ))}
      </>}

      <div className="btn-row mt-4">
        <button className="btn btn-ghost btn-sm" onClick={() => setView("add_dog")}>+ Add Dog</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setView("add_cat")}>+ Add Cat</button>
      </div>

      {/* Visit history */}
      {visits.length > 0 && <>
        <div className="section-label">Visit History</div>
        {visits.map(v => (
          <div key={v.id} className="card card-sm">
            <div className="row-between">
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{SERVICE_ICON[v.serviceType]} {SERVICE_LABEL[v.serviceType]}</div>
                <div className="text-xs text-muted">{fmtDate(v.date)} {v.time && `· ${v.time}`} {v.duration && `· ${v.duration}`}</div>
              </div>
              <div className="row">
                {v.amount && <span className="text-sm text-muted">£{v.amount}</span>}
                <div className={`check-box ${v.paid ? "done" : ""}`} style={{ width: 22, height: 22, borderRadius: 6 }} onClick={() => togglePaid(v.id)}>
                  {v.paid && <span style={{ color: "#001a12", fontSize: 12, fontWeight: 700 }}>✓</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </>}

      {/* Message thread */}
      {msgs.length > 0 && <>
        <div className="section-label">Messages</div>
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {msgs.map(m => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.direction === "out" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "80%", background: m.direction === "out" ? "rgba(108,92,231,0.15)" : "var(--card2)", border: `1px solid ${m.direction === "out" ? "rgba(108,92,231,0.3)" : "var(--border)"}`, borderRadius: 12, padding: "10px 14px" }}>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>{m.text}</div>
                <div className="text-xs text-muted mt-4">{fmtDate(m.date)}</div>
              </div>
            </div>
          ))}
        </div>
      </>}

      <div style={{ height: 32 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: TODAY
───────────────────────────────────────────── */
function TabToday({ onOpenContact, onOpenMessage, refresh }) {
  const [completedActions, setCompletedActions] = useState(() => db.get("completedActions") || {});
  const [completedVisits, setCompletedVisits] = useState(() => db.get("completedVisits") || {});
  const [showNewVisit, setShowNewVisit] = useState(false);
  const [tick, setTick] = useState(0);

  const todayVisits = db.getAll("visits").filter(v => v.date === today() && v.status === "confirmed").sort((a, b) => a.time.localeCompare(b.time));
  const contacts = db.getAll("contacts");
  const messages = db.getAll("messages");
  const visits = db.getAll("visits");
  const actions = computeActions(contacts, messages, visits);

  const waiting = contacts.filter(c => c.stage === "replied");

  const thisWeekVisits = visits.filter(v => {
    const vDate = new Date(v.date);
    const now2 = new Date();
    const startOfWeek = new Date(now2); startOfWeek.setDate(now2.getDate() - now2.getDay() + 1); startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6);
    return vDate >= startOfWeek && vDate <= endOfWeek;
  });

  const earned = thisWeekVisits.filter(v => v.paid && v.amount).reduce((s, v) => s + parseFloat(v.amount || 0), 0);
  const outstanding = thisWeekVisits.filter(v => !v.paid && v.amount).reduce((s, v) => s + parseFloat(v.amount || 0), 0);

  const toggleAction = (actionId) => {
    const next = { ...completedActions, [actionId]: !completedActions[actionId] };
    setCompletedActions(next);
    db.set("completedActions", next);
  };

  const toggleVisit = (visitId) => {
    const next = { ...completedVisits, [visitId]: !completedVisits[visitId] };
    setCompletedVisits(next);
    db.set("completedVisits", next);
    // mark visit done
    const allVisits = db.getAll("visits");
    const idx = allVisits.findIndex(v => v.id === visitId);
    if (idx >= 0) { allVisits[idx].status = next[visitId] ? "completed" : "confirmed"; db.save("visits", allVisits); }
  };

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      {showNewVisit && <NewVisitModal onSave={() => setTick(t => t + 1)} onClose={() => setShowNewVisit(false)} />}

      {/* Header */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 2, color: "var(--muted)", marginBottom: 4 }}>WALKS & WHISKERS</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, lineHeight: 1 }}>{greeting}, Freddie 👋</div>
        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
      </div>

      {/* Quick add */}
      <div className="btn-row mt-16">
        <button className="btn btn-primary" onClick={() => setShowNewVisit(true)}>+ Book Visit</button>
      </div>

      {/* Earnings */}
      <div className="earnings-card">
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 1.5, color: "var(--muted)", marginBottom: 8 }}>THIS WEEK</div>
        <div className="row-between">
          <div><div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "var(--green)" }}>£{earned.toFixed(0)}</div><div className="text-xs text-muted">earned</div></div>
          {outstanding > 0 && <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "var(--yellow)" }}>£{outstanding.toFixed(0)}</div><div className="text-xs text-muted">outstanding</div></div>}
        </div>
      </div>

      {/* Walks today */}
      <div className="section-label">WALKS TODAY</div>
      {todayVisits.length === 0 ? (
        <div style={{ padding: "12px 16px" }}><div className="text-sm text-muted">No walks booked today 🌿</div></div>
      ) : todayVisits.map(v => {
        const c = contacts.find(x => x.id === v.contactId);
        const dogs = db.getAll("dogs").filter(d => d.contactId === v.contactId);
        const isDone = completedVisits[v.id];
        return (
          <div key={v.id} className="card" style={{ opacity: isDone ? 0.5 : 1 }}>
            <div className="check-row">
              <CheckBox done={isDone} onToggle={() => toggleVisit(v.id)} />
              <div className="check-content" onClick={() => c && onOpenContact(c)}>
                <div className="row-between">
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{v.time} — {dogs.map(d => d.name).join(", ") || "Dog"}</div>
                  <span className="badge badge-purple">{v.duration || SERVICE_LABEL[v.serviceType]}</span>
                </div>
                <div className="text-sm text-muted mt-4">{c?.name} · {c?.address?.split(",")[0]}</div>
                <div className="text-xs text-muted mt-4">{SERVICE_ICON[v.serviceType]} {SERVICE_LABEL[v.serviceType]}</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <div className="section-label">ACTIONS</div>
      {actions.length === 0 ? (
        <div style={{ padding: "12px 16px" }}><div className="text-sm text-muted">All caught up! Nothing to action 🎉</div></div>
      ) : actions.map((action, i) => {
        const actionId = `${action.contactId}-${action.type}`;
        const isDone = completedActions[actionId];
        const c = contacts.find(x => x.id === action.contactId);
        return (
          <div key={actionId} className="card" style={{ opacity: isDone ? 0.4 : 1 }}>
            <div className="check-row">
              <CheckBox done={isDone} onToggle={() => toggleAction(actionId)} />
              <div className="check-content">
                <div className="row-between">
                  <div className="row flex-1" onClick={() => !isDone && c && onOpenContact(c)}>
                    <UrgencyDot urgency={action.urgency} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{action.label}</span>
                  </div>
                  {!isDone && c && (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ padding: "7px 14px", fontSize: 13, width: "auto", flexShrink: 0, marginLeft: 8 }}
                      onClick={() => onOpenMessage(c)}
                    >
                      💬 Reply
                    </button>
                  )}
                </div>
                <div className="mt-4" onClick={() => !isDone && c && onOpenContact(c)}><StagePill stageId={action.stage} /></div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Waiting */}
      {waiting.length > 0 && <>
        <div className="section-label">WAITING ON</div>
        {waiting.map(c => (
          <div key={c.id} className="card card-tap card-sm" onClick={() => onOpenContact(c)}>
            <div className="row-between">
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div><div className="text-xs text-muted">Replied — awaiting response</div></div>
              <span className="text-muted">›</span>
            </div>
          </div>
        ))}
      </>}

      <div style={{ height: 16 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: PIPELINE
───────────────────────────────────────────── */
function TabPipeline({ onOpenContact, refresh }) {
  const [filterStage, setFilterStage] = useState("all");
  const [showNewContact, setShowNewContact] = useState(false);
  const [tick, setTick] = useState(0);

  const contacts = db.getAll("contacts").filter(c => c.stage !== "active");

  const filtered = filterStage === "all" ? contacts : contacts.filter(c => c.stage === filterStage);
  const grouped = {};
  for (const s of PIPELINE_STAGES) {
    grouped[s.id] = contacts.filter(c => c.stage === s.id);
  }

  if (showNewContact) return <NewContactWizard onSave={() => { setShowNewContact(false); setTick(t => t + 1); }} onBack={() => setShowNewContact(false)} />;

  return (
    <div>
      <div className="page-header mt-8">
        <div className="row-between">
          <div className="page-title">Pipeline</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 1, color: "var(--muted)" }}>{contacts.length} people</div>
        </div>
      </div>

      <div className="btn-row mt-12">
        <button className="btn btn-primary" onClick={() => setShowNewContact(true)}>+ New Enquiry</button>
      </div>

      {/* Stage filter pills */}
      <div className="pill-tabs mt-8">
        <button className={`pill-tab ${filterStage === "all" ? "active" : ""}`} onClick={() => setFilterStage("all")}>All ({contacts.length})</button>
        {PIPELINE_STAGES.map(s => grouped[s.id].length > 0 && (
          <button key={s.id} className={`pill-tab ${filterStage === s.id ? "active" : ""}`} onClick={() => setFilterStage(s.id)}>
            {s.label} ({grouped[s.id].length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">🔍</div><h3>Nothing here</h3><p>Add a new enquiry to get started</p></div>
      ) : filtered.map(c => (
        <div key={c.id} className="card card-tap" onClick={() => onOpenContact(c)}>
          <div className="row-between">
            <div className="flex-1">
              <div className="row" style={{ gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{c.name}</span>
              </div>
              <div className="row mt-4" style={{ gap: 8 }}>
                <StagePill stageId={c.stage} />
                {c.platform && <span className="badge badge-muted">{c.platform}</span>}
                {c.serviceType && <span className="text-xs text-muted">{SERVICE_ICON[c.serviceType]}</span>}
              </div>
              {c.address && <div className="text-xs text-muted mt-4">{c.address}</div>}
              <div className="text-xs text-muted mt-2">Added {fmtDate(c.createdAt)}</div>
            </div>
            <span className="text-muted">›</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: CLIENTS
───────────────────────────────────────────── */
function TabClients({ onOpenContact }) {
  const [search, setSearch] = useState("");
  const contacts = db.getAll("contacts").filter(c => c.stage === "active");
  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.address || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header mt-8">
        <div className="row-between">
          <div className="page-title">Clients</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 1, color: "var(--muted)" }}>{contacts.length} active</div>
        </div>
      </div>

      <div style={{ padding: "12px 16px" }}>
        <input className="input" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">🐾</div><h3>No active clients yet</h3><p>Move someone from the Pipeline to Active to see them here</p></div>
      ) : filtered.map(c => {
        const dogs = db.getAll("dogs").filter(d => d.contactId === c.id);
        const cats = db.getAll("cats").filter(d => d.contactId === c.id);
        const lastVisit = db.getAll("visits").filter(v => v.contactId === c.id && v.status === "completed").sort((a, b) => b.date.localeCompare(a.date))[0];
        return (
          <div key={c.id} className="card card-tap" onClick={() => onOpenContact(c)}>
            <div className="row-between">
              <div className="flex-1">
                <div style={{ fontWeight: 600, fontSize: 16 }}>{c.name}</div>
                <div className="text-sm text-muted mt-2">
                  {dogs.map(d => `🐕 ${d.name}`).join(" · ")}
                  {cats.map(d => ` 🐱 ${d.name}`).join(" · ")}
                </div>
                <div className="text-xs text-muted mt-4">{c.address?.split(",")[0]} · {c.platform}</div>
                {lastVisit && <div className="text-xs text-muted mt-2">Last visit: {fmtDate(lastVisit.date)}</div>}
              </div>
              <span className="text-muted">›</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB: SCHEDULE
───────────────────────────────────────────── */
function TabSchedule({ onOpenContact }) {
  const [showNewVisit, setShowNewVisit] = useState(false);
  const [tick, setTick] = useState(0);

  const visits = db.getAll("visits").filter(v => v.status === "confirmed" || v.status === "completed").sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const contacts = db.getAll("contacts");

  // Group by date
  const grouped = {};
  for (const v of visits) {
    if (!grouped[v.date]) grouped[v.date] = [];
    grouped[v.date].push(v);
  }

  const dates = Object.keys(grouped).sort();
  const todayStr = today();

  const upcomingDates = dates.filter(d => d >= todayStr);
  const pastDates = dates.filter(d => d < todayStr).reverse().slice(0, 5);

  const renderVisitCard = (v, isPast) => {
    const c = contacts.find(x => x.id === v.contactId);
    const dogs = db.getAll("dogs").filter(d => d.contactId === v.contactId);
    return (
      <div key={v.id} className="card card-tap card-sm" style={{ opacity: isPast || v.status === "completed" ? 0.5 : 1 }} onClick={() => c && onOpenContact(c)}>
        <div className="row-between">
          <div>
            <div className="row" style={{ gap: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{v.time || "—"}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{SERVICE_ICON[v.serviceType]} {dogs.map(d => d.name).join(", ") || c?.name}</span>
            </div>
            <div className="text-xs text-muted mt-2">{SERVICE_LABEL[v.serviceType]} {v.duration ? `· ${v.duration}` : ""}</div>
            {c && <div className="text-xs text-muted">{c.address?.split(",")[0]}</div>}
          </div>
          {v.status === "completed" && <span className="badge badge-green">Done</span>}
        </div>
      </div>
    );
  };

  const renderDateGroup = (dateStr, isPast = false) => {
    const d = new Date(dateStr + "T12:00:00");
    const isToday = dateStr === todayStr;
    return (
      <div key={dateStr}>
        <div className="section-label" style={{ color: isToday ? "var(--green)" : "var(--muted)" }}>
          {isToday ? "TODAY · " : ""}{d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
        </div>
        {grouped[dateStr].map(v => renderVisitCard(v, isPast))}
      </div>
    );
  };

  return (
    <div>
      {showNewVisit && <NewVisitModal onSave={() => setTick(t => t + 1)} onClose={() => setShowNewVisit(false)} />}

      <div className="page-header mt-8">
        <div className="page-title">Schedule</div>
        <div className="page-sub">All upcoming confirmed visits</div>
      </div>

      <div className="btn-row mt-12">
        <button className="btn btn-primary" onClick={() => setShowNewVisit(true)}>+ Book Visit</button>
      </div>

      {upcomingDates.length === 0 && (
        <div className="empty-state"><div className="icon">📅</div><h3>Nothing booked yet</h3><p>Tap + Book Visit to add your first confirmed walk</p></div>
      )}

      {upcomingDates.map(d => renderDateGroup(d, false))}

      {pastDates.length > 0 && (
        <>
          <div style={{ height: 8 }} />
          {pastDates.map(d => renderDateGroup(d, true))}
        </>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   TAB: MESSAGE (standalone, no contact required)
───────────────────────────────────────────── */
function TabMessage({ preloadContact, onClearPreload }) {
  const [started, setStarted] = useState(!!preloadContact);
  const [contact, setContact] = useState(preloadContact || null);
  const [tick, setTick] = useState(0);

  // If a preloaded contact arrives after mount, start immediately
  useEffect(() => {
    if (preloadContact) { setContact(preloadContact); setStarted(true); }
  }, [preloadContact?.id]);

  const contacts = db.getAll("contacts").filter(c => !["not_proceeding"].includes(c.stage));

  const reset = () => { setStarted(false); setContact(null); onClearPreload?.(); };

  if (started) {
    return <MessagingTool contact={contact} onBack={reset} onSaved={reset} />;
  }

  return (
    <div>
      <div className="page-header mt-8 mb-16">
        <div className="page-title">Message Tool</div>
        <div className="page-sub">Write a reply or draft a new message</div>
      </div>

      {/* Quick start — no contact */}
      <div className="section-label">QUICK START</div>
      <div className="card card-tap" onClick={() => { setContact(null); setStarted(true); }}>
        <div className="row">
          <span style={{ fontSize: 28 }}>✍️</span>
          <div className="col flex-1">
            <div style={{ fontWeight: 600, fontSize: 16 }}>New enquiry reply</div>
            <div className="text-sm text-muted">Someone messaged — paste it in and get a draft</div>
          </div>
          <span className="text-muted">›</span>
        </div>
      </div>

      {/* Pick a contact */}
      <div className="section-label">OR PICK A CONTACT</div>
      {contacts.length === 0 ? (
        <div style={{ padding: "12px 16px" }}><div className="text-sm text-muted">No contacts yet — add an enquiry in Pipeline first</div></div>
      ) : contacts.map(c => (
        <div key={c.id} className="card card-tap" onClick={() => { setContact(c); setStarted(true); }}>
          <div className="row-between">
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
              <div className="row mt-4" style={{ gap: 6 }}>
                <StagePill stageId={c.stage} />
                {c.platform && <span className="badge badge-muted">{c.platform}</span>}
              </div>
            </div>
            <span style={{ fontSize: 20 }}>💬</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
const TABS = [
  { id: "today",    label: "Today",    icon: "🏠" },
  { id: "pipeline", label: "Pipeline", icon: "📊" },
  { id: "clients",  label: "Clients",  icon: "🐾" },
  { id: "message",  label: "Message",  icon: "💬" },
  { id: "schedule", label: "Schedule", icon: "📅" },
];

export default function App() {
  const [tab, setTab] = useState("today");
  const [selectedContact, setSelectedContact] = useState(null);
  const [messagePreload, setMessagePreload] = useState(null); // contact to preload in message tab
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  const openContact = (c) => setSelectedContact(c);
  const closeContact = () => { setSelectedContact(null); refresh(); };

  // Called from Today screen actions — jump straight to messaging for a contact
  const openMessage = (c) => { setMessagePreload(c); setTab("message"); };

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        <div className="tab-content">
          {selectedContact ? (
            <ContactDetail contact={selectedContact} onBack={closeContact} onUpdate={refresh} />
          ) : (
            <>
              {tab === "today"    && <TabToday    key={tick} onOpenContact={openContact} onOpenMessage={openMessage} refresh={refresh} />}
              {tab === "pipeline" && <TabPipeline key={tick} onOpenContact={openContact} refresh={refresh} />}
              {tab === "clients"  && <TabClients  key={tick} onOpenContact={openContact} />}
              {tab === "message"  && <TabMessage  key={tick} preloadContact={messagePreload} onClearPreload={() => setMessagePreload(null)} />}
              {tab === "schedule" && <TabSchedule key={tick} onOpenContact={openContact} />}
            </>
          )}
        </div>

        {!selectedContact && (
          <nav className="bottom-nav">
            {TABS.map(t => (
              <button key={t.id} className={`nav-tab ${tab === t.id ? "active" : ""}`} onClick={() => { if (t.id !== "message") setMessagePreload(null); setTab(t.id); }}>
                <span className="nav-icon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
