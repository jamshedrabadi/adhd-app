import {
	createContext,
	useContext,
	useMemo,
	useState,
	ReactNode,
} from "react";

import {
	useColorScheme,
} from "react-native";

import {
	darkColors,
	lightColors,
	ThemeColors,
} from "./theme";

type ThemeMode =
	| "light"
	| "dark"
	| "system";

type ThemeContextValue = {
	mode: ThemeMode;
	colors: ThemeColors;
	setMode: (
		mode: ThemeMode,
	) => void;
};

const ThemeContext =
	createContext<ThemeContextValue | null>(
		null,
	);

type Props = {
	children: ReactNode;
};

export const ThemeProvider = ({
	children,
}: Props) => {
	const systemTheme = useColorScheme();

	const [mode, setMode] =
		useState<ThemeMode>("system");

	const resolvedMode =
		mode === "system"
			? systemTheme === "dark"
				? "dark"
				: "light"
			: mode;

	const colors = useMemo(
		() =>
			resolvedMode === "dark"
				? darkColors
				: lightColors,
		[resolvedMode],
	);

	const value = useMemo(
		() => ({
			mode,
			colors,
			setMode,
		}),
		[mode, colors],
	);

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used inside ThemeProvider");
	}

	return context;
};
