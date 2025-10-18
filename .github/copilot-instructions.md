# BHView - AI Coding Instructions

## Project Overview
BHView is a financial markets dashboard built with **React 19**, **Vite**, **React Router**, and **styled-components**. The architecture separates UI primitives from business logic, enabling rapid theming and component reuse across a trading/portfolio management interface.

## Architecture

### Theme System (Critical)
- **Central token system** at `src/components/ui/tokens.js` generates all design tokens (colors, spacing, typography, shadows, etc.)
- **Multiple palettes** in `src/theme/palettes.js` enable runtime theme switching via `ThemeManager`
- **Theme context flow**: `main.jsx` → `ThemeManager` → `ThemeProvider` (styled-components) → all components
- All UI components consume `theme` prop from styled-components: `${({ theme }) => theme.colors.text.primary}`
- When creating new colors, use `toRgba()` helper for translucency (preserves palette swapping)

### Component Structure
```
src/
  components/
    ui/           # Reusable primitives (Button, Card, Badge, TextField, etc.)
    Layout/       # Shell components (DashboardShell with persistent sidebar)
    navigation/   # Navigation-specific components
  pages/          # Route-level views (DashboardOverview, Markets, Orders, etc.)
  theme/          # Theme system (palettes, tokens, ThemeManager)
```

### Routing Pattern
- **Persistent shell** via nested routes in `App.jsx`
- `DashboardShell` wraps all main views (/, /portfolio, /markets, /orders, /settings)
- `/ui` route renders `UiGallery` outside the shell for component showcase
- Use `<NavLink>` with `end` prop for root route to prevent active state on subroutes

## Development Workflows

### Running the App
```bash
npm run dev      # Start Vite dev server (default: http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Component Development
1. **UI components** live in `src/components/ui/` with co-located `.stories.jsx` files
2. Export from `src/components/ui/index.js` for clean imports
3. Use `forwardRef` for components that may need refs (see `Button.jsx`)
4. Use **styled-components** with theme tokens exclusively—no inline styles or hardcoded colors

### UI Gallery
- Visit `/ui` route (`UiGallery.jsx`) to see all primitives in action
- Use this for visual regression testing and theme validation
- Each component has dedicated section showing variants/states

## Coding Conventions

### Styled Components Pattern
```jsx
// Component-level tokens and variants defined via functions
const buttonVariants = (theme) => ({
  primary: css`
    background: ${theme.gradients.primary};
    color: ${theme.colors.text.onAccent};
  `,
  // ... more variants
});

// Component receives theme via styled-components context
const StyledButton = styled.button`
  ${({ theme, variant }) => {
    const variants = buttonVariants(theme);
    return variants[variant] || variants.primary;
  }}
`;
```

### Component Comments
- **Document the "why"** and architectural role (e.g., "DashboardShell hosts persistent chrome")
- Explain complex token logic (e.g., "toRgba converts hex to rgba for translucent tokens")
- Mark public API boundaries (variant options, size scales)

### File Naming
- Components: PascalCase (e.g., `Button.jsx`, `DashboardShell.jsx`)
- Pages: PascalCase (e.g., `DashboardOverview.jsx`)
- Utilities/config: camelCase (e.g., `tokens.js`, `palettes.js`)

### Import Organization
1. React imports (useState, useEffect, etc.)
2. Third-party libraries (react-router-dom, styled-components)
3. Internal components (from `./components/ui`)
4. Theme/context imports
5. Utilities/constants

## Key Patterns

### Token-Based Styling
**Always** use theme tokens instead of raw values:
- Colors: `theme.colors.text.primary` not `#F1F5F9`
- Spacing: `theme.spacing.lg` not `24px`
- Radii: `theme.radii.md` not `12px`
- Typography: `theme.typography.sizes.lg` not `1.35rem`

### Variant System
Components use `variant` prop for style variations (e.g., `Button` has primary/secondary/outline/subtle/danger). Implement via object lookup pattern (see `Button.jsx` and `Badge.jsx`).

### Layout Components
- Pages use CSS Grid for responsive layouts
- Common pattern: `display: grid; gap: ${theme.spacing.xl}; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`
- Sidebar uses fixed width from `theme.layout.sidebarWidth`

### State Management
- Simple useState for UI state (toggles, form inputs)
- Theme/palette switching via `ThemePickerContext` (`useThemePicker` hook)
- No global state library—keep state local or use React Router loaders when needed

## Integration Points

### Adding New UI Components
1. Create component file in `src/components/ui/ComponentName.jsx`
2. Create stories file `ComponentName.stories.jsx` (see existing for template)
3. Export from `src/components/ui/index.js`
4. Add showcase section to `UiGallery.jsx`
5. Use theme tokens exclusively

### Adding New Palettes
1. Add palette object to `palettes.js` with all required color keys
2. Add palette name to `paletteOrder` array
3. Test via UI Gallery's theme picker

### Adding New Routes
1. Define route in `App.jsx` inside or outside `DashboardShell` as appropriate
2. Create page component in `src/pages/`
3. Add navigation link to `DashboardShell` sidebar if persistent

## ESLint Configuration
- Uses flat config format (`eslint.config.js`)
- React Hooks rules enforced
- Unused vars with capital letters ignored (for styled-components)
- React Refresh checks for HMR compatibility

## Tech Stack Notes
- **React 19**: Uses `createRoot` from react-dom/client
- **Vite**: SWC plugin for fast refresh
- **styled-components**: v6 with full theme support
- **React Router**: v7 with data APIs (not yet used, but available)
