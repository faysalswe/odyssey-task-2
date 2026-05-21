#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="odyssey"
FRONTEND_IMAGE="odyssey-task-2-frontend:latest"
SERVER_IMAGE="odyssey-task-2-mediasoup:latest"

# ── helpers ──────────────────────────────────────────────────────────────────

step() { echo; echo "▶ $*"; }
ok()   { echo "  ✓ $*"; }
fail() { echo "  ✗ $*"; exit 1; }

confirm() {
  read -r -p "  Continue? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }
}

# ── step 1: prerequisites ─────────────────────────────────────────────────────

step "1/7  Check prerequisites"

for cmd in docker kind kubectl; do
  if command -v "$cmd" &>/dev/null; then
    ok "$cmd found ($(command -v "$cmd"))"
  else
    fail "$cmd not found — install it first (brew install $cmd)"
  fi
done

if ! docker info &>/dev/null; then
  fail "Docker daemon is not running — start Docker Desktop first"
fi
ok "Docker daemon is running"

# ── step 2: kind cluster ──────────────────────────────────────────────────────

step "2/7  Create kind cluster '$CLUSTER_NAME'"

if kind get clusters 2>/dev/null | grep -q "^${CLUSTER_NAME}$"; then
  ok "Cluster '$CLUSTER_NAME' already exists — skipping creation"
else
  kind create cluster --name "$CLUSTER_NAME" --config kind-config.yaml
  ok "Cluster created with port mappings (kind-config.yaml)"
fi

kubectl config use-context "kind-${CLUSTER_NAME}"
ok "kubectl context set to kind-${CLUSTER_NAME}"

# ── step 3: build frontend image ──────────────────────────────────────────────

step "3/7  Build frontend Docker image ($FRONTEND_IMAGE)"
docker build -t "$FRONTEND_IMAGE" ./frontend
ok "Frontend image built"

# ── step 4: build server image ────────────────────────────────────────────────

step "4/7  Build mediasoup server Docker image ($SERVER_IMAGE)"
docker build -t "$SERVER_IMAGE" ./server
ok "Server image built"

# ── step 5: load images into kind ────────────────────────────────────────────

step "5/7  Load images into kind cluster"
kind load docker-image "$FRONTEND_IMAGE" --name "$CLUSTER_NAME"
ok "Loaded $FRONTEND_IMAGE"

kind load docker-image "$SERVER_IMAGE" --name "$CLUSTER_NAME"
ok "Loaded $SERVER_IMAGE"

# ── step 6: apply manifests ───────────────────────────────────────────────────

step "6/7  Apply Kubernetes manifests (k8s/)"
kubectl apply -f k8s/
ok "Manifests applied"

# ── step 7: wait for rollout ──────────────────────────────────────────────────

step "7/7  Wait for deployments to be ready"
kubectl rollout status deployment/frontend   --timeout=120s
ok "frontend is ready"

kubectl rollout status deployment/mediasoup  --timeout=120s
ok "mediasoup is ready"

# ── done ──────────────────────────────────────────────────────────────────────

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Deploy complete."
echo
echo "  Open in browser (NodePort mapped to localhost):"
echo "    frontend  → http://localhost:8080"
echo "    mediasoup → http://localhost:3001"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
