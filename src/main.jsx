import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeManager } from "./theme/ThemeManager.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ThemeManager wires design tokens through the app tree and exposes runtime palette switching. */}
    <ThemeManager>
      <App />
    </ThemeManager>
  </StrictMode>
);
