# The Chronicle — Full-Stack Editorial Platform

A high-craft editorial publication built under the **"Print Magazine, Digital"** design specification, with a React frontend and a real Express + MongoDB Atlas backend.

- **Public journal** — feed, department and tag pages, search, single stories with threaded comments, likes and bookmarks.
- **Author dashboard** — Markdown editor with live preview, autosave, draft/publish flow.
- **Admin panel** — user roles, comment moderation, featured-story curation.

Authentication is real: bcrypt password hashes, JWTs, and server-enforced roles. All content lives in MongoDB; there is no mock data in the running app.

---

## 1. Quick Start

### Prerequisites
- Node.js `20.12+` (tested on Node `v24.19.0`; Render runs 22)
- A free MongoDB Atlas cluster (instructions below)

### Installation

```bash
npm install
```

### Run

```bash
npm run api   # Express API on http://localhost:5000
npm run dev   # Vite on http://localhost:5173 (proxies /api -> 5000)
```

Open **http://localhost:5173** — not port 5000, which only serves the JSON API (its root says so, and `/api/health` reports the database connection). Leave both terminals running. A second `npm run api` fails with a clear "Port 5000 is already in use" message rather than silently exiting.

The design system styleguide lives at `http://localhost:5173/styleguide`.

---

## 2. Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run api` | Express API with `.env` loaded |
| `npm run seed` | Upsert the demo users, posts and comments into Atlas |
| `npm run seed:fresh` | Wipe the collections first, then seed |
| `npm run promote -- <email> [role]` | Grant `admin`, or set any role |
| `npm run passwd -- <email> "<password>"` | Reset an account's password |
| `npm run build` | Regenerate the sitemap, then build into `dist/` |
| `npm run build:sitemap` | Sitemap only |
| `npm start` | Run the API **and** serve `dist/` from one process (production/Render) |
| `npm run preview` | Serve the production build on `http://localhost:4173` (Vite only, no API) |

---

## 3. Database Setup (MongoDB Atlas)

1. Create a free **M0** cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), add a database user, and allow access from `0.0.0.0/0` (Render and Vercel have no fixed outbound IP).
2. Copy `.env.example` to `.env` and set `MONGODB_URI` (the *Drivers* connection string) and a long random `JWT_SECRET`.
3. Seed the demo content: `npm run seed`.
4. Start both servers as shown above.

`.env` is read by `npm run api`, `npm run seed`, `npm run promote` and `npm run passwd` — no extra tooling required.

Seeded accounts all use the password `password123` (override with `SEED_PASSWORD` before seeding):

| Role | Email |
|---|---|
| Admin | `eleanor.vance@chronicle.press` |
| Author | `julian.thorne@chronicle.press` |
| Author | `maya.lindesai@chronicle.press` |
| Reader | `clara.reader@example.com` |
| Reader | `priya.sharma@example.com` |

### Joining as a reader or a writer

Registration at `/register` is public and lets the account choose its own role:

- **Reader** — comments, likes and bookmarks; reader comments go to moderation.
- **Writer** (`author` in the database) — everything a reader can do, plus the dashboard and the post editor.

`admin` can never be self-assigned; the API rejects it with a `400`. To make your own account an editor, register normally and promote it:

```bash
npm run promote -- you@example.com          # promote to admin
npm run promote -- you@example.com reader   # or set any role: reader | author | admin
```

Promotion takes effect on the next request — no restart and no re-login required. The client refreshes the cached profile on load, so the admin menu appears after a refresh.

Forgot a password? There is no reset email yet, so reset it from the terminal:

```bash
npm run passwd -- you@example.com "a new password"
```

---

## 4. Backend Layout

| Path | Purpose |
|---|---|
| [`server/app.js`](server/app.js) | Express app: body parsing, DB connection, route mounts, static SPA, error shapes |
| [`server/index.js`](server/index.js) | Production entry point (`npm start`) — binds `0.0.0.0:$PORT`, graceful shutdown |
| [`server/dev.js`](server/dev.js) | Local API entry point (`npm run api`) — API only, Vite serves the UI |
| [`server/og.js`](server/og.js) | Crawler `GET /posts/:slug` preview tags for social cards and search bots |
| [`server/generate-sitemap.js`](server/generate-sitemap.js) | Build-time `public/sitemap.xml` generator |
| [`server/db.js`](server/db.js) | Loads `.env`, caches the Atlas connection across serverless invocations |
| [`server/models.js`](server/models.js) | Mongoose schemas (`User`, `Post`, `Comment`, `Upload`) with indexed fields |
| [`server/routes/`](server/routes) | `auth`, `posts`, `comments`, `bookmarks`, `admin`, `uploads` |
| [`server/middleware/auth.js`](server/middleware/auth.js) | JWT signing, optional/required/admin guards |
| [`server/seed.js`](server/seed.js) | Loads `src/mocks/data.js` into MongoDB |
| [`server/promote.js`](server/promote.js) | CLI role management |
| [`server/passwd.js`](server/passwd.js) | CLI password reset |
| [`api/index.js`](api/index.js) | Vercel serverless entry wrapping the same Express app (unused on Render) |
| [`vite.config.js`](vite.config.js) | Dev proxy `/api` → `localhost:5000` |

