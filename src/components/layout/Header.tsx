import { PageWrapper } from "../../pages/_PageWrapper";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

export default function Header() {
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
          <Box>
            <AnimatedThemeToggler duration={1250} />
          </Box>
        </Toolbar>
      </PageWrapper>
    </AppBar>
  );
}
