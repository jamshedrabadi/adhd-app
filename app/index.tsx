import { useRouter } from "expo-router";
import { Button, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeProvider";

export const Index = () => {
	const router = useRouter();

	const {
		colors,
		mode,
		toggleTheme,
	} = useTheme();

	return (
		<View
			style={{
				flex: 1,
				padding: 24,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: colors.background,
			}}
		>
			<View
				style={{
					width: "100%",
					alignItems: "flex-end",
					marginBottom: 24,
				}}
			>
				<Pressable
					onPress={toggleTheme}
					hitSlop={8}
					style={{
						width: 44,
						height: 44,
						borderRadius: 22,
						backgroundColor:
							colors.surfaceAlt,
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
			</View>

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
				title="Attention Interrupter"
				onPress={() => router.push("/(features)/attention-interrupter")}
			/>
		</View>
	);
};

export default Index;
