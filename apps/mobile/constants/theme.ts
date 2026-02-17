export const colors = {
  bg: "#0c0f14",
  surface: "#151921",
  surfaceElevated: "#1c2230",
  border: "#252d3b",
  borderSubtle: "#1e2636",
  textPrimary: "#f0f2f5",
  textSecondary: "#8b95a8",
  textTertiary: "#5c6578",
  accent: "#2dd4a8",
  accentDim: "#1a9e7a",
  success: "#34d399",
  error: "#f87171",
  errorBg: "rgba(248, 113, 113, 0.08)",
  white: "#ffffff",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const typography = {
  heading: {
    fontSize: 26,
    fontWeight: "800" as const,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
  },
  label: {
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 0.8,
  },
} as const;
