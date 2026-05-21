# CLAUDE.md — Project Standards for odyssey-task-2

## Project Overview
React + Three.js app featuring a walking GLB fox avatar, WASD controls, a 2D mini-map,
a mediasoup signalling server, Docker Compose stack, and Kubernetes manifests — all local.

See `doc/tasks.md` for the full step-by-step implementation checklist.

---

## Language & Tooling

| Concern        | Choice                          |
|----------------|---------------------------------|
| Frontend       | React 18, TypeScript (strict)   |
| Bundler        | Vite                            |
| 3D             | Three.js, @react-three/fiber, @react-three/drei |
| Styling        | CSS Modules (no CSS-in-JS)      |
| Server         | Node.js 20 + Express (ESM)      |
| Package manager| npm (lockfile committed)        |
| Container base | node:20-alpine, nginx:alpine    |

---

## TypeScript Rules

- `strict: true` in tsconfig — no exceptions
- No `any`. Use `unknown` and narrow, or define a proper type.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- Export types from the file that defines them; never re-export through an index barrel just for convenience.
- All React component files use `.tsx`; all other TypeScript files use `.ts`.

---

## React Component Standards

- Functional components only — no class components.
- One component per file; filename matches the exported component name exactly (`Avatar.tsx` exports `Avatar`).
- Props interface defined directly above the component and named `<ComponentName>Props`.
- Keep components small. If a component exceeds ~120 lines, extract child components or hooks.
- No inline styles. Use CSS Modules (`.module.css`) co-located with the component.

```
src/components/Avatar/
  Avatar.tsx
  Avatar.module.css
```

---

## Three.js / R3F Standards

- All 3D scene logic lives inside `@react-three/fiber`'s `<Canvas>` — never manipulate Three.js objects outside of it.
- Use `useFrame` for per-frame updates (animation, movement). Never use `setInterval` or `requestAnimationFrame` directly.
- Dispose of geometries, materials, and textures in `useEffect` cleanup or via `drei`'s helpers.
- GLB assets go in `frontend/public/assets/`. Reference them with absolute paths (`/assets/fox.glb`).
- Animation clips are accessed by the exact name from the GLB (`survey`, `walk`). If clip names change, update constants in `src/constants/animations.ts` only.

---

## Hooks

- Custom hooks live in `src/hooks/`. Filename prefixed `use` (`useKeyboard.ts`).
- A hook must do one thing. Split hooks that handle multiple concerns.
- Hooks must not import from other hooks except for pure utility hooks.

---

## State Management

- Component-local state with `useState` / `useReducer` for UI state.
- Shared mutable state (character position, velocity) kept in a `useRef` to avoid re-renders inside `useFrame`.
- No global state library unless the task explicitly requires it.

---

## Server (mediasoup + Express)

- All config consumed from `process.env`; never hardcode IPs, ports, or credentials.
- Every env var must have a documented default and be listed in `.env.example`.
- The `/health` route returns `{ status: "ok" }` with HTTP 200 — no auth, no middleware.
- Keep mediasoup worker/router setup in `server/src/mediasoup.js`; routing in `server/src/routes/`.

---

## Docker Standards

- Multi-stage Dockerfile for frontend: `builder` stage runs `npm run build`, final stage is `nginx:alpine` serving `/dist`.
- Multi-stage Dockerfile for server: `builder` installs deps, final stage copies only `node_modules` + `src`.
- No secrets or `.env` files copied into images. Pass secrets at runtime via environment variables.
- Images must be reproducible: pin base image tags (e.g., `node:20.19-alpine`).
- `.dockerignore` must exclude `node_modules`, `.env`, and build artifacts.

---

## Docker Compose Standards

- Single `docker-compose.yml` at the repo root.
- Service names: `frontend`, `mediasoup`.
- All ports, env vars, and volumes defined explicitly — no implicit defaults.
- Use `env_file: .env` for local development; document every variable in `.env.example`.
- `healthcheck` defined for each service.

---

## Kubernetes Standards

- All manifests in `k8s/` directory.
- One resource per file; filename pattern: `<name>-<kind>.yaml` (e.g., `mediasoup-deployment.yaml`).
- Namespace: `default` (local cluster, no need for a custom namespace).
- All env config injected via `ConfigMap`.
- Resource requests and limits set on every container.
- mediasoup UDP port strategy documented in `doc/udp-note.md`.

---

## File & Folder Layout

```
odyssey-task-2/
├── frontend/
│   ├── public/assets/          # GLB files, static assets
│   ├── src/
│   │   ├── components/         # One folder per component
│   │   ├── hooks/              # useKeyboard.ts, etc.
│   │   ├── constants/          # animations.ts, config.ts
│   │   └── App.tsx
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
├── server/
│   ├── src/
│   │   ├── mediasoup.js
│   │   ├── routes/health.js
│   │   └── index.js
│   ├── .dockerignore
│   └── Dockerfile
├── k8s/
│   ├── configmap.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── mediasoup-deployment.yaml
│   └── mediasoup-service.yaml
├── docker-compose.yml
├── .env.example
├── doc/
│   ├── tasks.md
│   └── udp-note.md
├── ASSIGNMENT.md
└── CLAUDE.md
```

---

## Naming Conventions

| Thing              | Convention              | Example                  |
|--------------------|-------------------------|--------------------------|
| React component    | PascalCase              | `MiniMap`, `Avatar`      |
| Hook               | camelCase, `use` prefix | `useKeyboard`            |
| CSS Module class   | camelCase               | `.overlayContainer`      |
| Constants          | SCREAMING_SNAKE_CASE    | `WALK_SPEED`, `MAP_SIZE` |
| k8s manifest file  | kebab-case              | `mediasoup-service.yaml` |
| Env variable       | SCREAMING_SNAKE_CASE    | `MEDIASOUP_PORT`         |

---

## Comments

- Write comments only when the **why** is non-obvious (hidden constraint, workaround, subtle invariant).
- No "what the code does" comments — good names cover that.
- No block/section dividers (`// ----`).

---

## Git

- Commits: imperative mood, present tense (`add Avatar component`, `fix walk animation blend`).
- One logical change per commit.
- Never commit `.env`, `node_modules`, or build artifacts.

---

## Consistency Checklist (ask before each implementation step)

Before implementing any step from `doc/tasks.md`, confirm:

1. Does the file/folder location match the layout above?
2. Is the TypeScript type explicit and non-`any`?
3. Is config coming from env vars (not hardcoded)?
4. Is the component/hook doing only one thing?
5. Does Docker output a reproducible, minimal image?
6. Does the k8s manifest include resource limits?
