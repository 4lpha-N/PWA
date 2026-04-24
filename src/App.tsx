import React from "react";
import "./App.scss";
import { Box } from "@mui/material";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";

import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material/styles";

const isDarkTheme = document.documentElement.classList.contains("dark");

function App({ children }: { children?: React.ReactNode }) {
  const [isDark, setIsDark] = React.useState(isDarkTheme);

  React.useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const theme = React.useMemo(
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
