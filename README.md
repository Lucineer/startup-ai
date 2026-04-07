# Startup AI — Founder's Copilot

A Cocapn Fleet vessel that provides an AI assistant for your startup. It remembers your context across conversations.

This agent maintains a simple, persistent memory for your startup plans, decisions, and tradeoffs using Cloudflare KV. You own the deployment and data.

---

## Why this exists
You spend time re-explaining your company's context in new chat sessions. This agent keeps that context in your own Cloudflare KV store between conversations, so you can reference past decisions and plans.

### Live Instance
Test it without an account:
https://startup-ai.casey-digennaro.workers.dev

---

## Quick Start
1.  **Fork this repository.**
2.  Deploy to Cloudflare Workers (no build step).
3.  Add your LLM API key as a `LLM_API_KEY` secret.
4.  Start adding context via the web interface or `/api/seed` endpoint.

---

## What makes this different
*   **Your data, your account:** All context is stored in your Cloudflare KV namespace.
*   **Zero dependencies:** A single source file with no npm packages.
*   **Cost-effective:** Fits within Cloudflare's free tier for typical early-stage use.
*   **Fork-first:** You control the code and features. No upstream changes.

## Architecture
A lightweight Cloudflare Worker implementing the Cocapn Fleet protocol. It uses KV for persistence and routes LLM calls using your API key.

## Key Features
*   **BYOK LLM routing:** Works with OpenAI-compatible providers (tested with DeepSeek, Moonshot, others).
*   **Fleet endpoints:** Standard `/health`, `/setup`, `/api/chat`, and `/api/seed` routes.
*   **Basic context memory:** KV-stored context that persists across sessions.
*   **Simple web UI:** Plain HTML interface for interaction.

**Current Limitation:** The memory is a simple key-value store. For complex document retrieval, you may need to extend it with a vector database.

---

## Setup
After deploying, visit your worker's `/setup` route to configure your LLM API key.

## Contributing
Contributions are welcome. This project follows a fork-first philosophy—adapt it for your needs.

## License
MIT License.

**Attribution:** Superinstance & Lucineer (DiGennaro et al.)

---
<div>
  <strong>Fleet:</strong> <a href="https://the-fleet.casey-digennaro.workers.dev">the-fleet</a> | <a href="https://cocapn.ai">cocapn.ai</a>
</div>