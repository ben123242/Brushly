export const colors = {
  background: "#FBF7F2",
  surface: "#FFFFFF",
  primary: "#D97B5F",
  primaryDark: "#B85F45",
  ink: "#2E2A26",
  inkMuted: "#7A736B",
  border: "#EDE3D8",
  accent: "#5C8D7D",
  danger: "#C0463E",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
};

export const typography = {
  title: { fontSize: 32, fontWeight: "700" as const, color: colors.ink },
  subtitle: { fontSize: 16, fontWeight: "400" as const, color: colors.inkMuted },
  heading: { fontSize: 20, fontWeight: "700" as const, color: colors.ink },
  body: { fontSize: 15, fontWeight: "400" as const, color: colors.ink },
  label: { fontSize: 13, fontWeight: "600" as const, color: colors.inkMuted },
};
