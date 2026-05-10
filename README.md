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

Verfügbare Module:

- `src/lib/auth.ts` (Firebase Auth + Email/Passwort Helfer)
- `src/lib/firestore.ts` (Firestore Instanz + einfache CRUD Helfer)
