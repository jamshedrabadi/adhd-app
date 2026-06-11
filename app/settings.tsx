import {
	View,
	Text,
	Pressable,
	Modal,
} from "react-native";

import { useState } from "react";

import { useTheme } from "../theme/ThemeProvider";

const OPTIONS = [
	"light",
	"dark",
	"system",
] as const;

export const SettingsScreen = () => {
	const {
		colors,
		mode,
		setMode,
	} = useTheme();

	const [showThemeModal, setShowThemeModal] =
		useState(false);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: colors.background,
				padding: 24,
			}}
		>
			<Text
				style={{
					color: colors.textSecondary,
					fontSize: 13,
					fontWeight: "700",
					letterSpacing: 1,
					textTransform: "uppercase",
					marginBottom: 16,
				}}
			>
				Appearance
			</Text>

			<Pressable
				onPress={() =>
					setShowThemeModal(true)
				}
				style={({ pressed }) => ({
					backgroundColor: pressed
						? colors.surfaceAlt
						: colors.surface,
					borderRadius: 18,
					borderWidth: 1,
					borderColor: colors.border,
					paddingHorizontal: 18,
					paddingVertical: 18,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				})}
			>
				<Text
					style={{
						color: colors.textPrimary,
						fontSize: 16,
						fontWeight: "600",
					}}
				>
					App Theme
				</Text>

				<Text
					style={{
						color: colors.textSecondary,
						fontSize: 15,
						textTransform: "capitalize",
					}}
				>
					{mode === "system"
						? "System Default"
						: mode}
				</Text>
			</Pressable>

			<Modal
				visible={showThemeModal}
				transparent
				animationType="fade"
			>
				<View
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.35)",
						justifyContent: "center",
						padding: 32,
					}}
				>
					<View
						style={{
							backgroundColor: colors.surface,
							borderRadius: 22,
							padding: 12,
						}}
					>
						{OPTIONS.map(
							(option) => (
								<Pressable
									key={option}
									onPress={() => {
										setMode(
											option,
										);

										setShowThemeModal(
											false,
										);
									}}
									style={({
										pressed,
									}) => ({
										paddingVertical: 16,
										paddingHorizontal: 16,
										borderRadius: 14,
										backgroundColor: pressed
											? colors.surfaceAlt
											: "transparent",
									})}
								>
									<Text
										style={{
											color: colors.textPrimary,
											fontSize: 16,
											fontWeight:
												mode === option
													? "700"
													: "500",
											textTransform: "capitalize",
										}}
									>
										{option === "system"
											? "System Default"
											: option}
									</Text>
								</Pressable>
							),
						)}
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default SettingsScreen;
