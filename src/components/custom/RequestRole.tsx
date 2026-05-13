import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Alert,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { submitRoleRequest } from "@/lib/roleRequest";

const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function RequestRole() {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleConfirm = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      await submitRoleRequest(currentUser.uid, "user");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setSuccess(false);
    setError(null);
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" size="small" onClick={handleOpen}>
        Rechte beantragen
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={SlideUp}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ background: "var(--background)", color: "var(--foreground)" }}
        >
          Rechte beantragen
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 1,
            background: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          {success ? (
            <Alert
              severity="success"
              sx={{
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            >
              Dein Antrag wurde eingereicht. Du wirst benachrichtigt sobald er
              bearbeitet wurde.
            </Alert>
          ) : (
            <>
              <DialogContentText sx={{ color: "var(--foreground)" }}>
                Lese- und Schreibrechte (Rolle: <strong>Nutzer</strong>).
                <br />
                Ein Administrator wird deinen Antrag manuell prüfen.
              </DialogContentText>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    background: "var(--background)",
                    color: "var(--foreground)",
                  }}
                >
                  {error}
                </Alert>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ background: "var(--background)", gap: 2 }}>
          <Button onClick={handleClose} disabled={loading} color="secondary">
            {success ? "Schließen" : "Abbrechen"}
          </Button>
          {!success && (
            <Button
              onClick={handleConfirm}
              variant="contained"
              color="secondary"
              disabled={loading}
            >
              {loading ? "Wird eingereicht…" : "Bestätigen"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
