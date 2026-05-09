import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";

export const auth = getAuth(firebaseApp);

setPersistence(auth, browserLocalPersistence).catch((error: unknown) => {
  console.error("Firebase auth persistence setup failed", error);
});

export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

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
