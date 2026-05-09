import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { add, getAll, removeOne } from "@/lib/firestore";

const FirestoreTest = () => {
  const [status, setStatus] = useState<string>(
    "Noch kein Firestore-Test ausgeführt.",
  );
  const [loading, setLoading] = useState<"write" | "read" | "delete" | null>(
    null,
  );

  const handleWriteTest = async () => {
    try {
      setLoading("write");
      await add("healthcheck", {
        source: "Page1",
        message: "Firestore write test ok",
        createdAt: new Date().toISOString(),
      });
      setStatus("Write erfolgreich: Testdokument in 'healthcheck' erstellt.");
    } catch (error) {
      setStatus(
        `Write fehlgeschlagen: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
      );
    } finally {
      setLoading(null);
    }
  };

  const handleReadTest = async () => {
    try {
      setLoading("read");
      const docs = await getAll("healthcheck");
      console.log("Gelesene Dokumente aus 'healthcheck':", docs);
      setStatus(
        `Read erfolgreich: ${docs.length} Dokument(e) in 'healthcheck' gefunden.`,
      );
    } catch (error) {
      setStatus(
        `Read fehlgeschlagen: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
      );
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteHealthchecks = async () => {
    try {
      setLoading("delete");
      const docs = await getAll("healthcheck");

      if (docs.length === 0) {
        setStatus("Delete erfolgreich: Keine healthcheck-Dokumente vorhanden.");
        return;
      }

      await Promise.all(
        docs.map((entry) => removeOne("healthcheck", entry.id)),
      );
      setStatus(
        `Delete erfolgreich: ${docs.length} Dokument(e) aus 'healthcheck' gelöscht.`,
      );
    } catch (error) {
      setStatus(
        `Delete fehlgeschlagen: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mt: 3 }}
      >
        <Button
          variant="contained"
          onClick={handleWriteTest}
          disabled={loading !== null}
        >
          {loading === "write" ? "Schreibe..." : "Firestore Write"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleReadTest}
          disabled={loading !== null}
        >
          {loading === "read" ? "Lese..." : "Firestore Read"}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteHealthchecks}
          disabled={loading !== null}
        >
          {loading === "delete" ? "Lösche..." : "Healthchecks löschen"}
        </Button>
      </Stack>
      <Typography variant="body2" sx={{ mt: 1.5, opacity: 0.25 }}>
        {status}
      </Typography>
    </>
  );
};

export default FirestoreTest;
