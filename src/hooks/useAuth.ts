import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  getGoogleRedirectResult,
  onAuthStateChange,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  signOutUser,
} from "@/lib/auth";

type AuthDebugEntry = {
  timestamp: string;
  step: string;
  code?: string;
  message?: string;
};

const AUTH_DEBUG_STORAGE_KEY = "auth_debug_log";
const AUTH_DEBUG_MAX_ENTRIES = 12;

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

const readAuthDebugLog = (): AuthDebugEntry[] => {
  try {
    const raw = sessionStorage.getItem(AUTH_DEBUG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const pushAuthDebug = (entry: Omit<AuthDebugEntry, "timestamp">) => {
  const nextEntry: AuthDebugEntry = {
    timestamp: new Date().toISOString(),
    ...entry,
  };

  const currentEntries = readAuthDebugLog();
  const nextEntries = [...currentEntries, nextEntry].slice(-AUTH_DEBUG_MAX_ENTRIES);
  sessionStorage.setItem(AUTH_DEBUG_STORAGE_KEY, JSON.stringify(nextEntries));
};

export const getAuthDebugLog = () => readAuthDebugLog();

const isMobileDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isTouchDevice = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  return /iphone|ipad|ipod|android|mobile/.test(userAgent) || isTouchDevice;
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
      pushAuthDebug({
        step: "auth-state-changed",
        message: user ? `user=${user.email ?? "ohne-email"}` : "user=null",
      });
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getGoogleRedirectResult();
        if (result?.user) {
          pushAuthDebug({
            step: "redirect-result-success",
            message: result.user.email ?? "ohne-email",
          });
          return;
        }

        pushAuthDebug({
          step: "redirect-result-empty",
          message: "kein redirect result vorhanden",
        });
      } catch (error) {
        const { code, message } = toErrorDetails(error);
        pushAuthDebug({
          step: "redirect-result-error",
          code,
          message,
        });
        console.error("Google Redirect Login fehlgeschlagen", error);
      }
    };

    void checkRedirectResult();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (isMobileDevice()) {
      pushAuthDebug({
        step: "login-start-mobile-redirect",
        message: navigator.userAgent,
      });
      await signInWithGoogleRedirect();
      return;
    }

    try {
      pushAuthDebug({
        step: "login-start-popup",
      });
      await signInWithGooglePopup();
      pushAuthDebug({
        step: "popup-success",
      });
    } catch (error) {
      const { code, message } = toErrorDetails(error);

      if (shouldFallbackToRedirect(error)) {
        pushAuthDebug({
          step: "popup-fallback-redirect",
          code,
          message,
        });
        await signInWithGoogleRedirect();
        return;
      }

      pushAuthDebug({
        step: "popup-error",
        code,
        message,
      });
      console.error("Google Popup Login fehlgeschlagen", error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOutUser();
      pushAuthDebug({
        step: "logout-success",
      });
    } catch (error) {
      const { code, message } = toErrorDetails(error);
      pushAuthDebug({
        step: "logout-error",
        code,
        message,
      });
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
