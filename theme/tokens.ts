export const lightColors = {
	background: "#F4F7F8",
	surface: "#FFFFFF",
	surfaceRaised: "#FFFFFF",
	surfacePressed: "#E9F0F2",
	border: "#D4DFE2",
	textPrimary: "#172125",
	textSecondary: "#5B6B70",
	accent: "#087E8B",
	accentPressed: "#056A75",
	accentMuted: "#D9F0F1",
	danger: "#B5473B",
	dangerMuted: "#F9E2DF",
	overlay: "rgba(10, 23, 27, 0.36)",
} as const;

export const darkColors = {
	background: "#101719",
	surface: "#182225",
	surfaceRaised: "#202C30",
	surfacePressed: "#29383C",
	border: "#34464B",
	textPrimary: "#EDF5F5",
	textSecondary: "#AFBEC1",
	accent: "#76D4D6",
	accentPressed: "#9BE3E4",
	accentMuted: "#1C4D51",
	danger: "#F19A8F",
	dangerMuted: "#4A2927",
	overlay: "rgba(0, 0, 0, 0.52)",
} as const;

export type ThemeColors = typeof lightColors | typeof darkColors;
export type ResolvedThemeMode = "light" | "dark";
export type ThemePreference = ResolvedThemeMode | "system";
