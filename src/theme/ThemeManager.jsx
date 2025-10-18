import { useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./index";
import { createTokenTheme } from "../components/ui/tokens";
import { defaultPalette, paletteOrder, palettes } from "./palettes";
import { ThemePickerContext } from "./ThemeContext";

const formatPaletteLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();

export const ThemeManager = ({ initialPalette = defaultPalette, children }) => {
  const [paletteName, setPaletteName] = useState(
    palettes[initialPalette] ? initialPalette : defaultPalette
  );

  const themeTokens = useMemo(() => createTokenTheme(paletteName), [paletteName]);

  const options = useMemo(
    () =>
      paletteOrder
        .filter((key) => palettes[key])
        .map((key) => ({ value: key, label: formatPaletteLabel(key) })),
    []
  );

  const contextValue = useMemo(
    () => ({
      paletteName,
      setPalette: (next) => {
        if (next && palettes[next]) {
          setPaletteName(next);
        }
      },
      options,
      tokens: themeTokens,
    }),
    [paletteName, options, themeTokens]
  );

  return (
    <ThemePickerContext.Provider value={contextValue}>
      <ThemeProvider theme={themeTokens}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </ThemePickerContext.Provider>
  );
};
