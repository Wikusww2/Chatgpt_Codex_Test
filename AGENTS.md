# AGENTS.md — Guidance for the Agent

## Project map
- Source code: `src/`
- Entry point: `src/server.ts`
- Tests: `tests/`
- Build output: `dist/`

## Primary commands
- Install: `npm install`
- Build: `npm run build`
- Run: `npm start`
- Test (CI mode): `npm test`

## Coding standards
- Language: TypeScript
- Module type: ESM
- Prefer pure functions and small modules in `src/`
- Keep tests colocated in `tests/`

## Constraints
- Do not commit secrets. Use `.env` (ignored) and `.env.example` for docs.

## Extension points
- New features: create under `src/` and mirror tests in `tests/`.
