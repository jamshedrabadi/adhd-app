import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

import { readJson, writeJson } from "@/lib/storage/jsonStore";
import { STORAGE_KEYS } from "@/lib/storage/keys";

import { darkColors, lightColors, ResolvedThemeMode, ThemeColors, ThemePreference } from "./tokens";

type ThemeContextValue = {
	colors: ThemeColors;
	preference: ThemePreference;
	resolvedMode: ResolvedThemeMode;
	isReady: boolean;
	setPreference: (preference: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const systemColorScheme = useColorScheme();
	const [preference, setPreferenceState] = useState<ThemePreference>("light");
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const loadPreference = async (): Promise<void> => {
			const storedPreference = await readJson<ThemePreference>(STORAGE_KEYS.THEME_PREFERENCE);

			if (storedPreference === "light" || storedPreference === "dark" || storedPreference === "system") {
				setPreferenceState(storedPreference);
			}

			setIsReady(true);
		};

		void loadPreference();
	}, []);

	const resolvedMode: ResolvedThemeMode = preference === "system"
		? systemColorScheme === "dark"
			? "dark"
			: "light"
		: preference;

	const colors = resolvedMode === "dark" ? darkColors : lightColors;

	const setPreference = async (nextPreference: ThemePreference): Promise<void> => {
		setPreferenceState(nextPreference);
		await writeJson(STORAGE_KEYS.THEME_PREFERENCE, nextPreference);
	};

	const value = useMemo(() => ({
		colors,
		preference,
		resolvedMode,
		isReady,
		setPreference,
	}), [colors, isReady, preference, resolvedMode]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used inside ThemeProvider.");
	}

	return context;
};
