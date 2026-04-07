# Startup AI — Founder's Copilot

You don't need another generic chatbot. You need a tool that remembers your tradeoffs and decisions.

This is a Cocapn Fleet vessel built for founders. It maintains a record of your roadmap debates, unit math, and key compromises across conversations. Your context is preserved and owned by you. It is a single file you run yourself.

Most founder tools lock your data in a platform. This is code you control. You own the memory and the API key.

---

## 🚀 Try it
Live public instance: https://startup-ai.casey-digennaro.workers.dev

This demo uses ephemeral memory. For a permanent private copilot, deploy your own.

---

## How it Works
*   **You own everything.** No accounts. No platform TOS.
*   **Context is persistent.** It uses your Cloudflare KV store to remember past conversations.
*   **Zero lock-in.** One source file. No npm. No build pipeline.
*   **Runs on Cloudflare's free tier.** You likely will never pay to run this.

**One Honest Limitation:** Memory is stored in Cloudflare KV, which has eventual consistency. This means rare, brief delays between writing and reading your latest context.

---

## Quick Start
1.  **Fork** this repository.
2.  **Deploy** it directly to Cloudflare Workers.
3.  Add your LLM API key as a Cloudflare Secret. Visit your worker's `/setup` page for instructions.

That's the entire setup.

## Features
*   **BYOK LLM Routing:** Works with OpenAI, DeepSeek, Moonshot, SiliconFlow, and any OpenAI-compatible endpoint.
*   **Isolated Memory:** Persistent context stored in your private Cloudflare KV.
*   **Fleet Protocol Compliant:** Seamlessly works with all other Cocapn Fleet vessels.
*   **Lightweight Interface:** Plain HTML. No heavy JavaScript.
*   **Zero Dependencies:** No runtime packages.
*   **Standard Endpoints:** `/health`, `/setup`, `/api/chat`, `/api/seed`.

## Architecture
This is a single-file Cloudflare Worker implementing the Cocapn Fleet protocol. All memory stays in your Cloudflare KV. All LLM calls go directly from your worker to your provider. No data passes through our servers.

## Contributing
This project follows a fork-first philosophy. Fork it, modify it for your startup, and make it your own. If you build something generally useful, we welcome contributions.

## License
MIT License.

**Attribution:** Superinstance & Lucineer (DiGennaro et al.)

---
<div>
<strong>Fleet:</strong> <a href="https://the-fleet.casey-digennaro.workers.dev">the-fleet</a> | <a href="https://cocapn.ai">cocapn.ai</a>
</div>