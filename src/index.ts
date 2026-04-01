import {
  CompanyProfile, RunwayData, Investor, PitchVersion, Customer,
  Decision, Competitor, Metrics, HuddleSummary,
  SEED_COMPANY, SEED_RUNWAY, SEED_INVESTORS, SEED_PITCHES,
  SEED_CUSTOMERS, SEED_DECISIONS, SEED_COMPETITORS, SEED_METRICS,
  StartupInsights,
} from './startup/tracker';

interface Env {
  STARTUP_KV: KVNamespace;
  DEEPSEEK_API_KEY: string;
}

type DataKey = 'company' | 'runway' | 'investors' | 'pitches' | 'customers' | 'decisions' | 'competitors' | 'metrics';

async function getData<T>(kv: KVNamespace, key: DataKey, seed: T): Promise<T> {
  const stored = await kv.get(`startup:${key}`, 'json');
  return stored ? (stored as T) : seed;
}

async function setData<T>(kv: KVNamespace, key: DataKey, data: T): Promise<void> {
  await kv.put(`startup:${key}`, JSON.stringify(data));
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

function jsonResponse(handler: (req: Request, env: Env) => Promise<Response>) {
  return async (req: Request, env: Env): Promise<Response> => {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
    return handler(req, env);
  };
}

// ─── Chat SSE ────────────────────────────────────────────────────────────────

async function handleChat(req: Request, env: Env): Promise<Response> {
  const { message } = (await req.json()) as { message: string };

  const company = await getData(env.STARTUP_KV, 'company', SEED_COMPANY);
  const runway = await getData(env.STARTUP_KV, 'runway', SEED_RUNWAY);
  const investors = await getData(env.STARTUP_KV, 'investors', SEED_INVESTORS);
  const customers = await getData(env.STARTUP_KV, 'customers', SEED_CUSTOMERS);
  const decisions = await getData(env.STARTUP_KV, 'decisions', SEED_DECISIONS);
  const competitors = await getData(env.STARTUP_KV, 'competitors', SEED_COMPETITORS);
  const metrics = await getData(env.STARTUP_KV, 'metrics', SEED_METRICS);
  const pitches = await getData(env.STARTUP_KV, 'pitches', SEED_PITCHES);

  const context = StartupInsights.generateContextSummary(company, runway, investors, customers, decisions, metrics);

  const investorSummary = investors.map(i =>
    `${i.name} (${i.firm}) — ${i.status} — $${i.amount.toLocaleString()} — Last: ${i.lastContact} — Notes: ${i.notes.join('; ')}`
  ).join('\n');

  const decisionSummary = decisions.map(d =>
    `[${d.date}] ${d.decision} → Chose: ${d.chosenOption} → Outcome: ${d.outcome} → Learned: ${d.whatWeLearned}`
  ).join('\n');

  const systemPrompt = `You are StartupLog, a startup cofounder that lives in a repo. You have been present for every decision this company has made. You remember every investor conversation, every pivot, every customer feedback. Reference specific history when giving advice. Challenge assumptions by pointing to past decisions that didn't work out. Be direct, opinionated, and insightful — like a trusted cofounder who isn't afraid to tell the founder when they're wrong.

CURRENT CONTEXT:
${context}

INVESTOR PIPELINE:
${investorSummary}

KEY DECISIONS:
${decisionSummary}

PITCH HISTORY:
${pitches.map(p => `v${p.version} (${p.date}): Conversion ${p.conversionRate} — Feedback: ${p.feedback.join('; ')}`).join('\n')}

COMPETITORS:
${competitors.map(c => `${c.name}: ${c.howWeDifferentiate}`).join('\n')}

CUSTOMERS:
Paying: ${customers.filter(c => c.stage === 'paying').length} | Trial: ${customers.filter(c => c.stage === 'trial').length} | Churned: ${customers.filter(c => c.stage === 'churned').length}
Top feedback: ${customers.slice(0, 5).flatMap(c => c.feedbackQuotes).join(' | ')}

You speak with the authority of someone who was in the room for every meeting. Use specific dates, names, and outcomes. If the founder is about to repeat a mistake, call it out explicitly. If they're onto something, validate it with data from the company's history.`;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message },
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 2048,
          }),
        });

        if (!response.ok || !response.body) {
          const errText = await response.text();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `DeepSeek API error: ${response.status} — ${errText}` })}\n\n`));
          controller.close();
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const data = trimmed.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
            } catch { /* skip malformed chunks */ }
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`));
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// ─── HTML ─────────────────────────────────────────────────────────────────────

