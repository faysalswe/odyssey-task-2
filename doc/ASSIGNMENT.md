TASK 2 — GLB Avatar World (Local — Docker + Kubernetes)
What we are testing: Three.js / WebGL, Docker, Kubernetes (local cluster), WebRTC infra understanding

Overview
Build a React app that renders a provided GLB character in a 3D scene. The character walks around when controlled. Run the full stack locally using Docker Compose and write Kubernetes manifests for a local cluster.

This task is 100% local — no cloud deployment needed.

GLB File
Download from:

https://drive.google.com/file/d/1TpXqPsOPba7vx4U8BWd9o7mg_OQehBlh/view?usp=sharing
PART A — GLB Avatar (React + Three.js)
What we want to see:

The GLB character (fox) renders in the browser in a 3D scene
An idle animation (survey) plays when the character is not moving
A walk animation (walk) plays when the character is moving
The character faces the direction it is walking
PART B — Movement Controls
What we want to see:

Direction buttons (Up 'W' / Down 'S' / Left 'A' / Right 'D') move the character
A small 2D overhead mini-map shows the character's position as a dot, in sync with the 3D view
PART C — Docker Compose
What we want to see:

The entire stack (frontend + mediasoup server) starts with a single docker compose up --build command
All configuration is environment-variable driven — no hardcoded values
http://localhost:3000/health returns 200 OK
The avatar page (fox) is accessible in the browser
PART D — Kubernetes (local cluster)
What we want to see:

Kubernetes manifests that deploy the full stack to a local cluster
All pods reach Running state after kubectl apply
The mediasoup server and frontend are reachable via their exposed ports
A brief note in your submission explaining how you handled UDP port access for mediasoup in Kubernetes
Task 2 Deliverables
GitHub repo — frontend + Docker + k8s files
Screenshot of kubectl get pods showing all pods Running