/**
 * Palette source of truth for non-CSS surfaces (Open Graph, JSON-LD).
 * Keep these values aligned with the CSS variables in app/globals.css.
 * Page components should use Tailwind tokens, not these hex strings.
 */
export const palette = {
  blue50: "#EEF4F9",
  blue100: "#DCE8F2",
  blue200: "#B9D1E5",
  blue300: "#8FB3D2",
  blue400: "#6A98BF",
  blue500: "#4378A0",
  blue600: "#365F80",
  blue700: "#2A4A64",
  blue800: "#1F3649",
  green50: "#EEF6F1",
  green100: "#D9EBE0",
  green200: "#B3D6C1",
  green300: "#86BC9C",
  green400: "#5A9A74",
  green500: "#38694C",
  green600: "#2D563D",
  green700: "#234330",
  green800: "#1A3324",
  ink950: "#121216",
  ink900: "#1C1B20",
  ink800: "#29282E",
  ink700: "#3A3940",
  ink600: "#4B4A52",
  ink400: "#8A8991",
  ink300: "#B4B3B9",
  white: "#FFFFFF",
  paper: "#F4F6F5",
  lineLight: "#E3E7EA",
  amber: "#F2B84B",
} as const;
