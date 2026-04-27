import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionIcon from "@mui/icons-material/Description";
import { useLocation, useHistory } from "react-router-dom";
import { PageWrapper } from "../../pages/PageWrapper";
import { useAppContext } from "../../context/app-context";

const navItems = [
  { label: "Home", value: "/", icon: <HomeIcon /> },
  { label: "Page1", value: "/page1", icon: <DescriptionIcon /> },
  { label: "Settings", value: "/settings", icon: <SettingsIcon /> },
];

export default function BottomNav() {
  const location = useLocation();
  const history = useHistory();
  const { labels } = useAppContext();
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
          sx={{ background: "var(--background)", boxShadow: "none" }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.value}
              label={labels[item.label.toLowerCase()]}
              icon={item.icon}
              sx={{ color: "var(--foreground)", boxShadow: "none" }}
              aria-label={labels.ariaTo.replace("{}", item.label)}
            />
          ))}
        </BottomNavigation>
      </PageWrapper>
    </Paper>
  );
}