Ids keep the original mock format (`usr_…`, `post_…`, `cmt_…`) so references between seeded documents stay stable.

Uploads are stored in MongoDB (`Upload` collection, 5 MB cap, JPEG/PNG/WebP only, SVG rejected) and served from `GET /api/uploads/:id`, so no Cloudinary credentials are required.

---

## 5. API Reference

Base path `/api`. Requests with a body are JSON. Errors are always `{ message }`; conflicts may add `conflict: true` and `suggestedSlug`.

### Auth

| Method | Path | Access | Notes |
|---|---|---|---|
| `POST` | `/auth/register` | public | `{ name, email, password, role }`, role is `reader` or `author` (default `reader`); `admin` returns 400 |
| `POST` | `/auth/login` | public | Returns `{ token, user }`; invalid credentials return 401 |
| `GET` | `/auth/me` | signed in | Current user from the database |

### Posts

| Method | Path | Access | Notes |
|---|---|---|---|
| `GET` | `/posts` | public | `page`, `limit`, `category`, `tag`, `search`, `status`, `authorId`, `sort` (`views` \| `oldest`); the default feed is published-only, featured-first |
| `GET` | `/posts/:slugOrId` | public | Drafts are visible only to their author and admins; looking up by `post_…` id requires ownership or admin |
| `POST` | `/posts/:slugOrId/view` | public | Increments the view counter |
| `POST` | `/posts/:id/like` | signed in | Toggles the like, returns the new state |
| `POST` | `/posts/:id/bookmark` | signed in | Toggles the bookmark |
| `POST` | `/posts` | author/admin | Creates a post; duplicate slug returns 409 with `suggestedSlug` |
| `PUT` | `/posts/:id` | owner/admin | Updates a post |
| `DELETE` | `/posts/:id` | owner/admin | Deletes a post |
| `GET` | `/posts/:id/comments` | public | Approved comments, threaded via `parentId` |

### Comments, bookmarks, uploads

| Method | Path | Access | Notes |
|---|---|---|---|
| `POST` | `/comments` | signed in | Reader comments are created unapproved (moderation queue) |
| `DELETE` | `/comments/:id` | owner/admin | Tombstones when replies exist, otherwise purges |
| `GET` | `/bookmarks` | signed in | The caller's bookmarked posts |
| `POST` | `/uploads/image` | signed in | Multipart `image` field, 5 MB cap, SVG rejected |
| `GET` | `/uploads/:id` | public | Serves the stored file |
| `GET` | `/health` | public | `{ status, database, uptime }`, 503 when disconnected |

### Admin

| Method | Path | Notes |
|---|---|---|
| `GET` | `/admin/users` | `q`, `role`, `page`, `limit`; includes post counts |
| `PATCH` | `/admin/users/:id/role` | `reader` \| `author` \| `admin` |
| `GET` | `/admin/comments` | `status=pending\|approved\|all`, `q`, pagination, aggregate counts |
| `PATCH` | `/admin/comments/:id/approve` | Publishes a held comment |
| `DELETE` | `/admin/comments/:id` | Moderator removal (tombstones) |
| `GET` | `/admin/posts` | Every author's posts, all statuses, `featured` filter |
| `PATCH` | `/admin/posts/:id/featured` | Cover curation, published only, max 3 |

---

## 6. Enforced Rules

**Authorization**
- Missing or unresolvable token → `401`. Wrong role → `403`. All `/api/admin/*` routes require `role === 'admin'`.
- Post and comment mutations allow the owner or an admin; readers cannot publish.

**User directory**
- Role must be exactly `reader`, `author` or `admin`; anything else returns `400`.
- An admin cannot change their own role (`403`).
- The last remaining admin cannot be demoted (`409`).

**Moderation**
- Reader comments start unapproved and are invisible on the public story until approved.
- Deleting a comment with replies sets `isDeleted` and replaces the text with `[This comment was removed by a moderator]`; comments without replies are purged.

**Cover curation**
- Only published stories can be featured (`400` for drafts).
- Maximum of 3 featured stories (`400` on the fourth).
- The home page falls back to the newest published stories when fewer than 3 are featured.

