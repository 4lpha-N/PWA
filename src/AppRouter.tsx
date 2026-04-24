import { BrowserRouter, Switch, Route } from "react-router-dom";
import { PageTransition } from "@steveeeie/react-page-transition";
import { Box } from "@mui/material";
import App from "./App";
import Home from "./pages/Home";
import Page1 from "./pages/Page1";
import Settings from "./pages/Settings";

export default function AppRouter() {
  /* PRESETS
    slide
    roomTo Top/Bottom/Right/Left
    cubeTo Top/Bottom/Right/Left
    carouselTo Top/Bottom/Right/Left
    moveTo From  Top/Bottom/Right/Left
    fadeFrom Top/Bottom/Right/Left
    scaleDownFrom Top/Bottom/Right/Left
    moveTo Unfold Top/Bottom/Right/Left
    fall
    */
  return (
    <BrowserRouter>
      <App>
        <Route
          render={({ location }) => (
            <PageTransition
              preset={"slide"}
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
