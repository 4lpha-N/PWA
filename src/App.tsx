import { useMemo, type ReactNode } from "react";
import "./App.scss";
import { Box } from "@mui/material";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import { useAppContext } from "./context/app-context";

import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material/styles";

function App({ children }: { children?: ReactNode }) {
  const { theme: currentTheme } = useAppContext();
  const isDark = currentTheme === "dark";
  console.warn("Current theme:", currentTheme, isDark);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: { main: "#dc143c" },
          secondary: { main: isDark ? "#ece9e6" : "#2c271f" },
        },
      }),
    [isDark],
  );

  return (
    <MUIThemeProvider theme={theme}>
      <Box
        className="app"
        sx={{
          height: "100dvh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <Box
          className="app-wrapper"
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
          }}
        >
          {children}
        </Box>
        <BottomNav />
      </Box>
    </MUIThemeProvider>
  );
}

export default App;
