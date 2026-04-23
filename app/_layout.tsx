import { Stack } from "expo-router";

export const RootLayout = () => {
	return (
		<Stack>
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
