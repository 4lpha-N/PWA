import { Button, Stack, Typography } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";

const LoginTest = () => {
  const { currentUser, loginWithGoogle, logout } = useAuth();

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mt: 2 }}
      >
        <Button variant="contained" onClick={loginWithGoogle}>
          Google Login
        </Button>
        {currentUser && (
          <Button variant="outlined" color="warning" onClick={logout}>
            Logout
          </Button>
        )}
      </Stack>
      {currentUser && (
        <Typography variant="body2" sx={{ mt: 1.5, fontWeight: 500 }}>
          Eingeloggt als: {currentUser.email ?? "ohne E-Mail"}
        </Typography>
      )}
    </>
  );
};

export default LoginTest;
