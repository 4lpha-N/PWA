import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";
import type { User } from "firebase/auth";
import {
  onAuthStateChange,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  getGoogleRedirectResult,
  signOutUser,
} from "@/lib/auth";

const isStandaloneMode = () => {
  const mediaStandalone =
    window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  const iosStandalone =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return mediaStandalone || iosStandalone;
};

const isPopupBlockedError = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String(error.code) : "";
  return [
    "auth/popup-blocked",
    "auth/popup-closed-by-user",
    "auth/cancelled-popup-request",
    "auth/operation-not-supported-in-this-environment",
    "auth/unauthorized-domain",
  ].includes(code);
};

interface AuthContextType {
  currentUser: User | null;
  role: string | null;
  isUser: boolean;
  isLoggedIn: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  currentUser: null,
  role: null,
  isUser: false,
  isLoggedIn: false,
  loginWithGoogle: async () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

const allowedRoles = ["admin", "user"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
      if (!user) {
        setRole(null);
        return;
      }
      user
        .getIdTokenResult(true)
        .then((result) => {
          setRole((result.claims.role as string) ?? null);
        })
        .catch(() => setRole(null));
    });
    return unsubscribe;
  }, []);

  // Redirect-Result nach Weiterleitung verarbeiten
  useEffect(() => {
    getGoogleRedirectResult().catch((err) => {
      console.error("Auth Redirect Result fehlgeschlagen", err);
    });
  }, []);

  const checkedUidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      checkedUidRef.current = null;
      return;
    }
    // Nur einmal pro UID prüfen
    if (checkedUidRef.current === currentUser.uid) return;
    checkedUidRef.current = currentUser.uid;

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
              console.error(
                "Firestore: User-Dokument konnte nicht angelegt werden",
                err,
              );
            });
        } else {
          console.log(
            "Firestore: User-Dokument existiert bereits",
            currentUser.uid,
          );
        }
      })
      .catch((err) => {
        console.error("Firestore: Fehler beim Lesen des User-Dokuments", err);
      });
  }, [currentUser]);

  const loginWithGoogle = useCallback(async () => {
    const allowRedirect = !isStandaloneMode();
    try {
      await signInWithGooglePopup();
    } catch (error) {
      if (isPopupBlockedError(error) && allowRedirect) {
        try {
          await signInWithGoogleRedirect();
        } catch (redirectError) {
          console.error("Auth Redirect Fallback fehlgeschlagen", redirectError);
        }
        return;
      }
      console.error("Auth Popup Login fehlgeschlagen", error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Auth Logout fehlgeschlagen", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      role,
      isUser: role != null && allowedRoles.includes(role),
      isLoggedIn: Boolean(currentUser),
      loginWithGoogle,
      logout,
    }),
    [currentUser, role, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
