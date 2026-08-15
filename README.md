# Book Discovery

A Next.js application for discovering books using the Open Library API. Search for books, view details, and save favorites.

## Live Demo

[Book Discovery](https://book-discovery-app-nextjs-mjlex7iqt-laiba-arshad.vercel.app/)

## Features

- Search books via the Open Library API
- View book details (covers, authors, description, subjects, publication info)
- Add/remove favorites, persisted via browser `localStorage`
- Dedicated Favorites page
- Responsive UI with loading, error, and empty states
- Health-check page for API connectivity
- Streaming AI Book Assistant for book recommendations and questions
- AI response controls including stop generation and jump to latest
- Responsive chat interface with automatic scrolling during streamed responses

## Tech Stack

Next.js 16 · React 19 · JavaScript · App Router · Tailwind CSS · Open Library API · Vercel AI SDK · OpenCode Zen · localStorage

## Routes

| Route | Purpose |
|---|---|
| `/` | Search and browse books with the AI Book Assistant |
| `/books/[id]` | View book details |
| `/favorites` | View/remove saved favorites |
| `/health` | Check API connectivity |
|/api/chat  | Streaming AI chat endpoint |

## Architecture

- **Server Components** — data fetching: `app/page.js`, `app/books/[id]/page.js`, `app/health/page.js`
- **Client Components** — interactivity: `SearchForm.jsx`, `BookCard.jsx`, `FavoriteButton.jsx`, `app/favorites/page.js`
- **Data layer** — `lib/books.js` handles search, normalization, detail fetching, author resolution, and cover URLs
- **AI layer** — `lib/ai.js` configures the OpenCode Zen provider, AI model, and system prompt
- **AI API route** — `app/api/chat/route.js` converts chat messages and streams AI responses to the client

## Project Structure

```text
app/
├── api/ 
│   └── chat/ 
│       └── route.js
├── books/[id]/page.js
├── favorites/page.js
├── health/page.js
├── globals.css
├── layout.js
└── page.js

components/
├── BookCard.jsx
├── Chat.jsx 
├── Chat.module.css
├── FavoriteButton.jsx
├── Navbar.jsx
└── SearchForm.jsx

lib/
├── ai.js
└── books.js
```

postcss.config.js
tailwind.config.js
package.json

## Design System

**Colors:** `primary` #0F172A · `secondary` #334155 · `background` #F8FAFC · `accent` #06B6D4

**Typography:** Space Grotesk (headings), Source Sans 3 (body)

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build
npm start
```

## Verification

`npm run build` and `npm run lint` both pass with no errors.

Manually tested:

Book search
Loading, error, and empty states
Book details
Invalid book IDs
Favorites add/remove/persistence
Navigation
Responsive layouts
AI chat submission
Streaming AI responses
Thinking indicator
Stop generation
Automatic scrolling during streaming
Jump to latest
Responsive chat layout

## APIs

## Open Library API

Uses the public Open Library API (Search, Works, Authors, Covers) — no API key required.

## AI Chat API

The application uses the Vercel AI SDK with OpenCode Zen to provide streaming AI responses through /api/chat.

The AI assistant is configured with a system prompt focused on book discovery, recommendations, and explanations.

The AI provider API key is stored in the OPENCODE_ZEN_API_KEY environment variable and is never exposed to the client.

### FE-07 Server-Side Tool: `searchBooks`

A server-side tool that the AI assistant can call to search Open Library for books matching the user's query. Input validation is handled with Zod.

**Tool name:** `searchBooks`

**Purpose:** Searches Open Library for books matching the user's query.

**Input schema (Zod-validated):**

```json
{
  "query": "string"
}
```

**Return shape:**

```json
{
  "query": "string",
  "results": [
    {
      "id": "string",
      "title": "string",
      "authors": ["string"],
      "firstPublishYear": "number | null",
      "coverUrl": "string | null"
    }
  ]
}
```

## How AI Helped

AI assisted with planning the Vite → Next.js migration, App Router structure, architecture decisions, incremental feature implementation, API integration, responsive design, debugging, streaming AI integration, and code/build verification. All output was reviewed, tested, and validated before being accepted — AI was used as a coding partner, not a replacement for review.

## Manual Improvements and Corrections

- Reviewed and backed up the original Vite project before migrating
- Migrated to Next.js with the App Router
- Separated API/data logic into `lib/books.js`
- Applied Server/Client Component boundaries appropriately
- Added Tailwind design tokens, responsive layouts, and loading/error/empty states
- Added a streaming AI Book Assistant
- Added a dedicated AI API route and provider configuration
- Implemented responsive chat layout and internal message scrolling
- Added streaming controls including Stop and Jump to latest
- Verified real API responses, valid/invalid routes, and `localStorage` persistence
- Ran successful production builds and lint checks

## Project Status

Complete and deployed on Vercel.

