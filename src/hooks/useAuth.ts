import { useCallback, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";
import type { User } from "firebase/auth";
import {
  getGoogleRedirectResult,
  onAuthStateChange,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  signOutUser,
} from "@/lib/auth";

const toErrorDetails = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return {
      code: undefined,
      message: String(error ?? "unbekannter Fehler"),
    };
  }

  const code = "code" in error ? String(error.code) : undefined;
  const message = "message" in error ? String(error.message) : "unbekannter Fehler";

  return { code, message };
};

const isStandaloneMode = () => {
  const mediaStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  const iosStandalone =
    "standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return mediaStandalone || iosStandalone;
};

const shouldFallbackToRedirect = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String(error.code) : "";
  return (
    code === "auth/popup-blocked" ||
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request" ||
    code === "auth/operation-not-supported-in-this-environment" ||
    code === "auth/unauthorized-domain"
  );
};

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Nach Login: User-Dokument in Firestore prüfen/ggf. anlegen
  useEffect(() => {
    if (!currentUser) return;
    const userRef = doc(db, "user", currentUser.uid);
    getDoc(userRef)
      .then((snap) => {
        if (!snap.exists()) {
          setDoc(userRef, {
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          })
            .then(() => {
              console.log("Firestore: User-Dokument angelegt", currentUser.uid);
            })
            .catch((err) => {
              console.error("Firestore: User-Dokument konnte nicht angelegt werden", err);
            });
        } else {
          console.log("Firestore: User-Dokument existiert bereits", currentUser.uid);
        }
      })
      .catch((err) => {
        console.error("Firestore: Fehler beim Lesen des User-Dokuments", err);
      });
  }, [currentUser]);

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        await getGoogleRedirectResult();
      } catch (error) {
        const { code, message } = toErrorDetails(error);
        console.error("Auth Redirect Result fehlgeschlagen", { code, message });
      }
    };

    void checkRedirectResult();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const allowRedirectFallback = !isStandaloneMode();

    try {
      await signInWithGooglePopup();
    } catch (error) {
      if (shouldFallbackToRedirect(error) && allowRedirectFallback) {
        try {
          await signInWithGoogleRedirect();
        } catch (redirectError) {
          const { code, message } = toErrorDetails(redirectError);
          console.error("Auth Redirect Fallback fehlgeschlagen", { code, message });
        }
        return;
      }

      const { code, message } = toErrorDetails(error);
      console.error("Auth Popup Login fehlgeschlagen", { code, message });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOutUser();
    } catch (error) {
      const { code, message } = toErrorDetails(error);
      console.error("Auth Logout fehlgeschlagen", { code, message });
    }
  }, []);

  return {
    currentUser,
    isLoggedIn: Boolean(currentUser),
    loginWithGoogle,
    logout,
  };
};
