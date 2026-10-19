# Web Aayo Admin

Secure Next.js administration workspace for CRM, projects, finance, CMS, marketing, analytics, configuration and real-time website chat.

## Local development

1. Copy `.env.example` to `.env`.
2. Start the API and create a Super Admin from the backend.
3. Run `npm install` and `npm run dev`.
4. Open `http://localhost:3001/admin/login`.

Every data view reads from the protected API. Empty charts and tables intentionally remain empty until real business data exists.

The Live Chat workspace receives Socket.IO events from the API, supports queue/active/resolved states, and falls back to short polling when a persistent connection is unavailable.
