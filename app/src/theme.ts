export const colors = {
  background: "#0B0B0D",
  backgroundElevated: "#141416",
  surface: "#18181B",
  surfaceElevated: "#1F1F23",
  border: "#2A2A2E",
  borderSubtle: "#232326",
  gold: "#C9A24B",
  goldLight: "#E6C878",
  goldDim: "#8A7238",
  textPrimary: "#F5F1E8",
  textSecondary: "#B8B2A6",
  textMuted: "#7A7568",
  danger: "#E0665A",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const fonts = {
  display: "PlayfairDisplay_700Bold",
  displaySemi: "PlayfairDisplay_600SemiBold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",
  bodyBold: "Inter_700Bold",
};

export const shadows = {
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  gold: {
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  goldSubtle: {
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
};

export const typography = {
  logo: {
    fontFamily: fonts.display,
    fontSize: 44,
    color: colors.textPrimary,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
  },
  heading: {
    fontFamily: fonts.displaySemi,
    fontSize: 20,
    color: colors.textPrimary,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
    color: colors.textMuted,
  },
};
