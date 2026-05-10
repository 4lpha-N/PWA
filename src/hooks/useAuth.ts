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
const AUTH_REDIRECT_PENDING_KEY = "auth_redirect_pending";

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

const setRedirectPending = (value: boolean) => {
  try {
    if (value) {
      sessionStorage.setItem(AUTH_REDIRECT_PENDING_KEY, "1");
      return;
    }
    sessionStorage.removeItem(AUTH_REDIRECT_PENDING_KEY);
  } catch {
    // ignore storage errors
  }
};

const isRedirectPending = () => {
  try {
    return sessionStorage.getItem(AUTH_REDIRECT_PENDING_KEY) === "1";
  } catch {
    return false;
  }
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
      if (user) {
        setRedirectPending(false);
      }
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkRedirectResult = async () => {
      const redirectWasPending = isRedirectPending();

      try {
        const result = await getGoogleRedirectResult();
        if (result?.user) {
          setRedirectPending(false);
          pushAuthDebug({
            step: "redirect-result-success",
            message: result.user.email ?? "ohne-email",
          });
          return;
        }

        if (redirectWasPending) {
          pushAuthDebug({
            step: "redirect-result-empty-after-pending",
            message: "redirect gestartet, aber kein result zurueck",
          });
        } else {
          pushAuthDebug({
            step: "redirect-result-empty",
            message: "kein redirect result vorhanden",
          });
        }
      } catch (error) {
        setRedirectPending(false);
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
      try {
        pushAuthDebug({
          step: "login-start-mobile-redirect",
          message: navigator.userAgent,
        });
        setRedirectPending(true);
        await signInWithGoogleRedirect();
      } catch (error) {
        setRedirectPending(false);
        const { code, message } = toErrorDetails(error);
        pushAuthDebug({
          step: "mobile-redirect-init-error",
          code,
          message,
        });
        console.error("Google Redirect Login Start fehlgeschlagen", error);
      }
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
        try {
          setRedirectPending(true);
          await signInWithGoogleRedirect();
        } catch (redirectError) {
          setRedirectPending(false);
          const redirectErrorDetails = toErrorDetails(redirectError);
          pushAuthDebug({
            step: "fallback-redirect-init-error",
            code: redirectErrorDetails.code,
            message: redirectErrorDetails.message,
          });
          console.error("Google Redirect Fallback fehlgeschlagen", redirectError);
        }
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
