// Base palette tuned for high-contrast finance dashboards.
const baseColors = {
  background: "#050B1A",
  backgroundSoft: "#0A1226",
  surface: "#11172A",
  surfaceElevated: "#1C243A",
  surfaceInverted: "#FFFFFF",
  primary: "#3F8CFF",
  primaryHover: "#5FA2FF",
  primaryMuted: "#1E3B69",
  accent: "#00D1B2",
  accentHover: "#33E5C8",
  success: "#3BCF7C",
  warning: "#FFB347",
  danger: "#FF5A5F",
  neutral50: "#F1F5F9",
  neutral100: "#E2E8F0",
  neutral200: "#CBD5F5",
  neutral300: "#A8B2CF",
  neutral400: "#94A3B8",
  neutral500: "#7B8AB0",
  neutral600: "#64748B",
  neutral700: "#4B5565",
  neutral800: "#334155",
  neutral900: "#1E293B",
};

// Extended map adds semantic groupings while preserving direct color keys.
export const colors = {
  ...baseColors,
  text: {
    primary: baseColors.neutral50,
    secondary: baseColors.neutral300,
    tertiary: baseColors.neutral500,
    muted: baseColors.neutral600,
    inverted: baseColors.background,
    onAccent: baseColors.neutral50,
  },
  backgrounds: {
    app: baseColors.background,
    soft: baseColors.backgroundSoft,
    surface: baseColors.surface,
    elevated: baseColors.surfaceElevated,
    overlay: "rgba(5, 11, 26, 0.72)",
  },
  border: {
    subtle: "rgba(255, 255, 255, 0.08)",
    default: "rgba(255, 255, 255, 0.12)",
    accent: "rgba(63, 140, 255, 0.4)",
    danger: "rgba(255, 90, 95, 0.4)",
  },
  status: {
    success: baseColors.success,
    warning: baseColors.warning,
    danger: baseColors.danger,
    info: baseColors.primary,
  },
  focus: "rgba(63, 140, 255, 0.22)",
};

// Gradient tokens drive hero surfaces and accent fills.
export const gradients = {
  primary: `linear-gradient(135deg, ${baseColors.primary}, ${baseColors.primaryHover})`,
  primarySoft: `linear-gradient(160deg, rgba(63, 140, 255, 0.18), rgba(95, 162, 255, 0.12))`,
  accent: `linear-gradient(140deg, ${baseColors.accent}, ${baseColors.accentHover})`,
  danger: `linear-gradient(135deg, ${baseColors.danger}, #ff767b)`,
  glass: "linear-gradient(160deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04))",
};

// Rounded corners ensure consistency across surfaces and controls.
export const radii = {
  xs: "6px",
  sm: "8px",
  md: "12px",
  lg: "18px",
  xl: "26px",
  pill: "999px",
};

// Spacing scale keeps vertical rhythm predictable across layouts.
export const spacing = {
  xxxs: "2px",
  xxs: "4px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "40px",
  xxxl: "56px",
};

// Font family and weights anchor typographic hierarchy.
export const typography = {
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  headingsFamily: "'Inter', 'Segoe UI', sans-serif",
  weightRegular: 400,
  weightMedium: 500,
  weightSemiBold: 600,
  weightBold: 700,
  sizes: {
    xs: "0.75rem",
    sm: "0.85rem",
    base: "0.95rem",
    md: "1.05rem",
    lg: "1.35rem",
    xl: "1.65rem",
    xxl: "2.1rem",
  },
  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.45,
    relaxed: 1.65,
  },
};

// Shadow styles provide depth cues for layered surfaces.
export const shadows = {
  soft: "0 12px 32px rgba(5, 11, 26, 0.45)",
  medium: "0 18px 48px rgba(5, 11, 26, 0.50)",
  hard: "0 24px 64px rgba(5, 11, 26, 0.55)",
};

// Elevations ensure consistent stacking order and blur intensity.
export const elevations = {
  raised: "0 1px 0 rgba(255, 255, 255, 0.06), 0 8px 24px rgba(5, 11, 26, 0.32)",
  overlay: "0 20px 55px rgba(5, 11, 26, 0.6)",
  modal: "0 32px 80px rgba(5, 11, 26, 0.65)",
};

// Z-index scale standardises layering of layout regions.
export const zIndices = {
  base: 1,
  sidebar: 10,
  dropdown: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
};

// Opacity values reused across glassmorphism overlays and borders.
export const opacity = {
  subtle: 0.04,
  medium: 0.12,
  strong: 0.32,
  intense: 0.56,
};

// Layout constants guide sizing for shared scaffolding.
export const layout = {
  contentMaxWidth: "1440px",
  sidebarWidth: "260px",
  topbarHeight: "72px",
};

// Default transition smoothing micro-interactions.
export const transitions = {
  base: "all 180ms ease",
  fast: "all 120ms ease",
  slow: "all 260ms ease",
};
