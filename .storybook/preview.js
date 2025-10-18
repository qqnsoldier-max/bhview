import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "../src/theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "App Background",
    values: [
      { name: "App Background", value: theme.colors.backgrounds.app },
      { name: "Surface", value: theme.colors.backgrounds.surface },
      { name: "High Contrast", value: "#050B1A" },
    ],
  },
};

// Wrap stories with the production theme to ensure visual parity.
// eslint-disable-next-line no-unused-vars -- Story is rendered within the JSX body.
const withTheme = (Story) => (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Story />
    </ThemeProvider>
);

export const decorators = [withTheme];

const preview = {
  parameters,
  decorators,
};

export default preview;
