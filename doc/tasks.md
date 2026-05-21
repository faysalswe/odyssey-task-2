# Task 2 — GLB Avatar World: Implementation Plan

## Overview
Build a React + Three.js app with a walking GLB fox character, WASD controls, a 2D mini-map, Docker Compose stack, and Kubernetes manifests — all running locally.

---

## PART A — GLB Avatar (React + Three.js)

- [x] **A1** — Scaffold React app (`create-react-app` or Vite + TypeScript)
- [x] **A2** — Download GLB file from Google Drive and place in `public/assets/`
- [x] **A3** — Install Three.js and `@react-three/fiber`, `@react-three/drei`
- [x] **A4** — Create `<Scene>` component with a Three.js canvas, camera, lighting, and ground plane
- [x] **A5** — Load the GLB model using `useGLTF` / `GLTFLoader`
- [x] **A6** — Extract and wire the **idle (survey)** animation via `useAnimations`
- [x] **A7** — Extract and wire the **walk** animation, blending in/out on movement
- [x] **A8** — Rotate the character mesh to face its direction of travel

---

## PART B — Movement Controls

- [x] **B1** — Add a `useKeyboard` hook that tracks W/A/S/D key state
- [x] **B2** — Drive character position each frame in `useFrame` based on active keys
- [x] **B3** — Switch animation clip (idle ↔ walk) based on whether any movement key is held
- [x] **B4** — Create `<MiniMap>` component — a fixed 2D `<canvas>` overlay in the corner
- [x] **B5** — Sync the dot on the mini-map with the character's world (X, Z) position

---

## PART C — Docker Compose

- [x] **C1** — Write a `Dockerfile` for the React frontend (multi-stage: build → nginx)
- [x] **C2** — Write a `Dockerfile` for the mediasoup signalling server (Node.js)
- [x] **C3** — Add a `/health` endpoint to the mediasoup server returning `200 OK`
- [x] **C4** — Write `docker-compose.yml` with `frontend` and `mediasoup` services
- [x] **C5** — Expose port `3000` for the frontend, signal port for mediasoup
- [x] **C6** — Drive all config (ports, IPs, credentials) via environment variables — no hardcoding
- [x] **C7** — Verify: `docker compose up --build` → `curl http://localhost:3000/health` returns 200
- [x] **C8** — Verify: fox avatar page loads in the browser at `http://localhost:3000`

---

## PART D — Kubernetes (local cluster)

- [x] **D1** — Ensure a local cluster is available (minikube or kind)
- [x] **D2** — Write `k8s/frontend-deployment.yaml` + `k8s/frontend-service.yaml` (NodePort or LoadBalancer)
- [x] **D3** — Write `k8s/mediasoup-deployment.yaml` + `k8s/mediasoup-service.yaml`
- [x] **D4** — Handle mediasoup UDP ports — use `hostNetwork: true` on the pod OR map UDP ports in the Service manifest; document the trade-off
- [x] **D5** — Write `k8s/configmap.yaml` for environment config
- [x] **D6** — Apply manifests: `kubectl apply -f k8s/`
- [x] **D7** — Verify: `kubectl get pods` shows all pods in `Running` state
- [ ] **D8** — Take screenshot of `kubectl get pods` output for submission
- [x] **D9** — Write a short note in `doc/udp-note.md` explaining the UDP port strategy

---

## Deliverables Checklist

- [ ] GitHub repo with all source, Docker, and k8s files
- [x] `docker compose up --build` works end-to-end
- [x] `http://localhost:3000/health` → 200 OK
- [x] Fox avatar renders and walks in browser
- [ ] `kubectl get pods` screenshot (all Running)
- [x] `doc/udp-note.md` — UDP/mediasoup Kubernetes explanation

---

## Suggested File Structure

```
odyssey-task-2/
├── frontend/
│   ├── public/assets/fox.glb
│   ├── src/
│   │   ├── components/
│   │   │   ├── Scene.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── MiniMap.tsx
│   │   ├── hooks/
│   │   │   └── useKeyboard.ts
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── server/
│   ├── index.js        # mediasoup + /health endpoint
│   └── Dockerfile
├── docker-compose.yml
├── k8s/
│   ├── configmap.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── mediasoup-deployment.yaml
│   └── mediasoup-service.yaml
└── doc/
    ├── tasks.md        # this file
    └── udp-note.md     # Kubernetes UDP strategy explanation
```
