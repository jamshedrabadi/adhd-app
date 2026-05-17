import {
	createContext,
	useContext,
	useMemo,
	useState,
	ReactNode,
} from "react";

import {
	darkColors,
	lightColors,
	ThemeColors,
} from "./theme";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
	mode: ThemeMode;
	colors: ThemeColors;
	toggleTheme: () => void;
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
	const [mode, setMode] =
		useState<ThemeMode>("dark");

	const toggleTheme = () => {
		setMode((prev) =>
			prev === "dark"
				? "light"
				: "dark",
		);
	};

	const colors = useMemo(
		() =>
			mode === "dark"
				? darkColors
				: lightColors,
		[mode],
	);

	const value = useMemo(
		() => ({
			mode,
			colors,
			toggleTheme,
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
