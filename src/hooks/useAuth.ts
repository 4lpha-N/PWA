import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  getGoogleRedirectResult,
  onAuthStateChange,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  signOutUser,
} from "@/lib/auth";

const isIOS = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

const shouldFallbackToRedirect = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String(error.code) : "";
  return (
    code === "auth/popup-blocked" ||
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request"
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

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        await getGoogleRedirectResult();
      } catch (error) {
        console.error("Google Redirect Login fehlgeschlagen", error);
      }
    };

    void checkRedirectResult();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (isIOS()) {
      await signInWithGoogleRedirect();
      return;
    }

    try {
      await signInWithGooglePopup();
    } catch (error) {
      if (shouldFallbackToRedirect(error)) {
        await signInWithGoogleRedirect();
        return;
      }

      console.error("Google Popup Login fehlgeschlagen", error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Logout fehlgeschlagen", error);
    }
  }, []);

  return {
    currentUser,
    isLoggedIn: Boolean(currentUser),
    loginWithGoogle,
    logout,
  };
};
