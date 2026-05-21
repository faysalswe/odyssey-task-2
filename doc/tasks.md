# Task 2 — GLB Avatar World: Implementation Plan

## Overview
Build a React + Three.js app with a walking GLB fox character, WASD controls, a 2D mini-map, Docker Compose stack, and Kubernetes manifests — all running locally.

---

## PART A — GLB Avatar (React + Three.js)

- [ ] **A1** — Scaffold React app (`create-react-app` or Vite + TypeScript)
- [ ] **A2** — Download GLB file from Google Drive and place in `public/assets/`
- [ ] **A3** — Install Three.js and `@react-three/fiber`, `@react-three/drei`
- [ ] **A4** — Create `<Scene>` component with a Three.js canvas, camera, lighting, and ground plane
- [ ] **A5** — Load the GLB model using `useGLTF` / `GLTFLoader`
- [ ] **A6** — Extract and wire the **idle (survey)** animation via `useAnimations`
- [ ] **A7** — Extract and wire the **walk** animation, blending in/out on movement
- [ ] **A8** — Rotate the character mesh to face its direction of travel

---

## PART B — Movement Controls

- [ ] **B1** — Add a `useKeyboard` hook that tracks W/A/S/D key state
- [ ] **B2** — Drive character position each frame in `useFrame` based on active keys
- [ ] **B3** — Switch animation clip (idle ↔ walk) based on whether any movement key is held
- [ ] **B4** — Create `<MiniMap>` component — a fixed 2D `<canvas>` overlay in the corner
- [ ] **B5** — Sync the dot on the mini-map with the character's world (X, Z) position

---

## PART C — Docker Compose

- [ ] **C1** — Write a `Dockerfile` for the React frontend (multi-stage: build → nginx)
- [ ] **C2** — Write a `Dockerfile` for the mediasoup signalling server (Node.js)
- [ ] **C3** — Add a `/health` endpoint to the mediasoup server returning `200 OK`
- [ ] **C4** — Write `docker-compose.yml` with `frontend` and `mediasoup` services
- [ ] **C5** — Expose port `3000` for the frontend, signal port for mediasoup
- [ ] **C6** — Drive all config (ports, IPs, credentials) via environment variables — no hardcoding
- [ ] **C7** — Verify: `docker compose up --build` → `curl http://localhost:3000/health` returns 200
- [ ] **C8** — Verify: fox avatar page loads in the browser at `http://localhost:3000`

---

## PART D — Kubernetes (local cluster)

- [ ] **D1** — Ensure a local cluster is available (minikube or kind)
- [ ] **D2** — Write `k8s/frontend-deployment.yaml` + `k8s/frontend-service.yaml` (NodePort or LoadBalancer)
- [ ] **D3** — Write `k8s/mediasoup-deployment.yaml` + `k8s/mediasoup-service.yaml`
- [ ] **D4** — Handle mediasoup UDP ports — use `hostNetwork: true` on the pod OR map UDP ports in the Service manifest; document the trade-off
- [ ] **D5** — Write `k8s/configmap.yaml` for environment config
- [ ] **D6** — Apply manifests: `kubectl apply -f k8s/`
- [ ] **D7** — Verify: `kubectl get pods` shows all pods in `Running` state
- [ ] **D8** — Take screenshot of `kubectl get pods` output for submission
- [ ] **D9** — Write a short note in `doc/udp-note.md` explaining the UDP port strategy

---

## Deliverables Checklist

- [ ] GitHub repo with all source, Docker, and k8s files
- [ ] `docker compose up --build` works end-to-end
- [ ] `http://localhost:3000/health` → 200 OK
- [ ] Fox avatar renders and walks in browser
- [ ] `kubectl get pods` screenshot (all Running)
- [ ] `doc/udp-note.md` — UDP/mediasoup Kubernetes explanation

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
