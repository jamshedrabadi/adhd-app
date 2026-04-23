import { Stack } from "expo-router";

import { colors } from "../theme/theme";

export const RootLayout = () => {
	return (
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
				name="(features)/time-awareness/index"
				options={{ title: "Time Awareness" }}
			/>
		</Stack>
	);
};

export default RootLayout;
