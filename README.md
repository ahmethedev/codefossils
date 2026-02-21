# CodeFossils

Unearth forgotten GitHub projects worth reviving with modern AI tools.

CodeFossils discovers abandoned repositories — projects with great ideas that were left behind. Browse, search, and find your next side project inspiration.

## Stack

- **Backend:** Go + PostgreSQL
- **Frontend:** React + Vite
- **Data:** GitHub Search API (authenticated)

## Quick Start

### Prerequisites

- Go 1.21+
- Node.js 18+
- PostgreSQL 16+
- GitHub personal access token ([create one](https://github.com/settings/tokens) — no scopes needed)

### 1. Database

```bash
# Option A: Docker
docker compose up -d

# Option B: Local PostgreSQL
createdb codefossils
```

### 2. Environment

```bash
cp .env.example .env
# Edit .env with your GitHub token and database URL
```

### 3. Backend

```bash
cd backend
go run ./cmd/server
```

The server auto-migrates the database and fetches initial repos on first run.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/repos` | List repos (supports `category`, `sort`, `search`, `page`, `per_page`) |
| `POST` | `/api/repos/refresh` | Trigger a fresh GitHub fetch |
| `GET` | `/api/stats` | Category counts |

## How It Works

1. Backend searches GitHub for repos pushed >2 years ago with >5 stars using 10 curated search queries
2. Each repo gets an **idea score** (0-100) based on stars, forks, description quality, and topics
3. Repos are categorized (Web, Mobile, AI/ML, Dev Tools, Data, Games) via keyword matching
4. A background scheduler refreshes data every 6 hours
5. Frontend displays everything with filtering, sorting, and search

## License

MIT
