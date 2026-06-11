import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
	ThemeProvider,
	useTheme,
} from "../theme/ThemeProvider";

const RootLayoutContent = () => {
	const {
		colors,
		mode,
	} = useTheme();

	const router = useRouter();

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
					options={{
						headerTitle: "",

						headerRight: () => (
							<Pressable
								onPress={() =>
									router.push(
										"/settings",
									)
								}
								style={({ pressed }) => ({
									width: 38,
									height: 38,
									borderRadius: 19,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: pressed
										? colors.surfaceAlt
										: "transparent",
								})}
							>
								<Ionicons
									name="settings-outline"
									size={22}
									color={
										colors.textPrimary
									}
								/>
							</Pressable>
						),
					}}
				/>

				<Stack.Screen
					name="settings"
					options={{ title: "Settings" }}
				/>

				<Stack.Screen
					name="(features)/attention-interrupter/index"
					options={{ title: "Attention Interrupter" }}
				/>

				<Stack.Screen
					name="(features)/attention-interrupter/schedule-editor"
					options={({ route }: any) => ({
						title: route.params?.scheduleId
							? "Edit Schedule"
							: "Add Schedule",
					})}
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
