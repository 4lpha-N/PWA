import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionIcon from "@mui/icons-material/Description";
import { useLocation, useHistory } from "react-router-dom";
import { PageWrapper } from "../../pages/PageWrapper";

const navItems = [
  { label: "Home", value: "/", icon: <HomeIcon /> },
  { label: "Page 1", value: "/page1", icon: <DescriptionIcon /> },
  { label: "Settings", value: "/settings", icon: <SettingsIcon /> },
];

export default function BottomNav() {
  const location = useLocation();
  const history = useHistory();
  const current = navItems.findIndex(
    (item) => item.value === location.pathname,
  );

  return (
    <Paper
      sx={{
        background: "var(--background)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      elevation={0}
    >
      <PageWrapper padded={false}>
        <BottomNavigation
          showLabels
          value={current === -1 ? 0 : current}
          onChange={(_, newValue) => history.push(navItems[newValue].value)}
          sx={{ background: "var(--background)", boxShadow: "none", paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              icon={item.icon}
              sx={{ color: "var(--foreground)", boxShadow: "none" }}
            />
          ))}
        </BottomNavigation>
      </PageWrapper>
    </Paper>
  );
}
