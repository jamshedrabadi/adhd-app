import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
	ThemeProvider,
	useTheme,
} from "../theme/ThemeProvider";

const RootLayoutContent = () => {
	const {
		colors,
		mode,
		toggleTheme,
	} = useTheme();

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

					headerRight: () => (
						<Pressable
							onPress={toggleTheme}
							hitSlop={8}
							style={{
								width: 36,
								height: 36,
								borderRadius: 18,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Ionicons
								name={
									mode === "dark"
										? "sunny-outline"
										: "moon-outline"
								}
								size={22}
								color={colors.textPrimary}
							/>
						</Pressable>
					),
				}}
			>
				<Stack.Screen
					name="index"
					options={{ headerTitle: "" }}
				/>

				<Stack.Screen
					name="(features)/attention-interrupter/index"
					options={{ title: "Attention Interrupter" }}
				/>

				<Stack.Screen
					name="(features)/attention-interrupter/schedule-editor"
					options={{ title: "Schedule" }}
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
