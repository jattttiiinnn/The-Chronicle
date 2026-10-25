# The Chronicle — Full-Stack Blog Platform Frontend

A high-craft editorial publication frontend built under the **"Print Magazine, Digital"** design specification. Features a public reader journal, an author dashboard with live Markdown preview, and an administrative control panel.

The frontend operates in two modes:
1. **Standalone Mock Mode:** Runs out of the box with an in-memory & `localStorage` simulated API conforming strictly to the contract in Section 11.
2. **Real API Gateway Mode:** Seamlessly delegates to an Express/MongoDB backend gateway by configuring a single environment variable (`VITE_API_URL`).

---

## 1. Quick Start & Setup

### Prerequisites
- Node.js `v18+` (tested on Node `v24.19.0`)
- npm or pnpm

### Installation
```bash
# Install dependencies
npm install
```

### Development Server
```bash
# Start local development server (Vite on http://localhost:5173)
npm run dev
```

Visit the Design System Styleguide at:
`http://localhost:5173/styleguide`

---

## 2. Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles optimized production bundle into `dist/` |
| `npm run preview` | Serves the local production build on `http://localhost:4173` |

---

## 3. Environment Variables

All environment variables must begin with `VITE_`.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | *Empty* | When left blank, Axios uses the custom internal mock adapter with simulated latency and data persistence. When set to a URL (e.g., `http://localhost:5000` or production gateway), real network HTTP requests are dispatched through the Axios pipeline. |

A template is provided in `.env.example`.

---

## 4. API Endpoints Covered by Mock Adapter

The frontend mock adapter (`src/mocks/handlers.js`) adheres exactly to the data shapes and endpoints specified in Section 11.

### Primary Spec Contract Endpoints
- `GET /api/posts?page=&category=&tag=&search=&status=` — Paginated feed filtering
- `GET /api/posts/:slug` — Single post with populated author object
- `POST /api/posts` — Create folio post (author/admin only)
- `PUT /api/posts/:id` — Update folio post (post author or admin only)
- `DELETE /api/posts/:id` — Delete folio post (post author or admin only)
- `POST /api/posts/:id/like` — Toggle post like with optimistic counter
- `POST /api/uploads/image` — Multipart image upload (simulates Cloudinary/S3 returning `{ url, public_id }`)
- `GET /api/posts/:id/comments` — Threaded comments for a post
- `POST /api/comments` — Submit reader or author comment (threaded with `parentId`)
- `DELETE /api/comments/:id` — Delete comment (comment author or admin)
- `GET /api/admin/users` — Administrative user directory
- `PATCH /api/admin/users/:id/role` — Update user role (`reader` | `author` | `admin`)

### Additional Endpoints with Mock Fallback (`TODO(backend)`)
These endpoints are wrapped in `src/api/` with a clear `TODO(backend)` notice so the backend can be implemented to match:
- `POST /api/auth/login` — Sign in with email/password; returns `{ token, user }`
- `POST /api/auth/register` — Create reader folio account
- `GET /api/auth/me` — Validate session and fetch current authenticated user
- `POST /api/posts/:slug/view` — Record single increment of view counter per page visit
- `POST /api/posts/:id/bookmark` — Toggle bookmark for authenticated user
- `GET /api/bookmarks` — Retrieve authenticated user's bookmarked posts
- `PATCH /api/admin/posts/:id/featured` — Toggle `featured` flag on a post
- `PATCH /api/admin/comments/:id/approve` — Approve pending moderated reader comment

---

## 5. Deployment Readiness (Vercel)

The codebase includes `vercel.json` configured with:
1. Single Page Application (SPA) rewrites routing all non-asset requests to `/index.html`.
2. Immutable caching headers for hashed Vite production assets (`/assets/*`).

### Deployment Strategy
- **Production:** Automatic deployments triggered by pushes to branch `main`.
- **Staging / Preview:** Automatic preview deployments created from branch `staging` and pull requests.
