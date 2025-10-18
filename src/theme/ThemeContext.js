import { createContext, useContext } from "react";
import { defaultPalette } from "./palettes";

export const ThemePickerContext = createContext({
  paletteName: defaultPalette,
  setPalette: () => {},
  options: [],
  tokens: null,
});

export const useThemePicker = () => useContext(ThemePickerContext);
