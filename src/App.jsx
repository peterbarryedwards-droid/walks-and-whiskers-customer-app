import { useState, useRef, useCallback } from "react";

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
  .section-label { font-family: 'Bebas Neue', sans-serif; font-size: 12px; letter-spacing: 1.5px; color: var(--muted); padding: 0 16px; margin-bottom: 8px; margin-top: 20px; display: flex; align-items: center; gap: 8px; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .page-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 1px; line-height: 1; }
  .page-sub { font-size: 13px; color: var(--muted); margin-top: 3px; }
  .btn { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 11px 16px; border-radius: var(--radius); border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; transition: opacity 0.15s, transform 0.1s; -webkit-tap-highlight-color: transparent; width: 100%; }
  .btn:active { transform: scale(0.97); opacity: 0.85; }
  .btn-primary { background: var(--purple); color: white; }
  .btn-green { background: var(--green); color: #001a12; }
  .btn-ghost { background: transparent; border: 1px solid var(--border2); color: var(--muted); }
  .btn-orange { background: var(--orange); color: white; }
  .btn-sm { padding: 6px 11px; font-size: 12px; width: auto; border-radius: var(--radius-sm); font-weight: 600; }
  .btn-xs { padding: 4px 8px; font-size: 11px; width: auto; border-radius: 6px; font-weight: 600; }
  .btn-row { display: flex; gap: 8px; padding: 0 16px; margin-bottom: 10px; }
  .btn-row .btn { flex: 1; }
  .input { background: #0d0f18; border: 2px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 12px 14px; width: 100%; outline: none; transition: border-color 0.2s; line-height: 1.5; }
  .input:focus { border-color: var(--purple); }
  .input::placeholder { color: var(--muted2); }
  textarea.input { resize: vertical; }
  .input-label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .input-group { margin-bottom: 14px; }
  .chip { padding: 8px 14px; border-radius: 20px; border: 1.5px solid var(--border); background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; -webkit-tap-highlight-color: transparent; white-space: nowrap; }
  .chip.ap { border-color: var(--purple); background: rgba(108,92,231,0.15); color: var(--purple); }
  .chip.ag { border-color: var(--green); background: rgba(0,184,148,0.12); color: var(--green); }
  .chip.ao { border-color: var(--orange); background: rgba(225,112,85,0.12); color: var(--orange); }
  .chip.ay { border-color: var(--yellow); background: rgba(253,203,110,0.1); color: var(--yellow); }
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
  .back-btn { display: flex; align-items: center; gap: 6px; color: var(--purple); font-size: 14px; font-weight: 600; padding: 12px 16px 4px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .row { display: flex; align-items: center; gap: 8px; }
  .row-between { display: flex; align-items: center; justify-content: space-between; }
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
  .pill-tab { padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.15s; -webkit-tap-highlight-color: transparent; }
  .pill-tab.active { background: var(--purple); border-color: var(--purple); color: white; }
  .toast { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); background: var(--card2); border: 1px solid var(--border2); border-radius: 12px; padding: 10px 18px; font-weight: 700; font-size: 13px; z-index: 999; white-space: nowrap; }
  .type-card { background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 13px 14px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 12px; margin-bottom: 9px; -webkit-tap-highlight-color: transparent; }
  .type-card:active { background: var(--card2); }
`;

/* DATA */
const db = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  getAll: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : []; } catch { return []; } },
  upsert: (k, item) => { const items = db.getAll(k); const i = items.findIndex(x => x.id === item.id); if (i >= 0) items[i] = item; else items.push(item); db.set(k, items); return item; },
  remove: (k, id) => { db.set(k, db.getAll(k).filter(x => x.id !== id)); },
};

const uid = () => Math.random().toString(36).slice(2, 10);
const todayStr = () => new Date().toISOString().split("T")[0];
const nowStr = () => new Date().toISOString();
const fmtDate = d => { if (!d) return ""; return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };
const MS_PER_DAY = 86400000;
const MS_PER_HOUR = 3600000;
const daysSince = d => { const ms = Date.now() - new Date(d).getTime(); return Math.floor(ms / MS_PER_DAY); };

/* CONSTANTS */
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
  { id: "quote",           label: "Price Enquiry",    icon: "💷", color: "#fdcb6e", desc: "They want to know your rates" },
  { id: "confirm",         label: "General Response", icon: "💬", color: "#0984e3", desc: "Follow ups, anything else" },
  { id: "decline",         label: "Turn Down a Job",  icon: "🙏", color: "#e17055", desc: "Can't take it — be kind" },
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

const DEFAULT_PRICES = [
  { id: "walk_30",    service: "Dog Walk",             detail: "30 minutes",      price: 15 },
  { id: "walk_60",    service: "Dog Walk",             detail: "60 minutes",      price: 20 },
  { id: "dropin_dog", service: "Dog Drop-in",          detail: "30 min visit",    price: 15 },
  { id: "dropin_cat", service: "Cat Visit",            detail: "30 min visit",    price: 12 },
  { id: "sit_dog",    service: "Home Sit / Stay Over", detail: "Dogs per night",  price: 40, prefix: "from " },
  { id: "sit_cat",    service: "Home Sit / Stay Over", detail: "Cats per night",  price: 25, prefix: "from " },
];
const getPrices = () => db.get("prices") || DEFAULT_PRICES;
const pricesText = () => getPrices().map(p => p.service + " (" + p.detail + "): " + (p.prefix || "") + "£" + p.price).join("\n");

/* SYSTEM PROMPTS */
const PROMPTS = {
  new_client: (platform, prices) => `You help Freddie, a dog walker in Winchester, reply to new client enquiries.
${(platform === "Direct" || platform === "Other") ? "Freddie's rates:\n" + prices : "Platform is " + platform + " — NEVER mention rates, the platform sets them."}
Reply structure: 1) thank them 2) ask location if unknown 3) ask dates if unknown 4) ${(platform === "Direct" || platform === "Other") ? "mention relevant rate" : "do not mention rate"} 5) suggest meet and greet naturally 6) close warmly.
Sign off as Freddie. British English.
Format with exactly:
DRAFT REPLY
QUESTIONS TO ASK`,

  existing_client: () => `You help Freddie reply to an existing client. Skip introductions and meet and greet. Warm and efficient. Sign off as Freddie. British English.
Format with exactly:
DRAFT REPLY`,

  quote: (platform) => `You help Freddie respond to a price enquiry. ${(platform === "Direct" || platform === "Other") ? "State rates clearly." : "Platform is " + platform + " — NEVER mention rates."} Sign off as Freddie. British English.
Format with exactly:
DRAFT REPLY
WHAT TO MENTION`,

  confirm: () => `You help Freddie send a general response. Warm and helpful. Sign off as Freddie. British English.
Format with exactly:
DRAFT REPLY
MISSING INFO TO GET`,

  decline: () => `You help Freddie politely decline a job. Kind and brief. Sign off as Freddie. British English.
