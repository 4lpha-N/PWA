import { createRoot } from "react-dom/client";
import AppRouter from "./AppRouter";
import "./index.css";
import "./index.scss";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "./context/AppContext";

// Suppress known prop warnings from @steveeeie/react-page-transition
const _filter = (msg: string) =>
  msg.includes("enterAnimation") ||
  msg.includes("exitAnimation") ||
  msg.includes("unknown prop") ||
  msg.includes("findDOMNode");
const originalError = console.error;
console.error = (...args) => {
  const msg = typeof args[0] === "string" ? args[0] : "";
  if (_filter(msg) || (typeof args[1] === "string" && _filter(args[1]))) return;
  originalError(...args);
};
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = typeof args[0] === "string" ? args[0] : "";
  if (_filter(msg)) return;
  originalWarn(...args);
};

createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <AppProvider>
      <AppRouter />
    </AppProvider>
  </ThemeProvider>,
);
