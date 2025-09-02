# Local CS:GO Skins Fake Casino (Offline Demo)

This project is a local-only demo web app that simulates a casino experience using CS:GO-style skins as chips. It includes:

- Backend (Node.js + Express + SQLite) with accounts, inventories, games, and an admin rig panel
- Frontend (Vite + React) with login/register, lobby, inventory, and admin pages
- Local asset support for skin images (you provide images into `client/public/skins/`)

Important:
- This is for educational/demo purposes only. Do not deploy publicly or use trademarks or assets you do not own rights to.
- No real money, no real gambling. Outcomes can be rigged via the admin panel for testing.

## Quick Start

Prerequisites: Node.js 18+, npm

1) Install dependencies

```
npm run setup
```

2) Start backend and frontend (in parallel)

```
npm run dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:5173

3) Add skin images (optional)
- Place PNG/JPG images into `client/public/skins/` (filenames must match the `image` field you add via Admin → Skins)

4) Default admin
- After first run, register a user, then manually promote it to admin:
  - Stop the server, open `server/data/app.db` with any SQLite browser, set `is_admin` to `1` for your user
  - Or use the temporary environment flag `AUTO_ADMIN_EMAIL` to auto-promote on first login

## Scripts

- `npm run setup` → Installs server and client
- `npm run dev` → Runs server and client concurrently
- `npm run server` → Runs backend only
- `npm run client` → Runs frontend only

## Skin Assets

- You must provide your own skin images. Put them in `client/public/skins/`.
- Example: if a skin has `image: "ak-redline.png"`, ensure that file exists at `client/public/skins/ak-redline.png`.

## Disclaimer
This software is provided as-is for local educational/testing purposes. Do not use it to conduct gambling or any commercial activity. Respect third-party IP and assets. 