function getAppHTML(): string {
  return '<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Launchkit — Startup Dashboard</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0A0A0A;--surface:#111111;--surface2:#1A1A1A;--border:#222222;--text:#E5E5E5;--text2:#888888;--blue:#3B82F6;--blue-dim:#1E3A5F;--green:#10B981;--red:#EF4444;--yellow:#F59E0B;--purple:#8B5CF6}
body{font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
.sidebar{width:220px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;height:100vh;z-index:10}
.sidebar-logo{padding:20px;border-bottom:1px solid var(--border)}
.sidebar-logo h1{font-size:18px;font-weight:700;color:var(--blue);letter-spacing:-0.5px}
.sidebar-logo span{font-size:11px;color:var(--text2);display:block;margin-top:2px}
.sidebar-nav{flex:1;padding:8px 0;overflow-y:auto}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 20px;cursor:pointer;color:var(--text2);font-size:13px;transition:all .15s;border-left:2px solid transparent}
.nav-item:hover{color:var(--text);background:var(--surface2)}
.nav-item.active{color:var(--blue);background:var(--surface2);border-left-color:var(--blue)}
.nav-item svg{width:16px;height:16px;flex-shrink:0}
.main{margin-left:220px;flex:1;min-height:100vh;padding:24px 32px}
.tab-content{display:none}
.tab-content.active{display:block}
h2{font-size:22px;font-weight:700;margin-bottom:4px;letter-spacing:-0.5px}
.subtitle{color:var(--text2);font-size:13px;margin-bottom:24px}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:16px}
.stat-card .label{font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text2);margin-bottom:6px}
.stat-card .value{font-size:28px;font-weight:700;letter-spacing:-1px}
.stat-card .change{font-size:12px;margin-top:4px}
.change.positive{color:var(--green)}
.change.negative{color:var(--red)}
.change.neutral{color:var(--text2)}
.card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:20px;margin-bottom:16px}
.card h3{font-size:14px;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.card h3 .badge{font-size:10px;padding:2px 8px;border-radius:10px;font-weight:500}
.badge-green{background:rgba(16,185,129,.15);color:var(--green)}
.badge-red{background:rgba(239,68,68,.15);color:var(--red)}
.badge-blue{background:rgba(59,130,246,.15);color:var(--blue)}
.badge-yellow{background:rgba(245,158,11,.15);color:var(--yellow)}
.badge-purple{background:rgba(139,92,246,.15);color:var(--purple)}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:8px 12px;color:var(--text2);font-size:11px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid var(--border);font-weight:500}
td{padding:10px 12px;border-bottom:1px solid var(--border)}
tr:hover td{background:var(--surface2)}
.status-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px}
.dot-green{background:var(--green)}
.dot-red{background:var(--red)}
.dot-yellow{background:var(--yellow)}
.dot-blue{background:var(--blue)}
.dot-purple{background:var(--purple)}
.dot-gray{background:#555}
.kanban{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;align-items:start}
.kanban-col{background:var(--surface2);border-radius:8px;padding:12px;min-height:100px}
.kanban-col h4{font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text2);margin-bottom:10px;display:flex;justify-content:space-between}
.kanban-card{background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:10px;margin-bottom:8px;font-size:12px;cursor:pointer;transition:border-color .15s}
.kanban-card:hover{border-color:var(--blue)}
.kanban-card .name{font-weight:600;margin-bottom:2px}
.kanban-card .firm{color:var(--text2);font-size:11px}
.kanban-card .amount{color:var(--blue);font-weight:600;margin-top:4px}
.kanban-card .date{color:var(--text2);font-size:10px;margin-top:2px}
.chat-container{display:flex;flex-direction:column;height:calc(100vh - 100px)}
.chat-messages{flex:1;overflow-y:auto;padding:16px 0}
.chat-msg{margin-bottom:16px;display:flex;gap:12px}
.chat-msg.user{flex-direction:row-reverse}
.chat-avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
.chat-msg.assistant .chat-avatar{background:var(--blue-dim);color:var(--blue)}
.chat-msg.user .chat-avatar{background:var(--surface2);color:var(--text2)}
.chat-bubble{max-width:75%;padding:12px 16px;border-radius:12px;font-size:14px;line-height:1.6}
.chat-msg.assistant .chat-bubble{background:var(--surface);border:1px solid var(--border);border-top-left-radius:2px}
.chat-msg.user .chat-bubble{background:var(--blue-dim);color:var(--text);border-top-right-radius:2px}
.chat-input{display:flex;gap:8px;padding-top:12px;border-top:1px solid var(--border)}
.chat-input input{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 16px;color:var(--text);font-size:14px;outline:none}
.chat-input input:focus{border-color:var(--blue)}
.chat-input button{background:var(--blue);color:white;border:none;border-radius:8px;padding:12px 20px;cursor:pointer;font-weight:600;font-size:13px;transition:opacity .15s}
.chat-input button:hover{opacity:.85}
.chat-input button:disabled{opacity:.4;cursor:not-allowed}
.typing{display:inline-block;animation:blink 1.2s infinite}
@keyframes blink{0%,100%{opacity:.2}50%{opacity:1}}
.funnel-bar{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.funnel-bar .label{width:120px;font-size:12px;color:var(--text2);text-align:right}
.funnel-bar .bar{height:24px;background:var(--blue);border-radius:4px;min-width:2px;transition:width .3s;display:flex;align-items:center;padding-left:8px}
.funnel-bar .bar span{font-size:11px;color:white;font-weight:600}
.decision-timeline{position:relative;padding-left:24px;border-left:2px solid var(--border)}
.decision-item{margin-bottom:20px;position:relative}
.decision-item::before{content:\'\';position:absolute;left:-29px;top:4px;width:10px;height:10px;border-radius:50%;border:2px solid var(--blue);background:var(--bg)}
.decision-item.negative::before{border-color:var(--red)}
.decision-item.unclear::before{border-color:var(--yellow)}
.decision-item .date{font-size:11px;color:var(--text2);margin-bottom:2px}
.decision-item .title{font-weight:600;font-size:14px;margin-bottom:4px}
.decision-item .detail{font-size:12px;color:var(--text2);line-height:1.5}
.decision-item .outcome{display:inline-block;font-size:11px;padding:2px 8px;border-radius:10px;margin-top:4px}
.huddle-item{padding:12px 0;border-bottom:1px solid var(--border)}
.huddle-item:last-child{border-bottom:none}
.huddle-item .huddle-label{font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text2);margin-bottom:6px}
.huddle-item li{font-size:13px;margin-left:16px;margin-bottom:3px;line-height:1.4}
.pill{display:inline-block;font-size:11px;padding:2px 10px;border-radius:10px;margin:2px}
.pill-green{background:rgba(16,185,129,.1);color:var(--green);border:1px solid rgba(16,185,129,.2)}
.pill-red{background:rgba(239,68,68,.1);color:var(--red);border:1px solid rgba(239,68,68,.2)}
.pill-yellow{background:rgba(245,158,11,.1);color:var(--yellow);border:1px solid rgba(245,158,11,.2)}
.pill-blue{background:rgba(59,130,246,.1);color:var(--blue);border:1px solid rgba(59,130,246,.2)}
.pill-gray{background:rgba(255,255,255,.05);color:var(--text2);border:1px solid var(--border)}
.competitor-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.comp-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:16px}
.comp-card h4{font-size:15px;font-weight:700;margin-bottom:8px}
.comp-card .section{font-size:11px;text-transform:uppercase;color:var(--text2);margin:10px 0 4px;letter-spacing:.3px}
.comp-card li{font-size:12px;margin-left:14px;color:var(--text);line-height:1.5}
.comp-card .pricing{font-size:12px;color:var(--blue);margin-top:2px}
.comp-card .diff{font-size:12px;line-height:1.5;padding:8px;background:rgba(59,130,246,.05);border-radius:4px;border-left:2px solid var(--blue)}
</style>
</head>
<body>
<div class="sidebar">
  <div class="sidebar-logo">
    <h1>Launchkit</h1>
    <span>Startup Dashboard</span>
  </div>
  <div class="sidebar-nav">
    <div class="nav-item active" data-tab="dashboard">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
      Dashboard
    </div>
    <div class="nav-item" data-tab="runway">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 14h12M5 10V6M8 10V4M11 10V2M3 10h10"/></svg>
      Runway
    </div>
    <div class="nav-item" data-tab="investors">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="6" r="3"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5"/></svg>
      Investors
    </div>
    <div class="nav-item" data-tab="pitches">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="12" height="12" rx="1"/><path d="M5 6h6M5 8h4M5 10h5"/></svg>
      Pitches
    </div>
    <div class="nav-item" data-tab="customers">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4l5 3 5-3M2 4v8l5 3V7M12 4v8l-5 3"/></svg>
      Customers
    </div>
    <div class="nav-item" data-tab="decisions">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 1l7 14H1z"/></svg>
      Decisions
    </div>
    <div class="nav-item" data-tab="competitors">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="4" cy="8" r="3"/><circle cx="12" cy="8" r="3"/></svg>
      Competitors
    </div>
    <div class="nav-item" data-tab="metrics">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="1,12 5,8 8,10 15,3"/><polyline points="12,3 15,3 15,6"/></svg>
      Metrics
    </div>
    <div class="nav-item" data-tab="chat">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2h12v9H5l-3 3V2z"/><path d="M5 6h6M5 8h3"/></svg>
      Chat
    </div>
  </div>
