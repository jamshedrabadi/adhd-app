import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
	ThemeProvider,
	useTheme,
} from "../theme/ThemeProvider";

const RootLayoutContent = () => {
	const { colors, mode } = useTheme();

	return (
		<>
			<StatusBar
				style={
					mode === "dark"
						? "light"
						: "dark"
				}
			/>

			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: colors.background,
					},
					headerTintColor: colors.textPrimary,
					headerTitleStyle: {
						color: colors.textPrimary,
					},
					contentStyle: {
						backgroundColor: colors.background,
					},
				}}
			>
				<Stack.Screen
					name="index"
					options={{ title: "Home" }}
				/>

				<Stack.Screen
					name="(features)/attention-interrupter/index"
					options={{ title: "Attention Interrupter" }}
				/>
			</Stack>
		</>
	);
};

export const RootLayout = () => {
	return (
		<ThemeProvider>
			<RootLayoutContent />
		</ThemeProvider>
	);
};

export default RootLayout;
