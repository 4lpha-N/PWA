import {
  browserLocalPersistence,
  getRedirectResult,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";

export const auth = getAuth(firebaseApp);

setPersistence(auth, browserLocalPersistence).catch((error: unknown) => {
  console.error("Firebase auth persistence setup failed", error);
});

export const signInWithGooglePopup = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInWithGoogleRedirect = () => {
  const provider = new GoogleAuthProvider();
  return signInWithRedirect(auth, provider);
};

export const getGoogleRedirectResult = () => getRedirectResult(auth);

export const signOutUser = () => signOut(auth);

export const onAuthStateChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);
