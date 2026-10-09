# 🔑 UIKey

**The Universal UI/UX Extraction & Ingestion System for AI.**

UIKey bridges the gap between existing design systems and AI code generators (like v0, Claude, GPT-4). Instead of writing massive prompt descriptions or copying bloated HTML, UIKey visually extracts any website's styling and layout, compiling it into a hyper-compressed "UI Key" manifest. 

When you pass a UI Key to an AI agent, it instantly understands the exact design tokens, spacing, typography, and component structures required to perfectly clone or adapt the UI.

## 🚀 Features

- **Browser Extension Extractor:** One-click extraction of computed styles, bounding boxes, and layout geometry.
- **Design Token Compiler:** Automatically maps raw `#hex` codes and `px` values into semantic CSS variables (e.g., `--color-primary`, `--text-lg`).
- **AI Prompt Formatter:** Converts massive DOM trees into tiny, token-efficient pseudo-JSX that LLMs can ingest natively.
- **Universal Reusability:** Pass your UIKey link (`uikey.dev/k/[id]`) to any generic AI or Agentic coding platform.

## 📦 Packages in this Monorepo

- `apps/web`: The Next.js landing page, API backend, and dashboard.
- `apps/extension`: The Plasmo-based browser extension for extracting sites.
- `packages/extractor`: The core Node.js engine for parsing, compiling, and formatting DOM trees.
- `packages/cli`: (Upcoming) Terminal interface for fetching keys directly into your local IDE workflow.

## 🛠 Getting Started

1. Clone the repository.
2. Run `npm install` to setup the workspace.
3. Build the core extractor: `cd packages/extractor && npm run build`
4. Run the extension: `cd apps/extension && npm run dev`
5. Run the web backend: `cd apps/web && npm run dev`

---
*Built autonomously with AntiGravity AI.*