Format with exactly:
DRAFT REPLY
ONE TIP`,
};

/* AI */
async function callClaude(prompt, maxTokens) {
  const tokens = maxTokens || 1200;
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), 30000);
  try {
    const r = await fetch("/api/chat", {
      method: "POST", signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: tokens, messages: [{ role: "user", content: prompt }] }),
    });
    clearTimeout(tid);
    if (!r.ok) throw new Error("API " + r.status);
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    return d.content[0].text || "";
  } catch (e) { clearTimeout(tid); throw e; }
}

async function callClaudeJSON(prompt) {
  const text = await callClaude(prompt, 1200);
  const clean = text.replace(new RegExp("```json|```", "g"), "").trim();
  try { return JSON.parse(clean); } catch { return {}; }
}

function parseSections(text) {
  const headers = ["DRAFT REPLY", "QUESTIONS TO ASK", "WHAT TO MENTION", "MISSING INFO TO GET", "ONE TIP"];
  const sections = [];
  for (const h of headers) {
    const idx = text.toUpperCase().indexOf(h);
    if (idx === -1) continue;
    let content = text.slice(idx + h.length).replace(new RegExp("^[\\s:*#\\-]+"), "");
    let cut = content.length;
    for (const other of headers) {
      if (other === h) continue;
      const oi = content.toUpperCase().indexOf(other);
      if (oi > 0 && oi < cut) cut = oi;
    }
    content = content.slice(0, cut).trim();
    if (!content) continue;
    // Skip "no questions needed" placeholders
    const lower = content.toLowerCase();
    if (h === "QUESTIONS TO ASK" && (lower.includes("no additional") || lower.includes("no questions") || lower.includes("all key information"))) continue;
    const key = h === "DRAFT REPLY" ? "draft" : "extra";
    if (!sections.find(s => s.key === key)) sections.push({ key, label: h, content });
  }
  if (!sections.find(s => s.key === "draft")) sections.push({ key: "draft", label: "RESPONSE", content: text.trim() });
  return sections;
}

/* CHASE LOGIC */
function computeActions(people) {
  const actions = [];
  for (const p of people) {
    if (p.stage === "not_proceeding") continue;
    const msgs = p.messages || [];
    const lastOut = [...msgs].reverse().find(m => m.role === "freddie");
    const lastIn  = [...msgs].reverse().find(m => m.role === "client");
    const unreplied = lastIn && (!lastOut || lastIn.date > lastOut.date);
    if (unreplied) {
      const elapsed = Date.now() - new Date(lastIn.date).getTime();
      if (elapsed > MS_PER_HOUR * 12) actions.push({ personId: p.id, type: "reply", label: "Reply to " + (p.name || "someone"), urgency: "high", stage: p.stage });
    }
    const age = daysSince(p.lastActionDate || p.createdAt);
    if (p.stage === "new_enquiry") actions.push({ personId: p.id, type: "reply_new", label: "Reply to " + (p.name || "new enquiry"), urgency: "high", stage: p.stage });
    if (p.stage === "replied" && age >= 1) actions.push({ personId: p.id, type: "chase", label: "Chase " + p.name + " — no reply for " + age + "d", urgency: "medium", stage: p.stage });
    if (p.stage === "interested" && age >= 1) actions.push({ personId: p.id, type: "arrange_meet", label: "Arrange meet with " + p.name, urgency: "medium", stage: p.stage });
    if (p.stage === "meet_arranged" && age >= 2) actions.push({ personId: p.id, type: "chase", label: "Chase " + p.name + " — meet booked but gone quiet", urgency: "medium", stage: p.stage });
    if (p.stage === "met" && age >= 1) actions.push({ personId: p.id, type: "chase_booking", label: "Follow up " + p.name + " — met but no booking yet", urgency: "medium", stage: p.stage });
  }
  return actions;
}

/* BULK DATE PARSER — no inline regex */
function parseBulkDates(dateStr) {
  if (!dateStr || dateStr === "null") return [];
  const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  const MONTH_FULL = ["january","february","march","april","may","june","july","august","september","october","november","december"];
  const yr = new Date().getFullYear();
  const results = [];

  // Extract times: look for digits followed by am/pm
  const times = [];
  const timeRx = new RegExp("(\\d{1,2})(?::(\\d{2}))?\\s*(am|pm)", "gi");
  let tm;
  while ((tm = timeRx.exec(dateStr)) !== null) {
    let h = parseInt(tm[1], 10);
    const min = tm[2] || "00";
    const period = tm[3].toLowerCase();
    if (period === "pm" && h < 12) h += 12;
    if (period === "am" && h === 12) h = 0;
    times.push(String(h).padStart(2, "0") + ":" + min);
  }

  // Split on commas and "and" to get date chunks
  const raw = dateStr.replace(new RegExp("\\band\\b", "gi"), ",");
  const chunks = raw.split(",");
  const dates = [];
  for (const chunk of chunks) {
    const lower = chunk.toLowerCase().trim();
    let mIdx = -1;
    for (let i = 0; i < MONTHS.length; i++) {
      if (lower.indexOf(MONTHS[i]) !== -1 || lower.indexOf(MONTH_FULL[i]) !== -1) { mIdx = i; break; }
    }
    if (mIdx === -1) continue;
    const numRx = new RegExp("\\d{1,2}");
    const nm = chunk.match(numRx);
    if (!nm) continue;
    const day = parseInt(nm[0], 10);
    if (day < 1 || day > 31) continue;
    const d = new Date(yr, mIdx, day);
    if (!isNaN(d.getTime())) dates.push(d.toISOString().split("T")[0]);
  }

  if (dates.length === 0 && times.length === 0) return [];
  if (dates.length > 0 && times.length > 0) {
    for (const date of dates) for (const time of times) results.push({ date, time });
  } else if (dates.length > 0) {
    for (const date of dates) results.push({ date, time: "" });
  } else {
    for (const time of times) results.push({ date: "", time });
  }
  return results;
}

/* SMALL COMPONENTS */
function StagePill({ stageId }) {
  const s = STAGE_MAP[stageId] || { label: stageId, color: "#555" };
  return <span className="stage-pill" style={{ background: s.color + "22", color: s.color }}>{s.label}</span>;
}
function Spinner({ large }) {
  return <div className={"spinner" + (large ? " spinner-lg" : "")} />;
}
function BackBtn({ onBack, label }) {
  return <div className="back-btn" onClick={onBack}>{"← " + (label || "Back")}</div>;
}
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className="btn btn-ghost mt-8" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      {copied ? "✓ Copied!" : "📋 Copy to clipboard"}
    </button>
  );
}
function Chip({ label, active, color, onClick }) {
  const cls = active ? ("chip " + (color === "g" ? "ag" : color === "o" ? "ao" : color === "y" ? "ay" : "ap")) : "chip";
  return <button className={cls} onClick={onClick}>{label}</button>;
}
function CheckBox({ done, onToggle }) {
  return (
    <div className={"check-box" + (done ? " done" : "")} onClick={onToggle}>
      {done && <span style={{ color: "#001a12", fontSize: 13, fontWeight: 800 }}>✓</span>}
    </div>
  );
}

/* MESSAGING FLOW */
function MessagingFlow({ person, onBack, onPersonUpdated }) {
  const initScreen = (person && person.messages && person.messages.length > 0) ? "thread" : "type";
  const [screen, setScreen] = useState(initScreen);
  const [enquiryType, setEnquiryType] = useState(null);
  const [platform, setPlatform] = useState((person && person.platform) || "Rover");
  const [rawMessage, setRawMessage] = useState("");
  const [extracted, setExtracted] = useState({});
  const [dynamicQs, setDynamicQs] = useState([]);
  const [qStep, setQStep] = useState(0);
  const [qAnswers, setQAnswers] = useState({});
  const [qInput, setQInput] = useState("");
  const [sections, setSections] = useState([]);
  const [draftText, setDraftText] = useState("");
  const [tweakInput, setTweakInput] = useState("");
  const [tweaking, setTweaking] = useState(false);
  const [followUpMsg, setFollowUpMsg] = useState("");
  const [toast, setToast] = useState(null);
  const [intent, setIntent] = useState(null);
  const [bookingForm, setBookingForm] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingVal, setEditingVal] = useState("");
  const [currentPerson, setCurrentPerson] = useState(person);
  const inputRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const typeColor = (enquiryType && enquiryType.color) || "#6c5ce7";

  const savePerson = (updates) => {
    const people = db.getAll("people");
    const existing = people.find(p => p.id === (currentPerson && currentPerson.id));
    if (existing) {
      const merged = Object.assign({}, existing, updates);
      db.upsert("people", merged);
      setCurrentPerson(merged);
      if (onPersonUpdated) onPersonUpdated();
      return merged;
    }
    const newP = Object.assign({ id: uid(), createdAt: nowStr(), lastActionDate: nowStr(), stage: "new_enquiry", messages: [] }, updates);
    db.upsert("people", newP);
    setCurrentPerson(newP);
    if (onPersonUpdated) onPersonUpdated();
    return newP;
  };

  const saveFieldEdit = (field) => {
    const people = db.getAll("people");
    const idx = people.findIndex(p => p.id === (currentPerson && currentPerson.id));
    if (idx >= 0) {
      people[idx].extracted = Object.assign({}, people[idx].extracted || {}, { [field]: editingVal });
      db.set("people", people);
      setCurrentPerson(people[idx]);
      if (onPersonUpdated) onPersonUpdated();
    }
    setEditingField(null);
  };

  const openBookingForm = (isMeet) => {
    const ext = (currentPerson && currentPerson.extracted) || {};
    const datesHint = isMeet ? null : (ext.dates && ext.dates !== "null" ? ext.dates : null);
    const bulk = datesHint ? parseBulkDates(datesHint) : [];
    if (bulk.length > 1) {
      setBookingForm({ bulk: true, bulkDates: bulk.map(d => Object.assign({}, d, { selected: true })), serviceType: (currentPerson && currentPerson.serviceType) || "dog_walk", duration: "30 min", isMeet: false, datesHint });
    } else {
      const single = bulk[0] || {};
      setBookingForm({ date: single.date || "", time: single.time || "", serviceType: (currentPerson && currentPerson.serviceType) || "dog_walk", duration: "30 min", isMeet, datesHint: isMeet ? null : datesHint });
    }
  };

  const saveBooking = () => {
    if (!bookingForm || !currentPerson) return;
    const allVisits = db.getAll("visits");

    if (bookingForm.bulk) {
      const selected = bookingForm.bulkDates.filter(d => d.selected && d.date);
      if (!bookingForm.conflictOk) {
        const clash = selected.find(d => allVisits.some(v => v.date === d.date && v.time && d.time && v.time === d.time && v.personId !== currentPerson.id));
        if (clash) { setBookingForm(b => Object.assign({}, b, { conflict: true })); return; }
      }
      for (const d of selected) {
        db.upsert("visits", { id: uid(), personId: currentPerson.id, serviceType: bookingForm.serviceType || "dog_walk", date: d.date, time: d.time, duration: bookingForm.duration || "30 min", status: "confirmed", isMeetGreet: false, paid: false, amount: "" });
      }
      savePerson({ stage: "active", lastActionDate: nowStr() });
      setBookingForm(null);
      showToast(selected.length + " visit" + (selected.length !== 1 ? "s" : "") + " added ✓");
      return;
    }

    if (!bookingForm.conflictOk) {
      const clash = allVisits.find(v => v.date === bookingForm.date && v.time && bookingForm.time && v.time === bookingForm.time && v.personId !== currentPerson.id);
      if (clash) { setBookingForm(b => Object.assign({}, b, { conflict: true })); return; }
    }
    db.upsert("visits", { id: uid(), personId: currentPerson.id, serviceType: bookingForm.serviceType || (currentPerson && currentPerson.serviceType) || "dog_walk", date: bookingForm.date || todayStr(), time: bookingForm.time || "", duration: bookingForm.duration || "", status: "confirmed", isMeetGreet: bookingForm.isMeet || false, paid: false, amount: "" });
    savePerson({ stage: bookingForm.isMeet ? "meet_arranged" : "active", lastActionDate: nowStr() });
    setBookingForm(null);
    showToast(bookingForm.isMeet ? "Meet and greet added ✓" : "Booking added ✓");
  };

  const analyseMessage = async () => {
    if (!rawMessage.trim()) return;
    setScreen("analysing");
    const isExisting = enquiryType && enquiryType.id === "existing_client";
    const prompt = "You are helping Freddie, a dog walker, analyse an enquiry on " + platform + ".\n" +
      "Enquiry type: " + (enquiryType && enquiryType.label) + "\nMessage: \"\"\"" + rawMessage + "\"\"\"\n\n" +
      "Extract all visible info. Identify what is genuinely missing.\n" +
      "Reply with ONLY valid JSON:\n" +
      "{\"extracted\":{\"client_name\":null,\"dog_name\":null,\"service\":null,\"dates\":null,\"location\":null,\"rate\":null,\"recurring\":null,\"notes\":null}," +
      "\"questions\":[{\"field\":\"field_name\",\"question\":\"friendly question\",\"hint\":\"short hint\",\"required\":true}]}\n" +
      "Rules:\n- Only ask about genuinely missing fields\n" +
      "- dog_name: if missing hint is Check the " + platform + " profile or type skip, required false\n" +
      "- location: if missing required true\n" +
      "- rate: ONLY ask if platform is Direct or Other, NEVER for Rover or Bark\n" +
      (isExisting ? "- Existing client — minimal questions\n" : "") +
      "- questions can be empty []";
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
    const allData = Object.assign({}, extracted, finalAnswers);
    const context = Object.entries(allData).filter(function(e) { return e[1] && e[1] !== "null"; }).map(function(e) { return e[0] + ": " + e[1]; }).join("\n");
    const msgs = (currentPerson && currentPerson.messages) || [];
    const history = msgs.map(function(m) { return (m.role === "client" ? "Client" : "Freddie") + ": " + (m.text || m.draft); }).join("\n\n");
    const et = (enquiryType && enquiryType.id) || "new_client";
    let systemPrompt = "";
    if (et === "new_client") systemPrompt = PROMPTS.new_client(platform, pricesText());
    else if (et === "existing_client") systemPrompt = PROMPTS.existing_client();
    else if (et === "quote") systemPrompt = PROMPTS.quote(platform);
    else if (et === "confirm") systemPrompt = PROMPTS.confirm();
    else systemPrompt = PROMPTS.decline();
    const prompt = systemPrompt + "\n\nPlatform: " + platform + "\nOriginal message: " + rawMessage + (history ? "\n\nConversation so far:\n" + history : "") + "\n\nKnown information:\n" + (context || "(none)");
    const intentPrompt = "Read this client message and return JSON only:\nMessage: \"" + rawMessage + "\"\nConversation: \"" + history + "\"\nReturn: {\"suggested_stage\":\"new_enquiry|replied|interested|meet_arranged|met|active|gone_quiet\",\"booking_detected\":true or false,\"meet_detected\":true or false,\"booking_summary\":\"brief summary or null\"}";
    try {
      const [raw, intentResult] = await Promise.all([callClaude(prompt, 1000), callClaudeJSON(intentPrompt)]);
      const parsed = parseSections(raw);
      const draftSection = parsed.find(s => s.key === "draft");
      setSections(parsed);
      setDraftText((draftSection && draftSection.content) || raw);
      const clientMsg = { role: "client", text: rawMessage, date: nowStr() };
      const extra = parsed.find(s => s.key === "extra");
      const freddieMsg = { role: "freddie", draft: (draftSection && draftSection.content) || raw, questions: extra ? extra.content : null, date: nowStr() };
      const name = allData.client_name && allData.client_name !== "null" ? allData.client_name : (currentPerson && currentPerson.name) || "Unknown";
      const curStage = (currentPerson && currentPerson.stage) || "new_enquiry";
      const newStage = intentResult.suggested_stage || (curStage === "new_enquiry" ? "replied" : curStage);
      savePerson({ name, platform, stage: newStage, lastActionDate: nowStr(), extracted: allData, messages: msgs.concat([clientMsg, freddieMsg]), serviceType: allData.service || (currentPerson && currentPerson.serviceType), address: allData.location || (currentPerson && currentPerson.address) });
      setIntent(intentResult);
      setScreen("result");
    } catch { setScreen("error"); }
  };

  const generateFollowUp = async () => {
    if (!followUpMsg.trim() || !currentPerson) return;
    setScreen("loading");
    const msgs = currentPerson.messages || [];
    const history = msgs.map(function(m) { return (m.role === "client" ? "Client" : "Freddie") + ": " + (m.text || m.draft); }).join("\n\n");
    const known = Object.entries(currentPerson.extracted || {}).filter(function(e) { return e[1] && e[1] !== "null"; }).map(function(e) { return e[0] + ": " + e[1]; }).join("\n");
    const prompt = "You help Freddie, a dog walker, reply to a follow-up message.\nConversation:\n" + history + "\nClient latest message: \"" + followUpMsg + "\"\nKnown:\n" + (known || "(not much yet)") + "\nWarm, natural reply. Don't re-introduce. Sign off as Freddie. British English.\nFormat with:\nDRAFT REPLY\nONE TIP";
    const intentPrompt = "Read this client message and return JSON only:\nMessage: \"" + followUpMsg + "\"\nConversation: \"" + history + "\"\nReturn: {\"suggested_stage\":\"new_enquiry|replied|interested|meet_arranged|met|active|gone_quiet\",\"booking_detected\":true or false,\"meet_detected\":true or false,\"booking_summary\":\"brief summary or null\"}";
    try {
      const [raw, intentResult] = await Promise.all([callClaude(prompt, 1000), callClaudeJSON(intentPrompt)]);
      const parsed = parseSections(raw);
      const draftSection = parsed.find(s => s.key === "draft");
      setSections(parsed);
      setDraftText((draftSection && draftSection.content) || raw);
      const clientMsg = { role: "client", text: followUpMsg, date: nowStr() };
      const extra = parsed.find(s => s.key === "extra");
      const freddieMsg = { role: "freddie", draft: (draftSection && draftSection.content) || raw, questions: extra ? extra.content : null, date: nowStr() };
      const newStage = intentResult.suggested_stage || currentPerson.stage;
      savePerson({ messages: msgs.concat([clientMsg, freddieMsg]), lastActionDate: nowStr(), stage: newStage });
      setFollowUpMsg("");
      setIntent(intentResult);
      setScreen("result");
    } catch { showToast("Couldn't generate — try again"); setScreen("thread"); }
  };

  const tweakDraft = async () => {
    if (!tweakInput.trim()) return;
    setTweaking(true);
    try {
      const raw = await callClaude("You help Freddie, a dog walker. Here is his current draft:\n\n\"" + draftText + "\"\n\nHe wants to change this: \"" + tweakInput + "\"\n\nRewrite the draft with his change. Return ONLY the updated draft, nothing else. Keep Freddie's voice — warm, professional, British English.", 800);
      setDraftText(raw.trim());
      setTweakInput("");
    } catch { showToast("Couldn't update — try again"); }
    setTweaking(false);
  };

  const nextQ = () => {
    if (!qInput.trim()) return;
    const q = dynamicQs[qStep];
    const next = Object.assign({}, qAnswers, { [q.field]: qInput.trim() });
    setQAnswers(next); setQInput("");
    if (qStep < dynamicQs.length - 1) { setQStep(function(s) { return s + 1; }); setTimeout(function() { if (inputRef.current) inputRef.current.focus(); }, 80); }
    else generateReply(next);
  };

  const skipQ = () => {
    const q = dynamicQs[qStep];
    const next = Object.assign({}, qAnswers, { [q.field]: "" });
    setQAnswers(next); setQInput("");
    if (qStep < dynamicQs.length - 1) setQStep(function(s) { return s + 1; });
    else generateReply(next);
  };

  const currentQ = dynamicQs[qStep];

  /* THREAD */
  if (screen === "thread") {
    const msgs = (currentPerson && currentPerson.messages) || [];
    const allExt = (currentPerson && currentPerson.extracted) || {};
    return (
      <div className="fade-up">
        <BackBtn onBack={onBack} />
        <div style={{ padding: "0 16px 16px" }}>
          <div className="section-label">WHAT WE KNOW</div>
          <div className="card" style={{ marginLeft: 0, marginRight: 0 }}>
            {Object.entries(FIELD_LABELS).map(function(entry) {
              const field = entry[0]; const meta = entry[1];
              const val = allExt[field];
              const has = val && val !== "null" && val !== "";
              if (editingField === field) {
                return (
                  <div key={field} className="found-row" style={{ flexDirection: "column", gap: 8 }}>
                    <div className="row"><span style={{ fontSize: 15, width: 22, flexShrink: 0 }}>{meta.icon}</span><span style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 700, textTransform: "uppercase" }}>{meta.label}</span></div>
                    <div className="row">
                      <input className="input" style={{ fontSize: 13, padding: "7px 10px" }} value={editingVal} onChange={function(e) { setEditingVal(e.target.value); }} autoFocus onKeyDown={function(e) { if (e.key === "Enter") saveFieldEdit(field); }} placeholder={"Enter " + meta.label.toLowerCase() + "..."} />
                      <button className="btn btn-green btn-sm" style={{ flexShrink: 0, marginLeft: 6 }} onClick={function() { saveFieldEdit(field); }}>✓</button>
                      <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0, marginLeft: 4 }} onClick={function() { setEditingField(null); }}>✕</button>
                    </div>
                  </div>
                );
              }
              return (
                <div key={field} className="found-row" style={{ cursor: "pointer" }} onClick={function() { setEditingField(field); setEditingVal(has ? val : ""); }}>
                  <span style={{ fontSize: 15, width: 22, flexShrink: 0 }}>{meta.icon}</span>
                  <div className="flex-1">
                    <div style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 700, textTransform: "uppercase" }}>{meta.label}</div>
                    <div style={{ fontSize: 13, color: has ? "#c8d0f0" : "var(--muted2)", marginTop: 2, fontStyle: has ? "normal" : "italic" }}>{has ? val : "Tap to add..."}</div>
                  </div>
                  <span style={{ fontSize: 12, color: has ? "var(--green)" : "var(--muted2)" }}>{has ? "✓" : "✏️"}</span>
                </div>
              );
            })}
          </div>

          {msgs.length > 0 && (
            <div>
              <div className="section-label mt-16">CONVERSATION</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {msgs.map(function(msg, i) {
                  return (
                    <div key={i}>
                      <div style={{ fontSize: 11, color: "var(--muted2)", marginBottom: 5, textAlign: msg.role === "freddie" ? "right" : "left" }}>
                        {msg.role === "client" ? ((currentPerson && currentPerson.name) || "Client") : "Freddie"} · {fmtDate(msg.date)}
                      </div>
                      {msg.role === "client" ? (
                        <div className="bubble-in">{msg.text}</div>
                      ) : (
                        <div>
                          <div className="bubble-out" style={{ whiteSpace: "pre-wrap" }}>{msg.draft || msg.text}</div>
                          {msg.questions && (
                            <div className="double-check-box" style={{ marginLeft: "auto", maxWidth: "82%" }}>
                              <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, textTransform: "uppercase", marginBottom: 5 }}>✅ Double check you have asked</div>
                              <div style={{ fontSize: 12, color: "#a8d5b5", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.questions}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card mt-16" style={{ marginLeft: 0, marginRight: 0 }}>
            <div className="section-label" style={{ paddingLeft: 0, marginTop: 0 }}>THEIR LATEST MESSAGE</div>
            <div className="text-sm text-muted mb-8">Paste their reply — I will draft a response using full context.</div>
            <textarea className="input" rows={4} value={followUpMsg} onChange={function(e) { setFollowUpMsg(e.target.value); }} placeholder="Paste their latest message here..." />
            <button className="btn btn-primary mt-8" disabled={!followUpMsg.trim()} style={{ opacity: followUpMsg.trim() ? 1 : 0.4 }} onClick={generateFollowUp}>Generate Follow-up ✨</button>
          </div>

          <div className="section-label mt-16">NEW MESSAGE TYPE</div>
          {ENQUIRY_TYPES.map(function(t) {
            return (
              <div key={t.id} className="type-card" onClick={function() { setEnquiryType(t); setRawMessage(""); setScreen("paste"); }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: t.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{t.icon}</div>
                <div className="flex-1"><div style={{ fontWeight: 600, fontSize: 14 }}>{t.label}</div><div className="text-xs text-muted">{t.desc}</div></div>
                <span className="text-muted">›</span>
              </div>
            );
          })}
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  /* TYPE */
  if (screen === "type") {
    return (
      <div className="fade-up">
        <BackBtn onBack={onBack} />
        <div style={{ padding: "0 16px 24px" }}>
          <div className="page-title mb-4">New Message</div>
          <div className="page-sub mb-16">What kind of message is this?</div>
          {ENQUIRY_TYPES.map(function(t) {
            return (
              <div key={t.id} className="type-card" onClick={function() { setEnquiryType(t); setScreen(person && person.platform ? "paste" : "platform"); }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: t.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flexShrink: 0 }}>{t.icon}</div>
                <div className="flex-1"><div style={{ fontWeight: 700, fontSize: 15 }}>{t.label}</div><div className="text-sm text-muted">{t.desc}</div></div>
                <span style={{ color: t.color, fontSize: 18 }}>›</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* PLATFORM */
  if (screen === "platform") {
    return (
      <div className="fade-up">
        <BackBtn onBack={function() { setScreen("type"); }} />
        <div style={{ padding: "0 16px 24px" }}>
          <div className="page-title mb-4">Which Platform?</div>
          <div className="page-sub mb-16">Where did they message Freddie?</div>
          {PLATFORMS.map(function(p) {
            return (
              <div key={p} className="type-card" onClick={function() { setPlatform(p); setScreen("paste"); }}>
                <div style={{ fontWeight: 700, fontSize: 16, flex: 1 }}>{p}</div>
                {(p === "Rover" || p === "Bark") && <span className="badge badge-muted">Platform sets rates</span>}
                <span className="text-muted">›</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* PASTE */
  if (screen === "paste") {
    return (
      <div className="fade-up">
        <BackBtn onBack={function() { setScreen(person && person.platform ? "type" : "platform"); }} />
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: 11, color: typeColor, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>STEP 1 OF 3 — THE MESSAGE</div>
          <div className="page-title mb-4">Paste their message</div>
          <div className="page-sub mb-16">More detail = fewer questions from me.</div>
          <textarea ref={inputRef} className="input" rows={7} value={rawMessage} onChange={function(e) { setRawMessage(e.target.value); }} placeholder={"Paste from " + platform + " here..."} autoFocus />
          <button className="btn btn-primary mt-12" disabled={!rawMessage.trim()} style={{ background: rawMessage.trim() ? typeColor : undefined, opacity: rawMessage.trim() ? 1 : 0.4 }} onClick={analyseMessage}>
            Analyse Message →
          </button>
        </div>
      </div>
    );
  }

  /* ANALYSING */
  if (screen === "analysing") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
        <Spinner large />
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, color: "var(--muted)" }}>READING THE MESSAGE...</div>
        <div className="text-sm text-muted">Working out what I know and what to ask</div>
      </div>
    );
  }

  /* SUMMARY */
  if (screen === "summary") {
    const found = Object.values(extracted).filter(function(v) { return v && v !== "null"; }).length;
    const pct = dynamicQs.length > 0 ? "0%" : "100%";
    return (
      <div className="fade-up">
        <BackBtn onBack={function() { setScreen("paste"); }} />
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: 11, color: typeColor, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>STEP 2 OF 3 — WHAT I FOUND</div>
          <div className="page-title mb-4">{"Here's what I got"}</div>
          <div className="page-sub mb-16">Review, then I will ask for anything missing.</div>
          <div className="card" style={{ marginLeft: 0, marginRight: 0, marginBottom: 14 }}>
            {found === 0 ? (
              <div className="text-sm text-muted">Could not extract much — questions will fill in the gaps.</div>
            ) : (
              Object.entries(FIELD_LABELS).map(function(entry) {
                const field = entry[0]; const meta = entry[1];
                const val = extracted[field];
                if (!val || val === "null") return null;
                return (
                  <div key={field} className="found-row">
                    <span style={{ fontSize: 17, width: 26, flexShrink: 0 }}>{meta.icon}</span>
                    <div className="flex-1">
                      <div style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 700, textTransform: "uppercase" }}>{meta.label}</div>
                      <div style={{ fontSize: 14, color: "#c8d0f0", marginTop: 2 }}>{val}</div>
                    </div>
                    <span className="text-green" style={{ fontSize: 15 }}>✓</span>
                  </div>
                );
              })
            )}
            {dynamicQs.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>{"Still need (" + dynamicQs.length + ")"}</div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {dynamicQs.map(function(q) {
                    return <span key={q.field} className="missing-chip">{(FIELD_LABELS[q.field] && FIELD_LABELS[q.field].icon) || "?"} {(FIELD_LABELS[q.field] && FIELD_LABELS[q.field].label) || q.field}</span>;
                  })}
                </div>
              </div>
            )}
            {dynamicQs.length === 0 && (
              <div style={{ marginTop: 12, background: "rgba(0,184,148,0.08)", border: "1px solid rgba(0,184,148,0.2)", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                Got everything — ready to generate!
              </div>
            )}
          </div>
          <button className="btn btn-primary" style={{ background: typeColor }} onClick={function() { if (dynamicQs.length > 0) setScreen("questions"); else generateReply({}); }}>
            {dynamicQs.length > 0 ? ("Answer " + dynamicQs.length + " question" + (dynamicQs.length !== 1 ? "s" : "") + " →") : "Generate Reply ✨"}
          </button>
        </div>
      </div>
    );
  }

  /* QUESTIONS */
  if (screen === "questions" && currentQ) {
    const pctW = dynamicQs.length > 0 ? (Math.round(qStep * 100 / dynamicQs.length) + "%") : "0%";
    return (
      <div className="fade-up">
        <BackBtn onBack={function() { if (qStep === 0) setScreen("summary"); else setQStep(function(s) { return s - 1; }); }} />
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: 11, color: typeColor, fontWeight: 700, letterSpacing: 0.5, marginBottom: 12 }}>{"QUESTION " + (qStep + 1) + " OF " + dynamicQs.length}</div>
          <div className="progress-track"><div className="progress-fill" style={{ width: pctW, background: typeColor }} /></div>
          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>{currentQ.question}</div>
          <div className="text-sm text-muted mb-16">{currentQ.hint}</div>
          <input ref={inputRef} className="input" type="text" value={qInput} onChange={function(e) { setQInput(e.target.value); }} placeholder="Your answer..." onKeyDown={function(e) { if (e.key === "Enter") nextQ(); }} autoFocus />
          {qStep > 0 && (
            <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--bg)", borderRadius: 8 }}>
              {dynamicQs.slice(0, qStep).map(function(q) {
                return <div key={q.field} className="text-xs text-muted">{(FIELD_LABELS[q.field] && FIELD_LABELS[q.field].label) || q.field}: <span style={{ color: "var(--text)" }}>{qAnswers[q.field]}</span></div>;
              })}
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

  /* LOADING */
  if (screen === "loading") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
        <Spinner large />
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, color: "var(--muted)" }}>CRAFTING YOUR REPLY...</div>
        <div className="text-sm text-muted">Putting it all together</div>
      </div>
    );
  }

  /* ERROR */
  if (screen === "error") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 44 }}>⚠️</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "var(--orange)" }}>SOMETHING WENT WRONG</div>
        <div className="text-sm text-muted">Could not generate — usually temporary. Try again.</div>
        <button className="btn btn-primary" onClick={function() { generateReply(qAnswers); }}>Try Again</button>
        <button className="btn btn-ghost mt-4" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  /* RESULT */
  if (screen === "result" && sections.length > 0) {
    const extra = sections.find(function(s) { return s.key === "extra"; });
    const showBook = intent && intent.booking_detected && !bookingForm;
    const showMeet = intent && intent.meet_detected && !(intent.booking_detected) && !bookingForm;

    return (
      <div className="fade-up">
        <BackBtn onBack={function() { setScreen("thread"); }} label="View Thread" />
        <div style={{ padding: "0 16px 24px" }}>

          {intent && intent.suggested_stage && currentPerson && intent.suggested_stage !== currentPerson.stage && (
            <div style={{ background: "rgba(0,184,148,0.08)", border: "1px solid rgba(0,184,148,0.25)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 700, marginBottom: 2 }}>📊 Stage updated</div>
              <div className="text-sm text-muted">Moved to <strong style={{ color: "var(--text)" }}>{(STAGE_MAP[intent.suggested_stage] && STAGE_MAP[intent.suggested_stage].label) || intent.suggested_stage}</strong></div>
            </div>
          )}

          {showBook && (
            <div style={{ background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.3)", borderRadius: "var(--radius-sm)", padding: "13px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>🎉 Looks like a booking!</div>
              <div className="text-sm text-muted mb-8">{(intent && intent.booking_summary) || "They confirmed — add to schedule?"}</div>
              <button className="btn btn-green btn-sm" onClick={function() { openBookingForm(false); }}>Add to Schedule →</button>
            </div>
          )}

          {showMeet && (
            <div style={{ background: "rgba(9,132,227,0.1)", border: "1px solid rgba(9,132,227,0.3)", borderRadius: "var(--radius-sm)", padding: "13px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>🤝 Meet and greet requested</div>
              <div className="text-sm text-muted mb-8">Add the meet and greet to your schedule?</div>
              <button className="btn btn-primary btn-sm" onClick={function() { openBookingForm(true); }}>Add Meet and Greet →</button>
            </div>
          )}

          {bookingForm && (
            <div style={{ background: "var(--card2)", border: "1px solid var(--border2)", borderRadius: "var(--radius-sm)", padding: "13px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                {bookingForm.isMeet ? "📅 Meet and Greet" : bookingForm.bulk ? ("📅 " + bookingForm.bulkDates.filter(function(d) { return d.selected; }).length + " visits found") : "📅 Booking"}
              </div>
              {bookingForm.datesHint && (
                <div style={{ background: "rgba(108,92,231,0.1)", borderRadius: 6, padding: "6px 10px", marginBottom: 10 }}>
                  <div className="text-xs text-muted">From their message: <strong style={{ color: "var(--text)" }}>{bookingForm.datesHint}</strong></div>
                </div>
              )}
              {bookingForm.conflict && (
                <div style={{ background: "rgba(225,112,85,0.12)", border: "1px solid rgba(225,112,85,0.3)", borderRadius: 6, padding: "10px 12px", marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--orange)", marginBottom: 4 }}>⚠️ Diary clash!</div>
                  <div className="text-xs text-muted mb-8">Already something at this time.</div>
                  <div className="btn-row" style={{ padding: 0 }}>
                    <button className="btn btn-ghost btn-sm" onClick={function() { setBookingForm(function(b) { return Object.assign({}, b, { conflict: false }); }); }}>Change time</button>
                    <button className="btn btn-orange btn-sm" onClick={function() { setBookingForm(function(b) { return Object.assign({}, b, { conflict: false, conflictOk: true }); }); saveBooking(); }}>Add anyway</button>
                  </div>
                </div>
              )}
              {bookingForm.bulk ? (
                <div>
                  <div className="text-xs text-muted mb-8">Tap to deselect any you do not want:</div>
                  {bookingForm.bulkDates.map(function(d, i) {
                    const label = d.date ? new Date(d.date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "Date TBC";
                    return (
                      <div key={i} className="card card-tap card-sm" style={{ margin: "0 0 6px", opacity: d.selected ? 1 : 0.4 }} onClick={function() { setBookingForm(function(b) { return Object.assign({}, b, { bulkDates: b.bulkDates.map(function(x, j) { return j === i ? Object.assign({}, x, { selected: !x.selected }) : x; }) }); }); }}>
                        <div className="row-between"><div><div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>{d.time && <div className="text-xs text-muted">{d.time}</div>}</div><span style={{ fontSize: 16 }}>{d.selected ? "✅" : "⬜"}</span></div>
                      </div>
                    );
                  })}
                  <div className="input-group mt-8">
                    <div className="input-label">Service</div>
                    <div className="chip-row">{SERVICES.map(function(s) { return <Chip key={s.id} label={s.icon + " " + s.label} active={bookingForm.serviceType === s.id} onClick={function() { setBookingForm(function(b) { return Object.assign({}, b, { serviceType: s.id }); }); }} />; })}</div>
                  </div>
                  <div className="input-group">
                    <div className="input-label">Duration</div>
                    <div className="chip-row">{["30 min","45 min","60 min"].map(function(d) { return <Chip key={d} label={d} active={bookingForm.duration === d} onClick={function() { setBookingForm(function(b) { return Object.assign({}, b, { duration: d }); }); }} />; })}</div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="input-group"><div className="input-label">Date</div><input className="input" type="date" value={bookingForm.date} onChange={function(e) { setBookingForm(function(b) { return Object.assign({}, b, { date: e.target.value, conflict: false }); }); }} /></div>
                  <div className="input-group"><div className="input-label">Time</div><input className="input" type="time" value={bookingForm.time} onChange={function(e) { setBookingForm(function(b) { return Object.assign({}, b, { time: e.target.value, conflict: false }); }); }} /></div>
                  {!bookingForm.isMeet && (
                    <div>
                      <div className="input-group"><div className="input-label">Service</div><div className="chip-row">{SERVICES.map(function(s) { return <Chip key={s.id} label={s.icon + " " + s.label} active={bookingForm.serviceType === s.id} onClick={function() { setBookingForm(function(b) { return Object.assign({}, b, { serviceType: s.id }); }); }} />; })}</div></div>
                      <div className="input-group"><div className="input-label">Duration</div><div className="chip-row">{["30 min","45 min","60 min"].map(function(d) { return <Chip key={d} label={d} active={bookingForm.duration === d} onClick={function() { setBookingForm(function(b) { return Object.assign({}, b, { duration: d }); }); }} />; })}</div></div>
                    </div>
                  )}
                </div>
              )}
              <div className="btn-row mt-8" style={{ padding: 0 }}>
                <button className="btn btn-ghost" onClick={function() { setBookingForm(null); }}>Cancel</button>
                <button className="btn btn-green" disabled={bookingForm.bulk ? !bookingForm.bulkDates.some(function(d) { return d.selected && d.date; }) : !bookingForm.date} onClick={saveBooking}>
                  {bookingForm.bulk ? ("Add " + bookingForm.bulkDates.filter(function(d) { return d.selected; }).length + " visits ✓") : "Save to Schedule ✓"}
                </button>
              </div>
            </div>
          )}

          <div className="row mb-8">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: typeColor + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{enquiryType && enquiryType.icon}</div>
            <div><div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 1, color: typeColor }}>{enquiryType && enquiryType.label}</div><div className="text-xs text-muted">{platform + " · " + new Date().toLocaleDateString("en-GB")}</div></div>
          </div>

          <div className="section-label" style={{ paddingLeft: 0, marginTop: 0 }}>DRAFT REPLY</div>
          <div className="text-xs text-muted mb-8">Tap to edit before copying</div>
          <textarea className="draft-box" value={draftText} onChange={function(e) { setDraftText(e.target.value); }} rows={9} />
          <CopyBtn text={draftText} />

          <div style={{ marginTop: 12, background: "var(--card2)", border: "1px solid var(--border2)", borderRadius: "var(--radius-sm)", padding: "11px" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700, marginBottom: 8 }}>✏️ WANT TO CHANGE SOMETHING?</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="input" style={{ fontSize: 13, padding: "8px 11px" }} placeholder='e.g. "make it shorter" or "add key handover info"' value={tweakInput} onChange={function(e) { setTweakInput(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") tweakDraft(); }} />
              <button className="btn btn-primary btn-sm" disabled={!tweakInput.trim() || tweaking} style={{ flexShrink: 0 }} onClick={tweakDraft}>
                {tweaking ? <Spinner /> : "Go"}
              </button>
            </div>
          </div>

          {extra && (
            <div className="double-check-box mt-12">
              <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>✅ Double check you have asked</div>
              <div style={{ fontSize: 13, color: "#a8d5b5", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{extra.content}</div>
            </div>
          )}

          <div className="btn-row mt-14" style={{ padding: 0 }}>
            <button className="btn btn-ghost" onClick={function() { setScreen("thread"); }}>View Thread</button>
            <button className="btn btn-ghost" onClick={onBack}>Done</button>
          </div>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  return null;
}

/* DOG WIZARD */
function DogWizard({ personId, existingDog, onSave, onBack }) {
  const init = existingDog || { id: uid(), personId, name: "", breed: "", age: "", size: "", goodWithDogs: "", goodOnLead: "", healthIssues: "No", healthNotes: "", spooks: "", vet: "", vetPhone: "", personality: "", meetGreetResult: "" };
  const [dog, setDog] = useState(init);
  const [step, setStep] = useState(0);
  const set = function(k, v) { setDog(function(d) { return Object.assign({}, d, { [k]: v }); }); };
  const steps = [
    { title: "Dog's Name", body: <input className="input" placeholder="e.g. Buddy" value={dog.name} onChange={function(e) { set("name", e.target.value); }} style={{ fontSize: 20, fontWeight: 700 }} />, valid: !!dog.name.trim() },
    { title: "Breed and Age", body: <div><div className="input-group"><div className="input-label">Breed</div><input className="input" placeholder="e.g. Labrador" value={dog.breed} onChange={function(e) { set("breed", e.target.value); }} /></div><div className="input-group"><div className="input-label">Age</div><input className="input" placeholder="e.g. 3 years" value={dog.age} onChange={function(e) { set("age", e.target.value); }} /></div></div>, valid: true },
    { title: "Size", body: <div className="chip-row"><Chip label="Small" active={dog.size === "S"} onClick={function() { set("size", "S"); }} /><Chip label="Medium" active={dog.size === "M"} onClick={function() { set("size", "M"); }} /><Chip label="Large" active={dog.size === "L"} onClick={function() { set("size", "L"); }} /></div>, valid: !!dog.size },
    { title: "Good with other dogs?", body: <div className="chip-row"><Chip label="Yes" active={dog.goodWithDogs === "Yes"} color="g" onClick={function() { set("goodWithDogs", "Yes"); }} /><Chip label="No" active={dog.goodWithDogs === "No"} color="o" onClick={function() { set("goodWithDogs", "No"); }} /><Chip label="Unpredictable" active={dog.goodWithDogs === "Unpredictable"} color="y" onClick={function() { set("goodWithDogs", "Unpredictable"); }} /></div>, valid: !!dog.goodWithDogs },
    { title: "Good on lead?", body: <div className="chip-row"><Chip label="Yes" active={dog.goodOnLead === "Yes"} color="g" onClick={function() { set("goodOnLead", "Yes"); }} /><Chip label="Fine" active={dog.goodOnLead === "Fine"} onClick={function() { set("goodOnLead", "Fine"); }} /><Chip label="Pulls" active={dog.goodOnLead === "Pulls"} color="o" onClick={function() { set("goodOnLead", "Pulls"); }} /></div>, valid: !!dog.goodOnLead },
    { title: "Any health issues?", body: <div><div className="chip-row mb-8"><Chip label="No" active={dog.healthIssues === "No"} color="g" onClick={function() { set("healthIssues", "No"); }} /><Chip label="Yes" active={dog.healthIssues === "Yes"} color="o" onClick={function() { set("healthIssues", "Yes"); }} /></div>{dog.healthIssues === "Yes" && <textarea className="input" rows={3} placeholder="Describe..." value={dog.healthNotes} onChange={function(e) { set("healthNotes", e.target.value); }} />}</div>, valid: !!dog.healthIssues },
    { title: "Anything that spooks them?", body: <textarea className="input" rows={3} placeholder="e.g. loud noises, bikes... (optional)" value={dog.spooks} onChange={function(e) { set("spooks", e.target.value); }} />, valid: true },
    { title: "Vet details", body: <div><div className="input-group"><div className="input-label">Vet name</div><input className="input" placeholder="e.g. Winchester Vets" value={dog.vet} onChange={function(e) { set("vet", e.target.value); }} /></div><div className="input-group"><div className="input-label">Vet phone</div><input className="input" type="tel" placeholder="01962..." value={dog.vetPhone} onChange={function(e) { set("vetPhone", e.target.value); }} /></div></div>, valid: true },
    { title: "Personality notes", body: <textarea className="input" rows={4} placeholder="What are they like? (optional)" value={dog.personality} onChange={function(e) { set("personality", e.target.value); }} />, valid: true },
    { title: "How did the meet and greet go?", body: <div className="chip-row"><Chip label="Great" active={dog.meetGreetResult === "Great"} color="g" onClick={function() { set("meetGreetResult", "Great"); }} /><Chip label="Fine" active={dog.meetGreetResult === "Fine"} onClick={function() { set("meetGreetResult", "Fine"); }} /><Chip label="Concerns" active={dog.meetGreetResult === "Concerns"} color="o" onClick={function() { set("meetGreetResult", "Concerns"); }} /></div>, valid: true },
  ];
  const s = steps[step]; const isLast = step === steps.length - 1;
  const pctW = step > 0 ? (Math.round(step * 100 / steps.length) + "%") : "0%";
  return (
    <div>
      <BackBtn onBack={step === 0 ? onBack : function() { setStep(function(p) { return p - 1; }); }} />
      <div style={{ padding: "0 16px 24px" }}>
        <div style={{ fontSize: 11, color: "var(--purple)", fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>{(step + 1) + " OF " + steps.length}</div>
        <div className="progress-track"><div className="progress-fill" style={{ width: pctW }} /></div>
        <div className="page-title mb-16">{s.title}</div>
        {s.body}
        <button className="btn btn-primary mt-16" disabled={!s.valid} onClick={function() { if (isLast) { db.upsert("dogs", dog); onSave(dog); } else setStep(function(p) { return p + 1; }); }}>
          {isLast ? "Save Dog ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
}

/* CAT WIZARD */
function CatWizard({ personId, existingCat, onSave, onBack }) {
  const init = existingCat || { id: uid(), personId, name: "", age: "", indoorOutdoor: "", feedingRoutine: "", litterNotes: "", medication: "No", medicationNotes: "", personality: "" };
  const [cat, setCat] = useState(init);
  const [step, setStep] = useState(0);
  const set = function(k, v) { setCat(function(c) { return Object.assign({}, c, { [k]: v }); }); };
  const steps = [
    { title: "Cat's Name", body: <input className="input" placeholder="e.g. Mochi" value={cat.name} onChange={function(e) { set("name", e.target.value); }} style={{ fontSize: 20, fontWeight: 700 }} />, valid: !!cat.name.trim() },
    { title: "Age", body: <input className="input" placeholder="e.g. 4 years" value={cat.age} onChange={function(e) { set("age", e.target.value); }} />, valid: true },
    { title: "Indoor or Outdoor?", body: <div className="chip-row"><Chip label="Indoor" active={cat.indoorOutdoor === "Indoor"} onClick={function() { set("indoorOutdoor", "Indoor"); }} /><Chip label="Outdoor" active={cat.indoorOutdoor === "Outdoor"} onClick={function() { set("indoorOutdoor", "Outdoor"); }} /><Chip label="Both" active={cat.indoorOutdoor === "Both"} onClick={function() { set("indoorOutdoor", "Both"); }} /></div>, valid: !!cat.indoorOutdoor },
    { title: "Feeding routine", body: <textarea className="input" rows={3} placeholder="e.g. Wet food twice a day..." value={cat.feedingRoutine} onChange={function(e) { set("feedingRoutine", e.target.value); }} />, valid: true },
    { title: "Litter notes", body: <textarea className="input" rows={3} placeholder="e.g. Litter tray in bathroom..." value={cat.litterNotes} onChange={function(e) { set("litterNotes", e.target.value); }} />, valid: true },
    { title: "Any medication?", body: <div><div className="chip-row mb-8"><Chip label="No" active={cat.medication === "No"} color="g" onClick={function() { set("medication", "No"); }} /><Chip label="Yes" active={cat.medication === "Yes"} color="o" onClick={function() { set("medication", "Yes"); }} /></div>{cat.medication === "Yes" && <textarea className="input" rows={3} placeholder="What and how often?" value={cat.medicationNotes} onChange={function(e) { set("medicationNotes", e.target.value); }} />}</div>, valid: true },
    { title: "Personality notes", body: <textarea className="input" rows={4} placeholder="What are they like? (optional)" value={cat.personality} onChange={function(e) { set("personality", e.target.value); }} />, valid: true },
  ];
  const s = steps[step]; const isLast = step === steps.length - 1;
  const pctW = step > 0 ? (Math.round(step * 100 / steps.length) + "%") : "0%";
  return (
    <div>
      <BackBtn onBack={step === 0 ? onBack : function() { setStep(function(p) { return p - 1; }); }} />
      <div style={{ padding: "0 16px 24px" }}>
        <div style={{ fontSize: 11, color: "var(--purple)", fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>{(step + 1) + " OF " + steps.length}</div>
        <div className="progress-track"><div className="progress-fill" style={{ width: pctW }} /></div>
        <div className="page-title mb-16">{s.title}</div>
        {s.body}
        <button className="btn btn-primary mt-16" disabled={!s.valid} onClick={function() { if (isLast) { db.upsert("cats", cat); onSave(cat); } else setStep(function(p) { return p + 1; }); }}>
          {isLast ? "Save Cat ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
}

/* PERSON DETAIL */
function PersonDetail({ personId, onBack, onUpdate }) {
  const [view, setView] = useState("profile");
  const [selectedDog, setSelectedDog] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showMoveStage, setShowMoveStage] = useState(false);
  const [tick, setTick] = useState(0);

  const person = db.getAll("people").find(function(p) { return p.id === personId; });
  const dogs = db.getAll("dogs").filter(function(d) { return d.personId === personId; });
  const cats = db.getAll("cats").filter(function(c) { return c.personId === personId; });
  const visits = db.getAll("visits").filter(function(v) { return v.personId === personId; }).sort(function(a, b) { return b.date.localeCompare(a.date); });

  if (!person) return <div><BackBtn onBack={onBack} /><div style={{ padding: 24 }} className="text-muted">Not found</div></div>;

  const refresh = function() { setTick(function(t) { return t + 1; }); if (onUpdate) onUpdate(); };

  const moveStage = function(stageId) {
    const all = db.getAll("people");
    const idx = all.findIndex(function(p) { return p.id === personId; });
    if (idx >= 0) { all[idx].stage = stageId; all[idx].lastActionDate = nowStr(); db.set("people", all); }
    setShowMoveStage(false); refresh();
  };

  const togglePaid = function(visitId) {
    const all = db.getAll("visits");
    const idx = all.findIndex(function(v) { return v.id === visitId; });
    if (idx >= 0) { all[idx].paid = !all[idx].paid; db.set("visits", all); refresh(); }
  };

  const deletePerson = function() {
    if (!window.confirm("Delete " + (person.name || "this person") + "? This cannot be undone.")) return;
    db.remove("people", personId);
    db.set("dogs", db.getAll("dogs").filter(function(d) { return d.personId !== personId; }));
    db.set("cats", db.getAll("cats").filter(function(c) { return c.personId !== personId; }));
    db.set("visits", db.getAll("visits").filter(function(v) { return v.personId !== personId; }));
    onBack();
  };

  if (view === "message") return <MessagingFlow person={person} onBack={function() { setView("profile"); refresh(); }} onPersonUpdated={refresh} />;
  if (view === "add_dog" || selectedDog) return <DogWizard personId={personId} existingDog={selectedDog} onSave={function() { setSelectedDog(null); setView("profile"); refresh(); }} onBack={function() { setSelectedDog(null); setView("profile"); }} />;
  if (view === "add_cat" || selectedCat) return <CatWizard personId={personId} existingCat={selectedCat} onSave={function() { setSelectedCat(null); setView("profile"); refresh(); }} onBack={function() { setSelectedCat(null); setView("profile"); }} />;

  return (
    <div key={tick}>
      {showMoveStage && (
        <div className="modal-overlay" onClick={function() { setShowMoveStage(false); }}>
          <div className="modal-sheet">
            <div className="modal-handle" />
            <div className="modal-title">Move Stage</div>
            {STAGES.map(function(s) {
              return (
                <div key={s.id} className="card card-tap" onClick={function() { moveStage(s.id); }}>
                  <div className="row-between"><span style={{ fontWeight: 600 }}>{s.label}</span>{person.stage === s.id && <span className="text-green">✓</span>}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <BackBtn onBack={onBack} />
      <div style={{ padding: "0 16px 8px" }}>
        <div className="row-between mb-8">
          <div><div className="page-title">{person.name || "Unknown"}</div><div className="page-sub">{person.address || (person.extracted && person.extracted.location) || ""}</div></div>
          <StagePill stageId={person.stage} />
        </div>
      </div>

      <div className="btn-row">
        <button className="btn btn-primary btn-sm" onClick={function() { setView("message"); }}>💬 Message</button>
        <button className="btn btn-ghost btn-sm" onClick={function() { setShowMoveStage(true); }}>Stage</button>
        {person.stage !== "active" && <button className="btn btn-green btn-sm" onClick={function() { moveStage("active"); }}>Active ✓</button>}
      </div>
      <div className="btn-row" style={{ marginTop: 0 }}>
        <button className="btn btn-ghost btn-sm" style={{ color: "var(--yellow)", borderColor: "rgba(253,203,110,0.3)" }} onClick={function() { moveStage("not_proceeding"); }}>Archive</button>
        <button className="btn btn-ghost btn-sm" style={{ color: "var(--red)", borderColor: "rgba(214,48,49,0.3)" }} onClick={deletePerson}>Delete</button>
      </div>

      <div className="section-label">Contact</div>
      <div className="card">
        {[["📞", person.phone], ["🏠", person.address || (person.extracted && person.extracted.location)], ["📮", person.postcode], ["📱", person.platform], ["💷", person.rate ? "£" + person.rate + " per walk" : null]].filter(function(row) { return row[1]; }).map(function(row, i) {
          return <div key={i} className="row mt-4"><span style={{ fontSize: 14, minWidth: 20 }}>{row[0]}</span><span className="text-sm">{row[1]}</span></div>;
        })}
        {person.notes && <div className="text-sm text-muted mt-8">{person.notes}</div>}
      </div>

      {person.extracted && Object.values(person.extracted).some(function(v) { return v && v !== "null"; }) && (
        <div>
          <div className="section-label">From Messages</div>
          <div className="card">
            {Object.entries(FIELD_LABELS).map(function(entry) {
              const field = entry[0]; const meta = entry[1];
              const val = person.extracted[field];
              if (!val || val === "null") return null;
              return <div key={field} className="row mt-4"><span style={{ fontSize: 14, minWidth: 20 }}>{meta.icon}</span><div><div className="text-xs text-muted">{meta.label}</div><div className="text-sm">{val}</div></div></div>;
            })}
          </div>
        </div>
      )}

      {dogs.length > 0 && (
        <div>
          <div className="section-label">Dogs</div>
          {dogs.map(function(dog) {
            return (
              <div key={dog.id} className="card card-tap" onClick={function() { setSelectedDog(dog); }}>
                <div className="row-between">
                  <div>
                    <div style={{ fontWeight: 600 }}>🐕 {dog.name}</div>
                    <div className="text-sm text-muted">{dog.breed} · {dog.age}</div>
                    <div className="row mt-4" style={{ gap: 6 }}>
                      {dog.size && <span className="badge badge-muted">{dog.size === "S" ? "Small" : dog.size === "M" ? "Medium" : "Large"}</span>}
                      {dog.goodWithDogs && <span className={"badge " + (dog.goodWithDogs === "Yes" ? "badge-green" : dog.goodWithDogs === "No" ? "badge-orange" : "badge-yellow")}>{dog.goodWithDogs} with dogs</span>}
                    </div>
                  </div>
                  <span className="text-muted">›</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cats.length > 0 && (
        <div>
          <div className="section-label">Cats</div>
          {cats.map(function(cat) {
            return (
              <div key={cat.id} className="card card-tap" onClick={function() { setSelectedCat(cat); }}>
                <div className="row-between"><div><div style={{ fontWeight: 600 }}>🐱 {cat.name}</div><div className="text-sm text-muted">{cat.age} · {cat.indoorOutdoor}</div></div><span className="text-muted">›</span></div>
              </div>
            );
          })}
        </div>
      )}

      <div className="btn-row mt-4">
        <button className="btn btn-ghost btn-sm" onClick={function() { setView("add_dog"); }}>+ Add Dog</button>
        <button className="btn btn-ghost btn-sm" onClick={function() { setView("add_cat"); }}>+ Add Cat</button>
      </div>

      {visits.length > 0 && (
        <div>
          <div className="section-label">Visits</div>
          {visits.map(function(v) {
            const svc = SERVICE_MAP[v.serviceType];
            return (
              <div key={v.id} className="card card-sm">
                <div className="row-between">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{v.isMeetGreet ? "🤝 Meet and Greet" : ((svc && svc.icon) || "") + " " + ((svc && svc.label) || v.serviceType)}</div>
                    <div className="text-xs text-muted">{fmtDate(v.date)}{v.time ? " · " + v.time : ""}{v.duration ? " · " + v.duration : ""}</div>
                  </div>
                  <div className="row">
                    {v.amount && <span className="text-sm text-muted">{"£" + v.amount}</span>}
                    <div className={"check-box" + (v.paid ? " done" : "")} style={{ width: 22, height: 22, borderRadius: 6 }} onClick={function() { togglePaid(v.id); }}>
                      {v.paid && <span style={{ color: "#001a12", fontSize: 11, fontWeight: 800 }}>✓</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ height: 32 }} />
    </div>
  );
}

/* TAB: TODAY */
function TabToday({ onOpenPerson }) {
  const [completedActions, setCompletedActions] = useState(function() { return db.get("completedActions") || {}; });
  const [completedVisits, setCompletedVisits] = useState(function() { return db.get("completedVisits") || {}; });

  const people = db.getAll("people");
  const visits = db.getAll("visits");
  const todayVisits = visits.filter(function(v) { return v.date === todayStr() && v.status !== "cancelled" && v.status !== "completed"; }).sort(function(a, b) { return (a.time || "").localeCompare(b.time || ""); });
  const actions = computeActions(people);
  const waiting = people.filter(function(p) { return p.stage === "replied"; });

  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
  const weekVisits = visits.filter(function(v) { const d = new Date(v.date); return d >= weekStart && d <= weekEnd; });
  const earned = weekVisits.filter(function(v) { return v.paid && v.amount; }).reduce(function(s, v) { return s + parseFloat(v.amount || 0); }, 0);
  const outstanding = weekVisits.filter(function(v) { return !v.paid && v.amount; }).reduce(function(s, v) { return s + parseFloat(v.amount || 0); }, 0);

  const toggleAction = function(id) { const next = Object.assign({}, completedActions, { [id]: !completedActions[id] }); setCompletedActions(next); db.set("completedActions", next); };
  const toggleVisit = function(id) {
    const next = Object.assign({}, completedVisits, { [id]: !completedVisits[id] }); setCompletedVisits(next); db.set("completedVisits", next);
    const all = db.getAll("visits"); const idx = all.findIndex(function(v) { return v.id === id; });
    if (idx >= 0) { all[idx].status = next[id] ? "completed" : "confirmed"; db.set("visits", all); }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <div style={{ padding: "20px 16px 12px" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 2, color: "var(--muted)", marginBottom: 4 }}>WALKS AND WHISKERS</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, lineHeight: 1 }}>{greeting + ", Freddie 👋"}</div>
        <div className="text-sm text-muted mt-4">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
      </div>

      <div className="section-label">WALKS TODAY</div>
      {todayVisits.length === 0 ? (
        <div style={{ padding: "8px 16px 4px" }}><div className="text-sm text-muted">No walks booked today 🌿</div></div>
      ) : todayVisits.map(function(v) {
        const p = people.find(function(x) { return x.id === v.personId; });
        const dogs = db.getAll("dogs").filter(function(d) { return d.personId === v.personId; });
        const done = completedVisits[v.id];
        return (
          <div key={v.id} className="card" style={{ opacity: done ? 0.5 : 1 }}>
            <div className="check-row">
              <CheckBox done={done} onToggle={function() { toggleVisit(v.id); }} />
              <div style={{ flex: 1, cursor: "pointer" }} onClick={function() { if (p) onOpenPerson(p.id); }}>
                <div className="row-between">
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{(v.time || "—") + " · " + (v.isMeetGreet ? "Meet and Greet" : (dogs.map(function(d) { return d.name; }).join(", ") || "Dog"))}</div>
                  <span className={"badge " + (v.isMeetGreet ? "badge-yellow" : "badge-purple")}>{v.isMeetGreet ? "🤝 Meet" : (v.duration || ((SERVICE_MAP[v.serviceType] && SERVICE_MAP[v.serviceType].label) || ""))}</span>
                </div>
                <div className="text-sm text-muted mt-4">{(p && p.name) + " · " + ((p && (p.address || (p.extracted && p.extracted.location))) || "").split(",")[0]}</div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="section-label">TO DO</div>
      {actions.length === 0 ? (
        <div style={{ padding: "8px 16px 4px" }}><div className="text-sm text-muted">All caught up 🎉</div></div>
      ) : actions.map(function(action) {
        const actionId = action.personId + "-" + action.type;
        const done = completedActions[actionId];
        const p = people.find(function(x) { return x.id === action.personId; });
        return (
          <div key={actionId} className="card" style={{ opacity: done ? 0.4 : 1 }}>
            <div className="check-row">
              <CheckBox done={done} onToggle={function() { toggleAction(actionId); }} />
              <div style={{ flex: 1 }}>
                <div className="row-between">
                  <div className="row flex-1" style={{ cursor: "pointer" }} onClick={function() { if (!done && p) onOpenPerson(p.id); }}>
                    <span className="dot" style={{ background: action.urgency === "high" ? "var(--orange)" : "var(--yellow)" }} />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{action.label}</span>
                  </div>
                  {!done && p && (
                    <button className="btn btn-primary btn-xs" style={{ marginLeft: 8, flexShrink: 0 }} onClick={function() { onOpenPerson(p.id); }}>💬</button>
                  )}
                </div>
                <div className="mt-4"><StagePill stageId={action.stage} /></div>
              </div>
            </div>
          </div>
        );
      })}

      {waiting.length > 0 && (
        <div>
          <div className="section-label">WAITING ON</div>
          {waiting.map(function(p) {
            return (
              <div key={p.id} className="card card-tap card-sm" onClick={function() { onOpenPerson(p.id); }}>
                <div className="row-between"><div><div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div><div className="text-xs text-muted">Replied — awaiting their response</div></div><span className="text-muted">›</span></div>
              </div>
            );
          })}
        </div>
      )}

      <div className="section-label">THIS WEEK</div>
      <div className="earnings-card">
        <div className="row-between">
          <div><div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: "var(--green)" }}>{"£" + earned.toFixed(0)}</div><div className="text-xs text-muted">earned</div></div>
          {outstanding > 0 && <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "var(--yellow)" }}>{"£" + outstanding.toFixed(0)}</div><div className="text-xs text-muted">outstanding</div></div>}
          {earned === 0 && outstanding === 0 && <div className="text-sm text-muted">No paid visits logged yet</div>}
        </div>
      </div>
      <div style={{ height: 16 }} />
    </div>
  );
}

/* TAB: PEOPLE */
function TabPeople({ onOpenPerson, onNewEnquiry }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const STAGE_ORDER = { new_enquiry: 0, replied: 1, interested: 2, meet_arranged: 3, met: 4, active: 5, gone_quiet: 6, not_proceeding: 7 };
  const people = db.getAll("people");
  const counts = { all: people.length, active: people.filter(function(p) { return p.stage === "active"; }).length, enquiries: people.filter(function(p) { return p.stage !== "active" && p.stage !== "not_proceeding"; }).length, not_proceeding: people.filter(function(p) { return p.stage === "not_proceeding"; }).length };
  const filtered = people.filter(function(p) {
    if (filter === "active") return p.stage === "active";
    if (filter === "enquiries") return p.stage !== "active" && p.stage !== "not_proceeding";
    if (filter === "not_proceeding") return p.stage === "not_proceeding";
    return true;
  }).filter(function(p) {
    if (!search) return true;
    const s = search.toLowerCase();
    return (p.name || "").toLowerCase().indexOf(s) !== -1 || (p.address || "").toLowerCase().indexOf(s) !== -1;
  }).sort(function(a, b) {
    const ao = STAGE_ORDER[a.stage] !== undefined ? STAGE_ORDER[a.stage] : 9;
    const bo = STAGE_ORDER[b.stage] !== undefined ? STAGE_ORDER[b.stage] : 9;
    if (ao !== bo) return ao - bo;
    return new Date(b.lastActionDate || b.createdAt || 0).getTime() - new Date(a.lastActionDate || a.createdAt || 0).getTime();
  });

  return (
    <div>
      <div style={{ padding: "14px 16px 8px" }}>
        <div className="row-between">
          <div className="page-title">People</div>
          <button className="btn btn-primary btn-sm" onClick={onNewEnquiry}>+ New</button>
        </div>
      </div>
      <div style={{ padding: "6px 16px 10px" }}>
        <input className="input" placeholder="Search..." value={search} onChange={function(e) { setSearch(e.target.value); }} />
      </div>
      <div className="pill-tabs mb-12">
        {[["all","All (" + counts.all + ")"],["active","Active (" + counts.active + ")"],["enquiries","Enquiries (" + counts.enquiries + ")"],["not_proceeding","Not proceeding"]].map(function(f) {
          return <button key={f[0]} className={"pill-tab" + (filter === f[0] ? " active" : "")} onClick={function() { setFilter(f[0]); }}>{f[1]}</button>;
        })}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">🐾</div><h3>Nobody here yet</h3><p>Tap + New to add someone</p></div>
      ) : filtered.map(function(p) {
        const dogs = db.getAll("dogs").filter(function(d) { return d.personId === p.id; });
        const cats = db.getAll("cats").filter(function(c) { return c.personId === p.id; });
        const msgCount = (p.messages || []).length;
        return (
          <div key={p.id} className="card card-tap" onClick={function() { onOpenPerson(p.id); }}>
            <div className="row-between">
              <div className="flex-1">
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name || "Unknown"}</div>
                <div className="row mt-4" style={{ gap: 6, flexWrap: "wrap" }}>
                  <StagePill stageId={p.stage} />
                  {p.platform && <span className="badge badge-muted">{p.platform}</span>}
                </div>
                <div className="text-sm text-muted mt-4">
                  {dogs.map(function(d) { return "🐕 " + d.name; }).join(" · ")}{cats.map(function(c) { return " 🐱 " + c.name; }).join(" · ")}
                  {dogs.length === 0 && cats.length === 0 && ((p.extracted && p.extracted.dog_name) || (p.extracted && p.extracted.location) || "")}
                </div>
                {msgCount > 0 && <div className="text-xs text-muted mt-4">{"💬 " + msgCount + " message" + (msgCount !== 1 ? "s" : "")}</div>}
              </div>
              <span className="text-muted">›</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* TAB: SCHEDULE */
function TabSchedule({ onOpenPerson }) {
  const visits = db.getAll("visits").filter(function(v) { return v.status !== "cancelled"; }).sort(function(a, b) { const dc = a.date.localeCompare(b.date); return dc !== 0 ? dc : (a.time || "").localeCompare(b.time || ""); });
  const people = db.getAll("people");
  const grouped = {};
  visits.forEach(function(v) { if (!grouped[v.date]) grouped[v.date] = []; grouped[v.date].push(v); });
  const today = todayStr();
  const upcoming = Object.keys(grouped).filter(function(d) { return d >= today; }).sort();
  const past = Object.keys(grouped).filter(function(d) { return d < today; }).sort().reverse().slice(0, 7);

  const renderDay = function(dateStr, isPast) {
    const d = new Date(dateStr + "T12:00:00");
    const isToday = dateStr === today;
    return (
      <div key={dateStr}>
        <div className="section-label" style={{ color: isToday ? "var(--green)" : undefined }}>
          {isToday ? "TODAY · " : ""}{d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
        </div>
        {grouped[dateStr].map(function(v) {
          const p = people.find(function(x) { return x.id === v.personId; });
          const dogs = db.getAll("dogs").filter(function(d) { return d.personId === v.personId; });
          const svc = SERVICE_MAP[v.serviceType];
          return (
            <div key={v.id} className="card card-tap card-sm" style={{ opacity: isPast || v.status === "completed" ? 0.5 : 1 }} onClick={function() { if (p) onOpenPerson(p.id); }}>
              <div className="row-between">
                <div>
                  <div className="row" style={{ gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{v.time || "—"}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{v.isMeetGreet ? "🤝 Meet and Greet" : ((svc && svc.icon) || "") + " " + (dogs.map(function(d) { return d.name; }).join(", ") || (p && p.name) || "—")}</span>
                  </div>
                  <div className="text-xs text-muted mt-2">{v.isMeetGreet ? "Meet and greet" : ((svc && svc.label) || "")}{v.duration ? " · " + v.duration : ""}</div>
                  {p && <div className="text-xs text-muted">{((p.address || (p.extracted && p.extracted.location)) || "").split(",")[0]}</div>}
                </div>
                {v.status === "completed" && <span className="badge badge-green">Done</span>}
                {v.isMeetGreet && v.status !== "completed" && <span className="badge badge-yellow">Meet</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div style={{ padding: "14px 16px 8px" }}>
        <div className="page-title">Schedule</div>
        <div className="page-sub">All upcoming confirmed visits</div>
      </div>
      {upcoming.length === 0 && <div className="empty-state"><div className="icon">📅</div><h3>Nothing booked yet</h3><p>Visits appear here once confirmed through messaging</p></div>}
      {upcoming.map(function(d) { return renderDay(d, false); })}
      {past.length > 0 && past.map(function(d) { return renderDay(d, true); })}
      <div style={{ height: 16 }} />
    </div>
  );
}

/* TAB: PRICES */
function TabPrices() {
  const [prices, setPrices] = useState(function() { return getPrices(); });
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");

  const startEdit = function(p) { setEditing(p.id); setEditVal(String(p.price)); };
  const saveEdit = function(p) {
    const next = prices.map(function(x) { return x.id === p.id ? Object.assign({}, x, { price: parseFloat(editVal) || x.price }) : x; });
    setPrices(next); db.set("prices", next); setEditing(null);
  };

  const grouped = {};
  prices.forEach(function(p) { if (!grouped[p.service]) grouped[p.service] = []; grouped[p.service].push(p); });

  return (
    <div>
      <div style={{ padding: "14px 16px 8px" }}>
        <div className="page-title">Prices</div>
        <div className="page-sub">Tap any rate to edit. Used automatically in Direct enquiry replies.</div>
      </div>
      {Object.entries(grouped).map(function(entry) {
        const service = entry[0]; const items = entry[1];
        return (
          <div key={service}>
            <div className="section-label">{service.toUpperCase()}</div>
            {items.map(function(p) {
              return (
                <div key={p.id} className="card card-tap" onClick={function() { if (editing !== p.id) startEdit(p); }}>
                  {editing === p.id ? (
                    <div onClick={function(e) { e.stopPropagation(); }}>
                      <div style={{ fontWeight: 600, marginBottom: 10 }}>{p.detail}</div>
                      <div className="row">
                        <span style={{ fontSize: 18, color: "var(--green)", fontWeight: 700 }}>£</span>
                        <input className="input" type="number" value={editVal} onChange={function(e) { setEditVal(e.target.value); }} style={{ fontSize: 20, fontWeight: 700 }} autoFocus onKeyDown={function(e) { if (e.key === "Enter") saveEdit(p); }} />
                      </div>
                      <div className="btn-row mt-8" style={{ padding: 0 }}>
                        <button className="btn btn-ghost btn-sm" onClick={function() { setEditing(null); }}>Cancel</button>
                        <button className="btn btn-green btn-sm" onClick={function() { saveEdit(p); }}>Save ✓</button>
                      </div>
                    </div>
                  ) : (
                    <div className="row-between">
                      <div><div style={{ fontWeight: 600, fontSize: 14 }}>{p.detail}</div><div className="text-sm text-muted">{(p.prefix || "") + "£" + p.price}</div></div>
                      <div className="row"><div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "var(--green)" }}>{"£" + p.price}</div><span style={{ fontSize: 13, color: "var(--muted2)" }}>✏️</span></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: "var(--radius-sm)", padding: "12px 14px" }}>
          <div style={{ fontSize: 12, color: "var(--purple)", fontWeight: 700, marginBottom: 4 }}>ℹ️ HOW THIS WORKS</div>
          <div className="text-sm text-muted">When replying to a Direct or Other enquiry, the AI uses these prices automatically. Rover and Bark set their own rates — prices are never mentioned there.</div>
        </div>
      </div>
      <div style={{ height: 16 }} />
    </div>
  );
}

/* ROOT APP */
const TABS = [
  { id: "today",    label: "Today",    icon: "🏠" },
  { id: "people",   label: "People",   icon: "🐾" },
  { id: "schedule", label: "Schedule", icon: "📅" },
  { id: "prices",   label: "Prices",   icon: "💷" },
];

export default function App() {
  const [tab, setTab] = useState("today");
  const [openPersonId, setOpenPersonId] = useState(null);
  const [showNewEnquiry, setShowNewEnquiry] = useState(false);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(function() { setTick(function(t) { return t + 1; }); }, []);

  if (showNewEnquiry) return (
    <>
      <style>{CSS}</style>
      <div className="app-shell"><div className="tab-content">
        <MessagingFlow person={null} onBack={function() { setShowNewEnquiry(false); refresh(); }} onPersonUpdated={refresh} />
      </div></div>
    </>
  );

  if (openPersonId) return (
    <>
      <style>{CSS}</style>
      <div className="app-shell"><div className="tab-content">
        <PersonDetail personId={openPersonId} onBack={function() { setOpenPersonId(null); refresh(); }} onUpdate={refresh} />
      </div></div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        <div className="tab-content">
          {tab === "today"    && <TabToday    key={tick} onOpenPerson={setOpenPersonId} />}
          {tab === "people"   && <TabPeople   key={tick} onOpenPerson={setOpenPersonId} onNewEnquiry={function() { setShowNewEnquiry(true); }} />}
          {tab === "schedule" && <TabSchedule key={tick} onOpenPerson={setOpenPersonId} />}
          {tab === "prices"   && <TabPrices   key={tick} />}
        </div>
        <nav className="bottom-nav">
          {TABS.map(function(t) {
            return (
              <button key={t.id} className={"nav-tab" + (tab === t.id ? " active" : "")} onClick={function() { setTab(t.id); }}>
                <span className="nav-icon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
