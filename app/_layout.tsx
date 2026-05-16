import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "../theme/theme";

export const RootLayout = () => {
	return (
		<>
			<StatusBar style="light" />

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

export default RootLayout;
