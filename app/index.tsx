import {
	View,
	Text,
	Pressable,
} from "react-native";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeProvider";

export const Index = () => {
	const router = useRouter();

	const { colors } = useTheme();

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: colors.background,
				paddingHorizontal: 24,
				paddingTop: 40,
			}}
		>
			{/* HEADER */}
			<View
				style={{
					marginBottom: 28,
				}}
			>
				<Text
					style={{
						fontSize: 32,
						fontWeight: "800",
						color: colors.textPrimary,
						letterSpacing: -1,
					}}
				>
					Good evening
				</Text>

				<Text
					style={{
						marginTop: 8,
						fontSize: 16,
						lineHeight: 24,
						color: colors.textSecondary,
						maxWidth: "92%",
					}}
				>
					External structure for attention regulation and hyperfocus interruption.
				</Text>
			</View>

			{/* ATTENTION INTERRUPTER CARD */}
			<Pressable
				onPress={() =>
					router.push(
						"/(features)/attention-interrupter",
					)
				}
				style={({ pressed }) => ({
					backgroundColor: pressed
						? colors.surfaceAlt
						: colors.surface,
					borderRadius: 24,
					borderWidth: 1,
					borderColor: colors.border,
					padding: 22,
				})}
			>
				{/* ICON */}
				<View
					style={{
						width: 56,
						height: 56,
						borderRadius: 18,
						backgroundColor: colors.accentMuted,
						justifyContent: "center",
						alignItems: "center",
						marginBottom: 18,
					}}
				>
					<Ionicons
						name="pulse-outline"
						size={28}
						color={colors.accent}
					/>
				</View>

				{/* TITLE */}
				<Text
					style={{
						fontSize: 24,
						fontWeight: "800",
						color: colors.textPrimary,
						marginBottom: 10,
					}}
				>
					Attention Interrupter
				</Text>

				{/* DESCRIPTION */}
				<Text
					style={{
						fontSize: 15,
						lineHeight: 24,
						color: colors.textSecondary,
					}}
				>
					Scheduled nudges that break hyperfocus loops and restore time awareness throughout the day.
				</Text>
			</Pressable>
		</View>
	);
};

export default Index;
