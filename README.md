# Startup AI

A startup cofounder that lives in your repo. It was there for every investor meeting, every pivot, every customer conversation. No advisor can compete with an AI that was present for every decision.

## Stack

- **Cloudflare Worker** — API + routing
- **KV Storage** — persistent data
- **DeepSeek** — AI chat via SSE streaming
- **Single HTML** — full dashboard UI

## Routes

| Endpoint | Methods | Description |
|---|---|---|
| `/` | GET | Dashboard UI |
| `/api/chat` | POST | SSE streaming chat with StartupLog AI |
| `/api/company` | GET, POST | Company profile |
| `/api/runway` | GET, POST | Financial/runway tracking |
| `/api/investors` | GET, POST | Investor CRM |
| `/api/pitches` | GET, POST | Pitch iteration history |
| `/api/customers` | GET, POST | Customer development |
| `/api/decisions` | GET, POST | Decision log |
| `/api/competitors` | GET, POST | Competitive analysis |
| `/api/metrics` | GET, POST | KPI dashboard |
| `/api/huddle` | GET | Auto-generated daily huddle |

## Setup

```bash
npm install
npx wrangler kv:namespace create STARTUP_KV
# Update wrangler.toml with the KV namespace ID
npx wrangler secret put DEEPSEEK_API_KEY
# Upload the dashboard HTML to KV:
npx wrangler kv:key put --binding STARTUP_KV "static:app.html" --path public/app.html
npm run dev
```

## Seed Data

Comes pre-loaded with realistic seed-stage SaaS startup data:
- **Launchkit** — 6 months old, 4-person team, SF
- **$180K raised** pre-seed, 8 months runway
- **12 investors** in pipeline (1 due diligence, 2 warm)
- **3 pitch versions** with feedback trails
- **45 trial customers** (8 paying, MRR $2,400)
- **15 key decisions** with outcomes
- **4 competitors** analyzed
- **5% churn**, growing MRR week-over-week

## Architecture

```
src/
  index.ts          Worker entry, routing, SSE chat
  startup/
    tracker.ts      Types, seed data, insight generators
public/
  app.html          Single-file dashboard
```
