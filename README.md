# PWA

# React + TypeScript + Vite

Vite React App, Magic UI, materialUI

## Firebase Setup

1. `.env.example` nach `.env` kopieren.
2. Firebase Web App Keys in `.env` eintragen.
3. App neu starten (`npm run dev`).

### GitHub Pages (Actions)

Für den Build in GitHub Actions müssen dieselben Vite-Variablen als Repository Secrets gesetzt sein:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Firebase Hosting + Server Proxy

Für das Scraping braucht die App in Production einen Server-Proxy, weil Browser keine fremden Seiten direkt fetchen dürfen.

Diese Repo enthält dafür eine Firebase Function:

- Function: `proxy`
- Hosting-Rewrite: `/proxy` → Function

Beim Firebase-Deploy werden jetzt Hosting und Functions gemeinsam veröffentlicht:

- `npm run deploy:firebase`

Der Proxy ist absichtlich auf `aniworld.to` und Subdomains begrenzt.

Verfügbare Module:

- `src/lib/auth.ts` (Firebase Auth + Email/Passwort Helfer)
- `src/lib/firestore.ts` (Firestore Instanz + einfache CRUD Helfer)
