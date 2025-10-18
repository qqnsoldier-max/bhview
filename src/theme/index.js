import { createGlobalStyle } from "styled-components";
import {
  colors,
  gradients,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
  elevations,
  zIndices,
  opacity,
  layout,
} from "../components/ui/tokens";

// Public theme contract consumed by styled-components' ThemeProvider.
export const theme = {
  colors,
  gradients,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
  elevations,
  zIndices,
  opacity,
  layout,
};

// GlobalStyle locks in the dark gradient baseline and resets key elements.
export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: dark;
  }

  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background: radial-gradient(circle at 20% 18%, rgba(63, 140, 255, 0.25), transparent 55%),
      radial-gradient(circle at 80% -10%, rgba(0, 209, 178, 0.18), transparent 50%),
      ${({ theme }) => theme.colors.background};
    font-family: ${typography.fontFamily};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: ${typography.lineHeights.normal};
    overflow-x: hidden;
    background-attachment: fixed;
  }

  #root {
    min-height: 100vh;
    isolation: isolate;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-family: ${typography.headingsFamily};
    font-weight: ${typography.weightSemiBold};
    letter-spacing: -0.01em;
  }

  p {
    margin: 0;
  }

  a {
    color: inherit;
  }

  ::selection {
    background: rgba(63, 140, 255, 0.35);
    color: ${colors.background};
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 3px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.04);
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.gradients.primary};
    border-radius: ${radii.md};
  }
`;