</div>

<div class="main">

<!-- DASHBOARD -->
<div class="tab-content active" id="tab-dashboard">
  <h2>Dashboard</h2>
  <p class="subtitle">Daily huddle &mdash; <span id="huddle-date"></span></p>
  <div class="stats-grid" id="dashboard-stats"></div>
  <div id="huddle-content"></div>
</div>

<!-- RUNWAY -->
<div class="tab-content" id="tab-runway">
  <h2>Runway</h2>
  <p class="subtitle">Financial tracking and burn analysis</p>
  <div id="runway-content"></div>
</div>

<!-- INVESTORS -->
<div class="tab-content" id="tab-investors">
  <h2>Investor Pipeline</h2>
  <p class="subtitle">CRM with every interaction tracked</p>
  <div id="investor-pipeline"></div>
</div>

<!-- PITCHES -->
<div class="tab-content" id="tab-pitches">
  <h2>Pitch Iterations</h2>
  <p class="subtitle">Every version, every feedback, every conversion</p>
  <div id="pitches-content"></div>
</div>

<!-- CUSTOMERS -->
<div class="tab-content" id="tab-customers">
  <h2>Customer Development</h2>
  <p class="subtitle">Trial, paying, churned &mdash; every voice matters</p>
  <div id="customers-content"></div>
