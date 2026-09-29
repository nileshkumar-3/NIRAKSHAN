# NIRAKSHAN — Web Dashboard

React 19 + Vite 8 + Tailwind CSS 4. This is the main deliverable and the one to show first.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle into dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

## Routes

Routing is handled by `src/router.js` — a ~90-line History API implementation with **no router
dependency**, so the demo runs fully offline. It exposes the same `setActivePage('<id>')` contract
the components already use, which is why no page component needs a router-aware rewrite.

**The router picks its mode automatically.**

| Build | `BASE_URL` | Mode | Deep link looks like |
|---|---|---|---|
| `npm run dev` / `npm run build` | `/` | History | `/dashboard` |
| GitHub Pages deploy | `/<repo>/` | Hash | `/#/dashboard` |

That switch matters. History routing needs a server that rewrites every unknown path to
`index.html`; GitHub Pages has no such server, so `/dashboard` would 404 on refresh. Detecting the
sub-path and switching to hash routing means the same build works on any static host, and the
`public/404.js` shim bounces a hand-typed clean URL into the hash form.

| Path | Page |
|---|---|
| `/` | Landing |
| `/dashboard` | Overview |
| `/image-shield` | Image Shield + AI Manipulation Check |
| `/tracker-scan` | BLE tracker scan |
| `/chat-safety` | Chat Safety Analyzer |
| `/evidence` | Evidence Vault |
| `/alerts` | Alert Center |
| `/privacy` | Privacy Center |
| `/settings` | Settings (region, backend status, data controls) |
| `/get-help` | Emergency support |
| `/how-it-works` | Architecture + guardrails |
| `/demo` | **Demo Mode — start here for judges** |

An unknown path renders a 404 page rather than a blank screen.

## Architecture notes

- `src/App.jsx` owns routing, **cross-page evidence state**, and the three overlays (mobile
  simulator, extension simulator, evidence report). Saving evidence from Image Shield, Chat
  Safety, Tracker Scan, Alerts, or the Extension simulator all lands in the same place.
- `src/services/steganography.js` is the LSB provenance marker. It writes a 16-bit length header,
  the payload, and a `0xBEEF` footer into the blue-channel LSBs, and validates all three on read.
- `src/services/api.js` talks to the FastAPI backend and falls back to clearly labelled simulated
  data (each fallback carries `simulated: true`) so the app is fully demoable with no server.

## Working with no backend

Every analysis call has a fallback. **Settings → Analysis service** shows whether you are live or
in simulation, and Demo Mode badges each result individually.
