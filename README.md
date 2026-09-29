# NIRAKSHAN — AI-Powered Digital Safety Shield

> **"We taught people how to stay safe on the streets.
> NIRAKSHAN asks: who protects them from threats on the screen?"**
>
> **Digital Safety is Physical Safety.**

NIRAKSHAN is a cross-platform prototype that helps women notice, understand, and **preserve
evidence of** emerging digital threats: AI-generated image abuse, suspicious Bluetooth trackers,
online harassment, and threatening conversations.

It is a **prevention, awareness, detection, evidence, and alerting system**. It is *not* a
replacement for police, emergency services, platform moderation, or professional support, and it
never takes action against another person on your behalf.

### This page is documentation — the app is here

> **Live site:** <https://nileshkumar-3.github.io/NIRAKSHAN/#/demo>
> The full deployed dashboard. Use **Launch Live Demo** on that page.

The React application lives in [`web/`](web). It is automatically deployed to GitHub Pages on every
push to `main`, so you can run the whole thing yourself by cloning and typing `npm install`.

---

## Table of contents

- [What it actually does](#what-it-actually-does)
- [Honest limitations](#honest-limitations)
- [Project structure](#project-structure)
- [Quick start](#quick-start)
- [Demo mode (for judges)](#demo-mode-for-judges)
- [Tech stack](#tech-stack)
- [Privacy and consent](#privacy-and-consent)
- [License](#license)

---

## What it actually does

| Surface | Capability | Status |
|---|---|---|
| **Web dashboard** (`web/`) | Threat monitoring, image verification, evidence vault, chat risk analysis, privacy centre | Working |
| **Provenance marker** | LSB steganographic marker + SHA-256 digests, computed in-browser | **Real** — verified round-trip |
| **Chat risk analyser** | Transparent keyword/heuristic engine with scored indicators | Working heuristic |
| **BLE tracker scanner** (`backend/tracker_scanner.py`) | `bleak` discovery, sighting history, RSSI correlation | Real where the OS permits, else simulated |
| **Browser extension** (`extension/`) | Watchlist warnings, upload guard, local action log | Working prototype |
| **Mobile app** (`mobile/`) | Tracker scan, alerts, evidence, privacy controls | Working prototype |

### The defence lifecycle

```
DIGITAL THREAT  ->  DETECTION  ->  RISK ANALYSIS  ->  USER ALERT
                ->  EVIDENCE PRESERVATION  ->  USER DECISION / REPORTING
```

You stay in control at the last step. NIRAKSHAN never contacts anyone, files anything, or blocks
anyone automatically.

---

## Honest limitations

These are deliberate design constraints, not bugs to be surprised by during a demo.

1. **NIRAKSHAN cannot prove who manipulated an image.** The invisible marker is a *provenance /
   integrity* mechanism. A detected marker means "this file still carries our marker". A missing
   marker is **inconclusive**, not proof of tampering — LSB markers are destroyed by ordinary
   re-encoding (JPEG), cropping, resizing, and most social-platform upload pipelines.
2. **NIRAKSHAN never claims 100% deepfake detection.** The manipulation check is an experimental
   risk assessment, not a verdict.
3. **A Bluetooth device is not a tracker.** The scanner reports what the radio reported. A device
   is only labelled *Potential Unknown Tracker* when the same unrecognised identifier was seen
   repeatedly at close range. OS restrictions, rotating identifiers, and privacy features on
   modern trackers can all limit detection.
4. **The extension watchlist is short and hand-curated.** Not being on the list is **not** an
   endorsement of a site. Every demo entry uses a reserved, non-routable TLD (`.demo`, `.test`,
   `.invalid`) so the demo can never point at a real website.
5. **Chat analysis is user-initiated and consent-gated.** NIRAKSHAN never reads your messages.
6. **An Evidence Vault record is not automatically legally admissible.** It is a tamper-evident
   record *you* choose to share, through your own process.
7. **Emergency numbers are region-scoped.** Choose yours in **Settings**; nothing is hard-coded as
   universal.

---

## Project structure

```
nirakshan/
├── web/                    React + Vite + Tailwind dashboard  (run this first)
│   ├── src/
│   │   ├── components/     Navbar, Footer, and 3 overlay modals
│   │   ├── pages/          Landing, Dashboard, Image Shield, Tracker Scan,
│   │   │                   Chat Safety, Evidence Vault, Alerts, Privacy,
│   │   │                   Settings, Emergency, How It Works, Demo Mode, 404
│   │   ├── services/
│   │   │   ├── api.js              FastAPI client + offline simulation fallbacks
│   │   │   └── steganography.js    LSB provenance marker engine
│   │   └── router.js        Dependency-free History API router
│   └── package.json
│
├── mobile/                 React Native / Expo app
│   ├── screens/            Home, Scan, Alerts, Evidence, Profile
│   ├── components/         Bottom nav + shared UI primitives
│   ├── services/api.js     Same backend, platform-aware host
│   └── theme.js            Design tokens shared with the web app
│
├── extension/              Browser extension (Manifest V3)
│   ├── manifest.json
│   ├── popup/              Protection status, website risk, upload guard
│   ├── background/         Service worker (watchlist + local action log)
│   ├── content/            Advisory banner + pre-upload warning
│   ├── config/             The curated demo watchlist
│   ├── icons/              Generated PNGs
│   └── tools/make_icons.py Pure-stdlib icon generator
│
├── backend/                Python / FastAPI
│   ├── main.py             API surface
│   ├── image_shield.py     Provenance + manipulation analysis
│   ├── tracker_scanner.py  bleak BLE scanning with simulation fallback
│   ├── chat_analyzer.py    Risk heuristics
│   ├── evidence.py         Vault records and report generation
│   └── requirements.txt
│
└── README.md
```

---

## Quick start

### 1. Web dashboard (the main deliverable)

```bash
cd web
npm install
npm run dev     # http://localhost:5173
```

Then open **http://localhost:5173/demo** for the judge demo, or
**http://localhost:5173/dashboard** for the full dashboard.

> `npm install` is required — dependencies are not committed. On a normal
> connection it takes about a minute; the first `npm run dev` then compiles the app.
>
> The web app works with **no backend running**. Every analysis call falls back to clearly
> labelled simulated data. Check **Settings → Analysis service** to see which mode you are in.

### 1b. Live site

The dashboard is deployed automatically to GitHub Pages on every push to `main` via
`.github/workflows/deploy.yml`:

**<https://nileshkumar-3.github.io/NIRAKSHAN/>**

The deployed build is mounted at a sub-path, so it switches to hash routing
(`/#/demo` rather than `/demo`) — that is what makes deep links survive on a
static host that cannot rewrite URLs to `index.html`.

### 2. Backend (optional, enables live analysis)

```bash
cd backend
python -m venv .venv
# Windows:  .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000
```

The backend must be reachable on `127.0.0.1:8000`. On Android emulators use `10.0.2.2:8000`;
the mobile app lets you change this from its Profile tab.

BLE scanning needs OS permission and hardware support. Where that is unavailable the scanner
returns **simulated** telemetry and says so.

### 3. Browser extension

1. `chrome://extensions` → enable **Developer mode**
2. **Load unpacked** → select the `extension/` folder
3. Click the NIRAKSHAN icon. You can also visit a demo host such as
   `http://deep-swap-nudify.demo/` to see the advisory banner and the upload guard.
   (These are reserved, non-routable demo domains; add them to your hosts file to resolve them
   locally, or just use the in-app extension simulator on the web dashboard.)

### 4. Mobile app

```bash
cd mobile
npm install
npx expo start
```

Then press `a` for Android, `i` for iOS, or scan the QR code with Expo Go.

---

## Demo mode (for judges)

Open **http://localhost:5173/demo** and press **Launch Live Demo**.

| # | Demo | What happens |
|---|---|---|
| 1 | **Image Shield** | Uploads (or generates a synthetic sample), embeds a real LSB provenance marker, computes a SHA-256 digest, then reads the marker back out of the re-encoded file to prove the round trip. |
| 2 | **Tracker Detection** | Requests BLE, scans, records device IDs / timestamps / RSSI, correlates repeated sightings, and raises a *potential* unknown-tracker warning. |
| 3 | **Chat Safety** | Analyses a pasted conversation, lists the matched risk indicators, scores them, and suggests next steps. |

Every result carries a **LIVE** or **SIMULATED** badge. Demo 1 is always real — it runs entirely
in the browser against actual pixel data. Demos 2 and 3 use the backend when it is running and
fall back to labelled simulation when it is not.

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Charts | Recharts |
| Mobile | React Native / Expo |
| Backend | Python, FastAPI, Uvicorn |
| Database | SQLite (prototype) |
| Imaging | Pillow / NumPy |
| Bluetooth | `bleak` |
| Extension | Chrome Manifest V3 |

The web app deliberately has **no router dependency** — `web/src/router.js` is ~90 lines of
History API — so the competition demo installs and runs with no network access.

---

## Privacy and consent

- Image processing and SHA-256 digests happen **in your browser**. The demo does not upload your
  files anywhere.
- Conversations are analysed **only when you press the button**, and the UI asks you to have
  consent first.
- You can delete every analysis record and evidence item at any time (**Settings**, **Privacy
  Center**).
- The extension stores a **local action log** of your own button presses. It records the domain
  and the action — never page content.
- **Report** only opens the official portal in a new tab. NIRAKSHAN never submits a report for you.

---

## License

MIT — see [LICENSE](LICENSE).


