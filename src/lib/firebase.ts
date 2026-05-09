import { getApp, getApps, initializeApp } from "firebase/app";
import type { FirebaseOptions } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredConfigEntries = [
  ["VITE_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["VITE_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["VITE_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["VITE_FIREBASE_STORAGE_BUCKET", firebaseConfig.storageBucket],
  ["VITE_FIREBASE_MESSAGING_SENDER_ID", firebaseConfig.messagingSenderId],
  ["VITE_FIREBASE_APP_ID", firebaseConfig.appId],
] as const;

const missingEnvVars = requiredConfigEntries
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Firebase config missing in .env: ${missingEnvVars.join(", ")}. Copy .env.example and fill your values.`,
  );
}

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
