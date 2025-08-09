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