</div>

<!-- DECISIONS -->
<div class="tab-content" id="tab-decisions">
  <h2>Decision Log</h2>
  <p class="subtitle">Every fork in the road, what we chose, and what we learned</p>
  <div id="decisions-content"></div>
</div>

<!-- COMPETITORS -->
<div class="tab-content" id="tab-competitors">
  <h2>Competitive Landscape</h2>
  <p class="subtitle">Know your enemies. Know yourself better.</p>
  <div id="competitors-content"></div>
</div>

<!-- METRICS -->
<div class="tab-content" id="tab-metrics">
  <h2>KPI Tracker</h2>
  <p class="subtitle">The numbers that matter, tracked weekly</p>
  <div id="metrics-content"></div>
</div>

<!-- CHAT -->
<div class="tab-content" id="tab-chat">
  <h2>StartupLog</h2>
  <p class="subtitle">Your cofounder that was there for every decision</p>
  <div class="chat-container">
    <div class="chat-messages" id="chat-messages">
      <div class="chat-msg assistant">
        <div class="chat-avatar">S</div>
        <div class="chat-bubble">Hey. I\'ve been here since day one &mdash; the friends & family round, the Techstars application, every investor meeting, every customer call. What\'s on your mind?</div>
      </div>
    </div>
    <div class="chat-input">
      <input type="text" id="chat-input" placeholder="Ask me anything about your startup..." />
      <button id="chat-send">Send</button>
    </div>
  </div>
</div>

</div>

<script>
const API = \'\';
let cache = {};

async function api(path) {
  if (cache[path]) return cache[path];
  const res = await fetch(API + path);
  const data = await res.json();
  cache[path] = data;
  return data;
}

