import { PageWrapper } from "./_PageWrapper";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/app-context";
import { getAuthDebugLog } from "@/hooks/useAuth";
// import FirestoreTest from "@/components/dev/firestoreTest";

export default function Home() {
  const { labels } = useAppContext();
  const [authDebugEntries, setAuthDebugEntries] = useState(getAuthDebugLog());

  useEffect(() => {
    const refresh = () => {
      setAuthDebugEntries(getAuthDebugLog());
    };

    const intervalId = window.setInterval(refresh, 1000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return (
    <PageWrapper>
      {/* <div style={{ background: "var(--primary)", height: "100%" }}> */}
      <div>{labels.home}</div>
      <div style={{ marginTop: 16 }}>
        <p style={{ fontWeight: 600, margin: 0 }}>Login Debug</p>
        {authDebugEntries.length === 0 && (
          <p style={{ margin: "6px 0 0" }}>
            Noch keine Login-Events vorhanden.
          </p>
        )}
        {authDebugEntries.map((entry, index) => (
          <p key={`${entry.timestamp}-${index}`} style={{ margin: "6px 0 0" }}>
            {entry.timestamp} | {entry.step}
            {entry.code ? ` | ${entry.code}` : ""}
            {entry.message ? ` | ${entry.message}` : ""}
          </p>
        ))}
      </div>
      {/* <FirestoreTest /> */}
      {/* </div> */}
    </PageWrapper>
  );
}
