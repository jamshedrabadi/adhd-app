import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export const Index = () => {
	const router = useRouter();

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text style={{ fontSize: 24, marginBottom: 20 }}>
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