---

## 7. Environment Variables

| Variable | Scope | Default | Purpose |
|---|---|---|---|
| `MONGODB_URI` | server | — | Atlas connection string (`mongodb+srv://…`) |
| `MONGODB_DB` | server | `chronicle` | Database name |
| `JWT_SECRET` | server | — | Long random string used to sign session tokens |
| `SEED_PASSWORD` | server | `password123` | Password given to every seeded account |
| `PORT` | server | `5000` | Port to listen on. Render assigns one automatically |
| `SITE_URL` | server | *request origin* | Canonical origin used in the sitemap and social preview tags. Set it to your public Render URL |
| `VITE_API_URL` | client | *empty* | Blank means same-origin (Vite proxy locally, the Express server on Render). Set only when the API lives on another origin. |
| `VITE_API_MODE` | client | `live` | `live` calls the real API. `mock` swaps in the in-browser fake API with no server or database. |

A template is provided in [.env.example](.env.example). Client variables are baked in at build time, so redeploy after changing them.

---

## 8. Deployment (Render)

Render runs **one Node web service** that serves everything: `/api/*` from Express, the built SPA from `dist/`, and crawler preview tags. Because the frontend and API share an origin there is no CORS configuration and no `VITE_API_URL` to set.

### Deploy with the blueprint

1. Push this repository to GitHub.
2. In Render: **New → Blueprint**, pick the repo. [`render.yaml`](render.yaml) is detected and describes the service (free plan, `npm ci && npm run build`, `npm start`, health check on `/api/health`).
3. When prompted for `MONGODB_URI`, paste your Atlas connection string. Render generates `JWT_SECRET` itself and sets `MONGODB_DB=chronicle`.
4. In Atlas → **Network Access**, allow `0.0.0.0/0`. Render's outbound IPs are not fixed.
5. Wait for the deploy to go live, then open the service URL.

### Deploy manually (no blueprint)

| Setting | Value |
|---|---|
| Runtime | Node |
| Build command | `npm ci && npm run build` |
| Start command | `npm start` |
| Health check path | `/api/health` |

Environment variables: `MONGODB_URI`, `JWT_SECRET`, `MONGODB_DB=chronicle`, and `SITE_URL` set to the service URL (used by the sitemap and social tags). Do not set `PORT` — Render injects it. Do not set `NODE_ENV=production`, because the build needs Vite from `devDependencies`.

### After the first deploy

- **Seed the database once.** The free M0 cluster is shared with your local `.env`, so if you already ran `npm run seed` locally there is nothing to do. Otherwise open the service's **Shell** tab and run `npm run seed`, or from your machine: `MONGODB_URI="<atlas uri>" npm run seed`.
- **Create your admin account.** Register at `/register`, then either run `npm run promote -- you@example.com` in the Render Shell, or from your machine: `MONGODB_URI="<atlas uri>" npm run promote -- you@example.com`.
- **Check `SITE_URL`.** Without it, sitemap entries fall back to `https://chronicle.press` and preview tags follow the request host.
- **If the deploy fails at the health check**, Atlas is refusing the connection. The log line `[health] database connection failed: … isn't whitelisted` is the tell — fix Network Access, then **Manual Deploy → Deploy latest commit**.

### Free-plan behaviour

An idle free instance sleeps after ~15 minutes and needs ~50 seconds to wake on the next request. The first visit after a period of inactivity will feel slow; that is the instance booting, not a bug. Instance-local state is discarded on restart, which is fine because all data lives in Atlas.

### Keeping Vercel support

[`vercel.json`](vercel.json), [`api/index.js`](api/index.js) and [`middleware.js`](middleware.js) still describe a Vercel deployment (`/api/*` rewrite, SPA fallback, edge crawler redirect). They are ignored by Render. If you deploy to Vercel instead, set `MONGODB_URI`, `JWT_SECRET`, `MONGODB_DB` and `API_URL` there.

---

## 9. Known Gaps

- No rate limiting and no security headers. CORS is still open, though a single-service Render deploy does not need it.
- No password change in the UI and no forgot-password email — both are terminal commands.
- No email verification, so anyone can register with any address.
- M0 clusters have backups disabled; a bad `seed:fresh` is unrecoverable.
- Uploads live inside MongoDB documents rather than object storage.
- The build-time sitemap ([`server/generate-sitemap.js`](server/generate-sitemap.js)) still reads `src/mocks/data.js`, and `public/meta-cache.json` is a static snapshot — stories published from the app are not reflected in `sitemap.xml` until the build reruns. Crawler preview tags are unaffected on Render: they query MongoDB at request time.
- No automated test suite; the backend was verified with one-off HTTP checks.
