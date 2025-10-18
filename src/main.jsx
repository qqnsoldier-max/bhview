import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import App from "./App.jsx";
import { GlobalStyle, theme } from "./theme";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ThemeProvider wires design tokens through the app tree. */}
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </StrictMode>
);