// ─── Navigation ──────────────────────────────────────────────────────────────
document.querySelectorAll(\'.nav-item\').forEach(item => {
  item.addEventListener(\'click\', () => {
    document.querySelectorAll(\'.nav-item\').forEach(n => n.classList.remove(\'active\'));
    document.querySelectorAll(\'.tab-content\').forEach(t => t.classList.remove(\'active\'));
    item.classList.add(\'active\');
    document.getElementById(\'tab-\' + item.dataset.tab).classList.add(\'active\');
  });
});

// ─── Dashboard ───────────────────────────────────────────────────────────────
async function renderDashboard() {
  const [metrics, runway, investors, customers, huddle] = await Promise.all([
    api(\'/api/metrics\'), api(\'/api/runway\'), api(\'/api/investors\'),
    api(\'/api/customers\'), api(\'/api/huddle\')
  ]);

  const activePipeline = investors.filter(i => [\'warm\',\'meeting\',\'due-diligence\',\'term-sheet\'].includes(i.status)).length;
  const paying = customers.filter(c => c.stage === \'paying\').length;

  document.getElementById(\'huddle-date\').textContent = huddle.date;
  document.getElementById(\'dashboard-stats\').innerHTML = `
    <div class="stat-card">
      <div class="label">Runway</div>
      <div class="value">${runway.currentRunwayMonths}<span style="font-size:14px;color:var(--text2);font-weight:400"> mo</span></div>
      <div class="change ${runway.currentRunwayMonths < 6 ? \'negative\' : \'neutral\'}">$${(runway.monthlyBurnRate - runway.monthlyRevenue).toLocaleString()}/mo net burn</div>
    </div>
    <div class="stat-card">
      <div class="label">MRR</div>
      <div class="value" style="color:var(--green)">$${metrics.mrr.toLocaleString()}</div>
      <div class="change positive">+${metrics.weeklyChange.mrr}% this week</div>
    </div>
    <div class="stat-card">
      <div class="label">Active Investors</div>
      <div class="value" style="color:var(--blue)">${activePipeline}</div>
      <div class="change neutral">${investors.filter(i=>i.status===\'due-diligence\').length} in due diligence</div>
    </div>
    <div class="stat-card">
      <div class="label">Churn Rate</div>
      <div class="value" style="color:${metrics.churnRate > 5 ? \'var(--red)\' : \'var(--green)\'}">${metrics.churnRate}%</div>
      <div class="change ${metrics.weeklyChange.churn < 0 ? \'positive\' : \'negative\'}">${metrics.weeklyChange.churn > 0 ? \'+\' : \'\'}${metrics.weeklyChange.churn}% this week</div>
    </div>
    <div class="stat-card">
      <div class="label">Paying Customers</div>
      <div class="value">${paying}</div>
      <div class="change neutral">${customers.filter(c=>c.stage===\'trial\').length} in trial</div>
    </div>
    <div class="stat-card">
      <div class="label">DAU</div>
      <div class="value">${metrics.dau}</div>
      <div class="change positive">+${metrics.weeklyChange.dau}% this week</div>
    </div>
  `;

  document.getElementById(\'huddle-content\').innerHTML = `
    <div class="card">
      <h3>Daily Huddle</h3>
      <div class="huddle-item"><div class="huddle-label" style="color:var(--green)">Wins</div><ul>${huddle.yesterdaysWins.map(w=>\'<li>\'+w+\'</li>\').join(\'\')}</ul></div>
      <div class="huddle-item"><div class="huddle-label" style="color:var(--blue)">Focus</div><ul>${huddle.todaysFocus.map(w=>\'<li>\'+w+\'</li>\').join(\'\')}</ul></div>
      ${huddle.blockers.length ? \'<div class="huddle-item"><div class="huddle-label" style="color:var(--red)">Blockers</div><ul>\'+huddle.blockers.map(w=>\'<li>\'+w+\'</li>\').join(\'\')+\'</ul></div>\' : \'\'}
      ${huddle.investorUpdateNeeded ? \'<div class="huddle-item"><div class="huddle-label" style="color:var(--yellow)">Investor Update Required</div><ul><li>Active pipeline needs attention this week</li></ul></div>\' : \'\'}
    </div>
  `;
}

// ─── Runway ──────────────────────────────────────────────────────────────────
async function renderRunway() {
  const runway = await api(\'/api/runway\');
  const totalSpending = runway.monthlySpending.reduce((a,b) => a + b.amount, 0);
  const netBurn = runway.monthlyBurnRate - runway.monthlyRevenue;

  document.getElementById(\'runway-content\').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="label">Runway Remaining</div><div class="value" style="color:${runway.currentRunwayMonths<6?\'var(--red)\':\'var(--green)\'}">${runway.currentRunwayMonths} mo</div></div>
      <div class="stat-card"><div class="label">Monthly Burn</div><div class="value">$${runway.monthlyBurnRate.toLocaleString()}</div></div>
      <div class="stat-card"><div class="label">Monthly Revenue</div><div class="value" style="color:var(--green)">$${runway.monthlyRevenue.toLocaleString()}</div></div>
      <div class="stat-card"><div class="label">Net Burn</div><div class="value" style="color:var(--red)">$${netBurn.toLocaleString()}</div></div>
      <div class="stat-card"><div class="label">Last Funding</div><div class="value">$${runway.lastFundingAmount.toLocaleString()}</div></div>
    </div>
    <div class="card">
      <h3>Monthly Spending Breakdown</h3>
      <table><thead><tr><th>Category</th><th>Amount</th><th>% of Total</th></tr></thead><tbody>
      ${runway.monthlySpending.map(s => `<tr><td>${s.category}</td><td>$${s.amount.toLocaleString()}</td><td>${(s.amount/totalSpending*100).toFixed(0)}%</td></tr>`).join(\'\')}
      <tr style="font-weight:700;border-top:2px solid var(--border)"><td>Total</td><td>$${totalSpending.toLocaleString()}</td><td>100%</td></tr>
      </tbody></table>
    </div>
    <div class="card">
      <h3>Funding History</h3>
      <table><thead><tr><th>Date</th><th>Amount</th><th>Source</th><th>Type</th></tr></thead><tbody>
      ${runway.fundingHistory.map(f => `<tr><td>${f.date}</td><td>$${f.amount.toLocaleString()}</td><td>${f.source}</td><td>${f.type}</td></tr>`).join(\'\')}
      <tr style="font-weight:700;border-top:2px solid var(--border)"><td>Total Raised</td><td colspan="3">$${runway.fundingHistory.reduce((a,b)=>a+b.amount,0).toLocaleString()}</td></tr>
      </tbody></table>
    </div>
  `;
}

// ─── Investors ───────────────────────────────────────────────────────────────
const statusOrder = [\'due-diligence\',\'meeting\',\'warm\',\'cold\',\'term-sheet\',\'signed\',\'passed\'];
const statusLabels = {cold:\'Cold\',warm:\'Warm\',meeting:\'Meeting\',\'due-diligence\':\'Due Diligence\',\'term-sheet\':\'Term Sheet\',signed:\'Signed\',passed:\'Passed\'};
const statusColors = {cold:\'gray\',warm:\'yellow\',meeting:\'blue\',\'due-diligence\':\'purple\',\'term-sheet\':\'green\',signed:\'green\',passed:\'red\'};

async function renderInvestors() {
  const investors = await api(\'/api/investors\');
  const grouped = {};
  statusOrder.forEach(s => grouped[s] = []);
  investors.forEach(i => { if (grouped[i.status]) grouped[i.status].push(i); });

  document.getElementById(\'investor-pipeline\').innerHTML = `
    <div class="kanban">
      ${statusOrder.filter(s => grouped[s].length > 0).map(status => `
        <div class="kanban-col">
          <h4>${statusLabels[status]} <span class="badge badge-${statusColors[status] === \'gray\' ? \'gray\' : statusColors[status]}">${grouped[status].length}</span></h4>
          ${grouped[status].map(i => `
            <div class="kanban-card">
              <div class="name">${i.name}</div>
              <div class="firm">${i.firm}</div>
              <div class="amount">$${i.amount.toLocaleString()}</div>
              <div class="date">Last: ${i.lastContact}${i.followUpDate ? \' | Follow up: \' + i.followUpDate : \'\'}</div>
              ${i.notes.length ? \'<div style="margin-top:4px;font-size:11px;color:var(--text2);line-height:1.4">\' + i.notes[i.notes.length-1] + \'</div>\' : \'\'}
            </div>
          `).join(\'\')}
        </div>
      `).join(\'\')}
    </div>
    <div class="card" style="margin-top:16px">
      <h3>All Interactions</h3>
      <table><thead><tr><th>Investor</th><th>Firm</th><th>Status</th><th>Amount</th><th>Last Contact</th><th>Follow Up</th></tr></thead><tbody>
      ${investors.map(i => `<tr>
        <td>${i.name}</td><td>${i.firm}</td>
        <td><span class="pill pill-${statusColors[i.status] === \'gray\' ? \'gray\' : statusColors[i.status]}">${statusLabels[i.status]}</span></td>
        <td>$${i.amount.toLocaleString()}</td><td>${i.lastContact}</td>
        <td>${i.followUpDate || \'—\'}</td>
      </tr>`).join(\'\')}
      </tbody></table>
    </div>
  `;
}

// ─── Pitches ─────────────────────────────────────────────────────────────────
async function renderPitches() {
  const pitches = await api(\'/api/pitches\');
  document.getElementById(\'pitches-content\').innerHTML = pitches.map(p => `
    <div class="card">
      <h3>Version ${p.version} <span class="badge badge-blue">${p.date}</span> <span class="badge ${p.conversionRate > 0.3 ? \'badge-green\' : \'badge-yellow\'}">${(p.conversionRate * 100).toFixed(0)}% conversion</span></h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:8px">
        <div>
          <div style="font-size:11px;text-transform:uppercase;color:var(--red);margin-bottom:6px;letter-spacing:.3px">Feedback</div>
          ${p.feedback.map(f => \'<div style="font-size:12px;margin-bottom:4px;padding-left:12px;border-left:2px solid var(--red);color:var(--text);line-height:1.4">\'+f+\'</div>\').join(\'\')}
        </div>
        <div>
          <div style="font-size:11px;text-transform:uppercase;color:var(--green);margin-bottom:6px;letter-spacing:.3px">What We Changed</div>
          ${p.changes.map(c => \'<div style="font-size:12px;margin-bottom:4px;padding-left:12px;border-left:2px solid var(--green);color:var(--text);line-height:1.4">\'+c+\'</div>\').join(\'\')}
        </div>
      </div>
      <div style="margin-top:12px">
        <div style="font-size:11px;text-transform:uppercase;color:var(--text2);margin-bottom:6px">Investors Who Saw This Version</div>
        <div>${p.investorsWhoSaw.map(i => \'<span class="pill pill-blue">\'+i+\'</span>\').join(\' \')}</div>
      </div>
    </div>
  `).join(\'\');
}

// ─── Customers ───────────────────────────────────────────────────────────────
const stageOrder = {paying:0,trial:1,churned:2,prospect:3};
const stageColors = {paying:\'green\',trial:\'blue\',churned:\'red\',prospect:\'gray\'};

async function renderCustomers() {
  const customers = await api(\'/api/customers\');
  customers.sort((a,b) => (stageOrder[a.stage]||9) - (stageOrder[b.stage]||9));

  const totals = {paying:0,trial:0,churned:0,prospect:0};
  customers.forEach(c => totals[c.stage]++);
  const avgNPS = customers.filter(c=>c.npsScore).reduce((a,c)=>a+c.npsScore,0) / Math.max(1,customers.filter(c=>c.npsScore).length);
  const avgLTV = customers.filter(c=>c.ltv>0).reduce((a,c)=>a+c.ltv,0) / Math.max(1,customers.filter(c=>c.ltv>0).length);
  const avgCAC = customers.filter(c=>c.cac>0).reduce((a,c)=>a+c.cac,0) / Math.max(1,customers.filter(c=>c.cac>0).length);

  document.getElementById(\'customers-content\').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="label">Paying</div><div class="value" style="color:var(--green)">${totals.paying}</div></div>
      <div class="stat-card"><div class="label">Trial</div><div class="value" style="color:var(--blue)">${totals.trial}</div></div>
      <div class="stat-card"><div class="label">Churned</div><div class="value" style="color:var(--red)">${totals.churned}</div></div>
      <div class="stat-card"><div class="label">Avg NPS</div><div class="value">${avgNPS.toFixed(1)}</div></div>
      <div class="stat-card"><div class="label">Avg LTV</div><div class="value">$${avgLTV.toFixed(0)}</div></div>
      <div class="stat-card"><div class="label">Avg CAC</div><div class="value">$${avgCAC.toFixed(0)}</div></div>
    </div>
    <div class="card">
      <h3>All Customers</h3>
      <table><thead><tr><th>Name</th><th>Company</th><th>Stage</th><th>NPS</th><th>CAC</th><th>LTV</th><th>Last Contact</th></tr></thead><tbody>
      ${customers.map(c => `<tr>
        <td>${c.name}</td><td>${c.company}</td>
        <td><span class="pill pill-${stageColors[c.stage]}">${c.stage}</span></td>
        <td>${c.npsScore !== null ? c.npsScore : \'—\'}</td>
        <td>${c.cac ? \'$\'+c.cac : \'—\'}</td>
        <td>${c.ltv ? \'$\'+c.ltv.toLocaleString() : \'—\'}</td>
        <td>${c.lastContact}</td>
      </tr>`).join(\'\')}
      </tbody></table>
    </div>
  `;
}

// ─── Decisions ───────────────────────────────────────────────────────────────
async function renderDecisions() {
  const decisions = await api(\'/api/decisions\');
  document.getElementById(\'decisions-content\').innerHTML = `
    <div class="decision-timeline">
      ${decisions.map(d => `
        <div class="decision-item ${d.outcome}">
          <div class="date">${d.date}</div>
          <div class="title">${d.decision}</div>
          <div class="detail"><strong>Options:</strong> ${d.optionsConsidered.join(\' &bull; \')}</div>
          <div class="detail"><strong>Chose:</strong> ${d.chosenOption}</div>
          <div class="detail"><strong>Rationale:</strong> ${d.rationale}</div>
          <span class="outcome pill pill-${d.outcome === \'positive\' ? \'green\' : d.outcome === \'negative\' ? \'red\' : \'yellow\'}">${d.outcome}</span>
          ${d.whatWeLearned ? \'<div class="detail" style="margin-top:6px;font-style:italic;color:var(--text2)">Lesson: \'+d.whatWeLearned+\'</div>\' : \'\'}
        </div>
      `).join(\'\')}
    </div>
  `;
}

// ─── Competitors ─────────────────────────────────────────────────────────────
async function renderCompetitors() {
  const competitors = await api(\'/api/competitors\');
  document.getElementById(\'competitors-content\').innerHTML = `
    <div class="competitor-grid">
      ${competitors.map(c => `
        <div class="comp-card">
          <h4>${c.name}</h4>
          <div style="font-size:11px;color:var(--text2);margin-bottom:8px">${c.marketPosition}</div>
          <div class="pricing">${c.pricing}</div>
          <div class="section">Strengths</div>
          <ul>${c.strengths.map(s=>\'<li>\'+s+\'</li>\').join(\'\')}</ul>
          <div class="section">Weaknesses</div>
          <ul>${c.weaknesses.map(s=>\'<li>\'+s+\'</li>\').join(\'\')}</ul>
          <div class="section">Our Differentiation</div>
          <div class="diff">${c.howWeDifferentiate}</div>
          <div style="margin-top:8px;font-size:10px;color:var(--text2)">Updated: ${c.lastUpdated}</div>
        </div>
      `).join(\'\')}
    </div>
  `;
}

// ─── Metrics ─────────────────────────────────────────────────────────────────
async function renderMetrics() {
  const metrics = await api(\'/api/metrics\');
  const maxFunnel = Math.max(...metrics.conversionFunnel.map(f=>f.count));

  document.getElementById(\'metrics-content\').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="label">MRR</div><div class="value" style="color:var(--green)">$${metrics.mrr.toLocaleString()}</div><div class="change positive">+${metrics.weeklyChange.mrr}% this week</div></div>
      <div class="stat-card"><div class="label">Churn Rate</div><div class="value">${metrics.churnRate}%</div><div class="change ${metrics.weeklyChange.churn<0?\'positive\':\'negative\'}">${metrics.weeklyChange.churn>0?\'+\':\'\'}${metrics.weeklyChange.churn}% this week</div></div>
      <div class="stat-card"><div class="label">DAU</div><div class="value">${metrics.dau}</div><div class="change positive">+${metrics.weeklyChange.dau}% this week</div></div>
      <div class="stat-card"><div class="label">Trend</div><div class="value" style="color:var(--green);font-size:20px;text-transform:uppercase">${metrics.trend} <span style="font-size:24px">&uarr;</span></div></div>
    </div>
    <div class="card">
      <h3>Conversion Funnel</h3>
      ${metrics.conversionFunnel.map(f => `
        <div class="funnel-bar">
          <div class="label">${f.stage}</div>
          <div class="bar" style="width:${Math.max(4,(f.count/maxFunnel)*100)}%"><span>${f.count}</span></div>
        </div>
      `).join(\'\')}
    </div>
    <div class="card">
      <h3>Weekly Change</h3>
      <table><thead><tr><th>Metric</th><th>Change</th><th>Direction</th></tr></thead><tbody>
        <tr><td>MRR</td><td class="positive">+${metrics.weeklyChange.mrr}%</td><td><span style="color:var(--green)">&uarr;</span></td></tr>
        <tr><td>Churn</td><td class="${metrics.weeklyChange.churn<0?\'positive\':\'negative\'}">${metrics.weeklyChange.churn>0?\'+\':\'\'}${metrics.weeklyChange.churn}%</td><td><span style="color:var(--green)">&darr;</span></td></tr>
        <tr><td>DAU</td><td class="positive">+${metrics.weeklyChange.dau}%</td><td><span style="color:var(--green)">&uarr;</span></td></tr>
        <tr><td>Conversion</td><td class="positive">+${metrics.weeklyChange.conversion}%</td><td><span style="color:var(--green)">&uarr;</span></td></tr>
      </tbody></table>
    </div>
  `;
}

// ─── Chat ────────────────────────────────────────────────────────────────────
const chatMessages = document.getElementById(\'chat-messages\');
const chatInput = document.getElementById(\'chat-input\');
const chatSend = document.getElementById(\'chat-send\');

function addChatMessage(role, content) {
  const div = document.createElement(\'div\');
  div.className = \'chat-msg \' + role;
  div.innerHTML = `<div class="chat-avatar">${role === \'assistant\' ? \'S\' : \'U\'}</div><div class="chat-bubble">${content}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

async function sendChat() {
  const message = chatInput.value.trim();
  if (!message) return;
  chatInput.value = \'\';
  addChatMessage(\'user\', message);

  const assistantDiv = addChatMessage(\'assistant\', \'<span class="typing">Thinking...</span>\');
  const bubble = assistantDiv.querySelector(\'.chat-bubble\');

  try {
    const res = await fetch(API + \'/api/chat\', {
      method: \'POST\',
      headers: { \'Content-Type\': \'application/json\' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      bubble.textContent = \'Error: \' + res.status;
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = \'\';
    let buffer = \'\';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(\'\n\');
      buffer = lines.pop() || \'\';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith(\'data: \')) continue;
        const data = trimmed.slice(6);
        if (data === \'[DONE]\') continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            fullText += \'Error: \' + parsed.error;
          } else if (parsed.content) {
            fullText += parsed.content;
          }
          bubble.textContent = fullText;
          chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch {}
      }
    }
  } catch (err) {
    bubble.textContent = \'Connection error: \' + err.message;
  }
}

chatSend.addEventListener(\'click\', sendChat);
chatInput.addEventListener(\'keydown\', e => { if (e.key === \'Enter\') sendChat(); });

// ─── Init ────────────────────────────────────────────────────────────────────
renderDashboard();
renderRunway();
renderInvestors();
renderPitches();
renderCustomers();
renderDecisions();
renderCompetitors();
renderMetrics();
</script>
</body>
</html>
';
}

function getLandingHTML(): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>StartupLog</title><meta http-equiv="refresh" content="0;url=/app"><style>body{background:#0a0a0a;color:#fff;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}</style><body><p>Redirecting...</p></body></html>`;
}

async function serveHTML(_env: Env): Promise<Response> {
  return new Response(getAppHTML(), { headers: { 'Content-Type': 'text/html' } });
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Root → dashboard
    if (path === '/' || path === '/index.html') {
      return serveHTML(env);
    }

    // Chat endpoint
    if (path === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    // Daily huddle
    if (path === '/api/huddle' && request.method === 'GET') {
      const investors = await getData(env.STARTUP_KV, 'investors', SEED_INVESTORS);
      const metrics = await getData(env.STARTUP_KV, 'metrics', SEED_METRICS);
      const decisions = await getData(env.STARTUP_KV, 'decisions', SEED_DECISIONS);
      const runway = await getData(env.STARTUP_KV, 'runway', SEED_RUNWAY);
      const customers = await getData(env.STARTUP_KV, 'customers', SEED_CUSTOMERS);
      const huddle = StartupInsights.generateHuddle(investors, metrics, decisions, runway, customers);
      return json(huddle);
    }

    // CRUD endpoints
    const crudRoutes: { path: string; key: DataKey; seed: unknown }[] = [
      { path: '/api/company', key: 'company', seed: SEED_COMPANY },
      { path: '/api/runway', key: 'runway', seed: SEED_RUNWAY },
      { path: '/api/investors', key: 'investors', seed: SEED_INVESTORS },
      { path: '/api/pitches', key: 'pitches', seed: SEED_PITCHES },
      { path: '/api/customers', key: 'customers', seed: SEED_CUSTOMERS },
      { path: '/api/decisions', key: 'decisions', seed: SEED_DECISIONS },
      { path: '/api/competitors', key: 'competitors', seed: SEED_COMPETITORS },
      { path: '/api/metrics', key: 'metrics', seed: SEED_METRICS },
    ];

    for (const route of crudRoutes) {
      if (path === route.path) {
        if (request.method === 'GET') {
          const data = await getData(env.STARTUP_KV, route.key, route.seed);
          return json(data);
        }
        if (request.method === 'POST') {
          const body = await request.json();
          await setData(env.STARTUP_KV, route.key, body);
          return json({ ok: true, key: route.key });
        }
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
