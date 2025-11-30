# Nginx Proxy Manager default page – deep dive

## Symptom
Requests to the site return the stock **"Congratulations! You've successfully started the Nginx Proxy Manager"** page instead of the CodeNodeX application.

## What that page means
- It is rendered directly by the Nginx Proxy Manager (NPM) container. Your traffic is terminating at the proxy layer and never reaching this codebase.
- In NPM, the page appears when you browse the admin UI on its management port (default 81) or when a host has not been configured for the requested domain.

## Expected targets in this project
- Frontend: Vite/React app built from `npm run build`. In production it should be served by a web server or CDN rather than the NPM admin UI.
- Node API: Express server listens on `PORT` (defaults to **5000**).【F:server/index.js†L19-L23】
- PHP API: Apache image is configured to listen on **5000** inside the container.【F:Dockerfile†L8-L19】

If NPM forwards to the wrong port or lacks a Proxy Host entry, it will return the admin landing page instead of these services.

## Probable causes
1) The domain/host is pointing to NPM's admin port (81) instead of the frontend service.
2) A Proxy Host is missing or targets the wrong upstream (e.g., still pointing at NPM rather than the Vite build or API).
3) The backend services are running on 5000 but NPM is not forwarding to that port.

## How to validate and fix
1) **Confirm services are running**
   - Frontend: `npm run build && npm run preview -- --host --port 4173` (or your production web server).
   - Node API: `PORT=5000 node server/index.js` and verify `http://localhost:5000/api/game-modules` responds.
   - PHP API: ensure the Apache/PHP container built from the provided `Dockerfile` is running and exposes port 5000.

2) **Check NPM bindings**
   - Log into NPM and ensure the admin UI is only on port 81.
   - Create/verify **Proxy Host** entries so the public hostname forwards to the correct upstream (frontend on 4173/443/80 as deployed; API on 5000 as needed).

3) **Retest the public URL**
   - After Proxy Host configuration, the default NPM congratulatory page should disappear and the app should load. If it does not, hit the upstream services directly (e.g., `curl http://localhost:5000`) to isolate whether NPM or the app is failing.

## Why this matters
When traffic stops at NPM, all application logging, metrics, and authentication layers are bypassed. Ensuring Proxy Hosts forward to the correct ports restores the intended frontend and API behavior.
