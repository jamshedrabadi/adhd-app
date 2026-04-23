import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

import { colors } from "../theme/theme";

export const Index = () => {
	const router = useRouter();

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: colors.background,
			}}
		>
			<Text
				style={{
					fontSize: 24,
					marginBottom: 24,
					color: colors.textPrimary,
				}}
			>
				Hello!
			</Text>

			<Button
				title="Time Awareness"
				onPress={() => router.push("/(features)/time-awareness")}
			/>
		</View>
	);
};

export default Index;
