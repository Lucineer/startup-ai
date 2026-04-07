# Startup AI — Your Decisions, Remembered

You don't remember that product tradeoff you discussed last week. Typical AI chatbots don't either. This one retains that context across every conversation.

It's a conversational AI that stores your discussion history, so you don't have to re-explain your startup's context in every new chat. All data stays in a Cloudflare Worker you control.

Try the public demo: [startup-ai.casey-digennaro.workers.dev](https://startup-ai.casey-digennaro.workers.dev)

## Quick Start

1.  **Fork** this repository.
2.  **Deploy** it to Cloudflare Workers.
3.  Add your LLM API key as a Cloudflare Secret (`LLM_API_KEY`). Visit your worker's `/setup` endpoint for detailed instructions.

That's it. You now have a private chat interface with memory.

## How It Is Different

1.  **You control it.** It's a single Cloudflare Worker. No service can be shut off, and no one can read your stored conversations.
2.  **Simple memory.** It appends your full conversation history to each new prompt. It does not use a vector database or embedding models.
3.  **Zero configuration.** No user accounts, surveys, or complex setup. Fork, add an API key, and deploy.

## Features

*   **Bring your own key:** Works with OpenAI, Anthropic, DeepSeek, and other OpenAI-compatible APIs.
*   **Private memory:** All conversation history is stored solely in your Cloudflare KV namespace.
*   **Zero runtime dependencies:** The Worker has no npm packages. It will not break from external dependency changes.
*   **Lightweight interface:** A plain HTML frontend that loads quickly.
*   **Standard endpoints:** Includes `/health`, `/setup`, `/api/chat`, and `/api/seed` for integration.

## A Specific Limitation

Conversation history is capped by Cloudflare KV's 25MB per key limit. In practice, this allows for roughly 50,000 to 100,000 messages before older context must be manually trimmed.

## Architecture

This is a single-file Cloudflare Worker. LLM calls go directly from your Worker to your chosen provider's API. There is no intermediary server, logging, or telemetry.

## Contributing

This project follows a fork-first philosophy. It is a starting point. You are encouraged to fork it, modify it extensively, and make it fit your needs. If you build a generally useful improvement, contributions back are welcome.

## License

MIT License.

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> &middot; <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>