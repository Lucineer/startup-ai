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

async function serveHTML(env: Env): Promise<Response> {
  const html = await env.STARTUP_KV.get('static:app.html', 'text');
  if (html) {
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  }
  // Fallback: try to serve from KV or return a message
  return new Response('Dashboard not deployed to KV. Push app.html to STARTUP_KV under key "static:app.html", or serve public/app.html directly.', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' },
  });
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
