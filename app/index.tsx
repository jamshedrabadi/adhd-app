import { useRouter } from "expo-router";
import { Text, View, Pressable } from "react-native";

import { useTheme } from "../theme/ThemeProvider";

export const Index = () => {
	const router = useRouter();

	const { colors } = useTheme();

	return (
		<View
			style={{
				flex: 1,
				padding: 24,
				backgroundColor: colors.background,
			}}
		>
			<Text
				style={{
					fontSize: 32,
					fontWeight: "700",
					color: colors.textPrimary,
					marginBottom: 8,
				}}
			>
				Hello
			</Text>

			<Text
				style={{
					fontSize: 16,
					color: colors.textSecondary,
					marginBottom: 32,
				}}
			>
				Choose a feature
			</Text>

			<Pressable
				onPress={() =>
					router.push(
						"/(features)/attention-interrupter",
					)
				}
				style={{
					backgroundColor: colors.surface,
					borderRadius: 16,
					borderWidth: 1,
					borderColor: colors.border,
					padding: 20,
				}}
			>
				<Text
					style={{
						color: colors.textPrimary,
						fontSize: 18,
						fontWeight: "600",
					}}
				>
					Attention Interrupter
				</Text>

				<Text
					style={{
						color: colors.textSecondary,
						marginTop: 6,
					}}
				>
					Periodic nudges to regain
					time awareness while
					focusing.
				</Text>
			</Pressable>
		</View>
	);
};

export default Index;
