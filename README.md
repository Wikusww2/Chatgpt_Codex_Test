# Codex Starter

A minimal Node + TypeScript + Express template so Codex can:
- install deps
- build
- run
- run tests

## Quick start
```bash
npm install
npm run build
npm start
npm test
```

## What it does
- `src/index.ts` exposes a tiny utility and prints a message using an env var.
- `src/server.ts` runs an Express server.
- Tests validate functionality using Vitest and Supertest.

## Scripts
- `npm run build` → compile TypeScript to `dist/`
- `npm start` → run compiled server
- `npm test` → run unit tests

## Environment
Copy `.env.example` to `.env` and edit as needed.

## Retro Platformer
After building and starting the server, visit `http://localhost:3000/` to play a small retro-styled platformer served from the `public/` directory.

### Controls
- **Arrow Left/Right** – move
- **Space** – jump
- **Enter** – pause/resume
- **R** – restart with same seed
- **N** – generate a new seed/level

Appending `?headless=1` to the URL runs a headless smoke test that simulates the physics for 600 steps and logs the final position.

### Manual QA checklist
- Player can run and jump without clipping through tiles.
- Enemies patrol platforms and bounce the player when stomped.
- Different seeds (`?seed=foo`) produce distinct but beatable levels.
- Pause/resume and restart keys respond immediately.
