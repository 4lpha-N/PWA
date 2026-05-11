import { PageWrapper } from "../../pages/_PageWrapper";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { useAuth } from "@/hooks/useAuth";
// import { useSnackbar } from "notistack";

export default function Header() {
  const { currentUser, isLoggedIn, loginWithGoogle, logout } = useAuth();
  // const { enqueueSnackbar } = useSnackbar();
  // const previousUserRef = useRef<typeof currentUser>(undefined);
  const avatarSize = 26;
  const avatarSrc = currentUser?.photoURL?.trim() || undefined;
  const avatarAlt =
    currentUser?.displayName ?? currentUser?.email ?? "User Avatar";

  // useEffect(() => {
  //   const previousUser = previousUserRef.current;

  //   if (previousUser === undefined) {
  //     previousUserRef.current = currentUser;
  //     return;
  //   }

  //   if (!previousUser && currentUser) {
  //     enqueueSnackbar(
  //       `Eingeloggt als ${currentUser.displayName ?? currentUser.email ?? "ohne E-Mail"}`,
  //       { variant: "default" },
  //     );
  //   }

  //   if (previousUser && !currentUser) {
  //     enqueueSnackbar("Ausgeloggt", { variant: "default" });
  //   }

  //   previousUserRef.current = currentUser;
  // }, [currentUser, enqueueSnackbar]);

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ background: "transparent", color: "var(--foreground)" }}
    >
      <PageWrapper padded={false}>
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography variant="h6" component="h6" sx={{ fontWeight: "bold" }}>
            4lpha
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant={isLoggedIn ? "text" : "text"}
              color={isLoggedIn ? "secondary" : "secondary"}
              size="small"
              onClick={isLoggedIn ? logout : loginWithGoogle}
              title={isLoggedIn ? "Logout" : "Google Login"}
              aria-label={isLoggedIn ? "Logout" : "Google Login"}
              startIcon={
                isLoggedIn && avatarSrc ? (
                  <Avatar
                    src={avatarSrc}
                    alt={avatarAlt}
                    sx={{ width: avatarSize, height: avatarSize }}
                    slotProps={{
                      img: {
                        referrerPolicy: "no-referrer",
                      },
                    }}
                  />
                ) : undefined
              }
            >
              {isLoggedIn ? <Logout /> : <Login />}
            </Button>
            <Box>
              <AnimatedThemeToggler duration={1250} />
            </Box>
          </Stack>
        </Toolbar>
      </PageWrapper>
    </AppBar>
  );
}
