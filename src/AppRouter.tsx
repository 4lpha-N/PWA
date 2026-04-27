import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PageTransition } from "@steveeeie/react-page-transition";
import { Box } from "@mui/material";
import App from "./App";
import Home from "./pages/Home";
import Page1 from "./pages/Page1";
import Settings from "./pages/Settings";
import { useAppContext } from "./context/app-context";

export default function AppRouter() {
  const { themeAnimationPreset } = useAppContext();

  return (
    <BrowserRouter basename="/PWA">
      <App>
        <Route
          render={({ location }) => (
            <PageTransition
              preset={themeAnimationPreset}
              transitionKey={location.pathname}
              enterAnimation={""}
              exitAnimation={""}
            >
              <Box sx={{ height: "100%" }}>
                <Switch location={location}>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/page1" component={Page1} />
                  <Route exact path="/settings" component={Settings} />
                </Switch>
              </Box>
            </PageTransition>
          )}
        />
      </App>
    </BrowserRouter>
  );
}
