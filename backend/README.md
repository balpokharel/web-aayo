# Web Aayo API

Production-oriented NestJS API for the Web Aayo public website and admin portal.

## Local development

1. Copy `.env.example` to `.env` and replace development secrets.
2. Start MongoDB and Redis from the repository root with `docker compose up -d mongodb redis`.
3. Run `npm install`, `npm run seed`, then `npm run start:dev`.
4. Open `http://localhost:4000/api/docs` in development when Swagger is enabled.

## Security model

- Admin access uses short-lived JWT access cookies and rotating, hashed refresh-token sessions.
- Passwords use Argon2id. Five failed attempts trigger a timed account lock.
- Every admin data route is authenticated and checked against role permissions on the server.
- Important writes create immutable audit records. Financial and core CRM entities archive instead of hard-deleting.
- Public forms are validated, throttled and support Cloudflare Turnstile in production.
- Website conversations are persisted in MongoDB; Socket.IO delivers live visitor/admin messages with admin sessions verified from the same signed access cookie.
- Request bodies are allow-listed against registered schemas; user input is never passed directly into MongoDB queries.

## Production notes

- Use a least-privilege MongoDB Atlas user with TLS and IP restrictions.
- Use managed Redis for distributed throttling/queues as traffic grows; the core API does not fail when Redis is unavailable.
- Store uploads in Cloudinary or equivalent object storage. MongoDB stores metadata and URLs only.
- Keep API docs disabled or access-controlled in production.
- Use Atlas continuous backup or point-in-time recovery, document restore drills, and back up deployment configuration separately from secrets.
