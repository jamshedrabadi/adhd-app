import { useState } from "react";
import { Modal, Text, View } from "react-native";

import { AppPressable } from "@/components/ui/AppPressable";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemePreference } from "@/theme/tokens";

const OPTIONS: { label: string; value: ThemePreference }[] = [
	{ label: "Light", value: "light" },
	{ label: "Dark", value: "dark" },
	{ label: "System Default", value: "system" },
];

export default function SettingsScreen() {
	const { colors, preference, setPreference } = useTheme();
	const [isPickerVisible, setIsPickerVisible] = useState(false);

	const selectPreference = async (nextPreference: ThemePreference): Promise<void> => {
		await setPreference(nextPreference);
		setIsPickerVisible(false);
	};

	return (
		<View style={{ backgroundColor: colors.background, flex: 1, padding: 24 }}>
			<Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "700", letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>Appearance</Text>
			<AppPressable onPress={() => setIsPickerVisible(true)} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, padding: 18 }}>
				<View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
					<View style={{ flex: 1 }}>
						<Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "700" }}>App theme</Text>
						<Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 5 }}>Choose how Cueda appears on this device.</Text>
					</View>
					<Text style={{ color: colors.accent, fontSize: 15, fontWeight: "700", marginLeft: 12 }}>{OPTIONS.find((option) => option.value === preference)?.label}</Text>
				</View>
			</AppPressable>

			<Modal animationType="fade" onRequestClose={() => setIsPickerVisible(false)} transparent visible={isPickerVisible}>
				<View style={{ backgroundColor: colors.overlay, flex: 1, justifyContent: "flex-end", padding: 20 }}>
					<View style={{ backgroundColor: colors.surfaceRaised, borderRadius: 24, gap: 6, padding: 14 }}>
						<Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: "800", marginBottom: 8, marginHorizontal: 8, marginTop: 6 }}>App theme</Text>
						{OPTIONS.map((option) => {
							const selected = preference === option.value;
							return (
								<AppPressable key={option.value} onPress={() => void selectPreference(option.value)} style={{ backgroundColor: selected ? colors.accentMuted : "transparent", borderRadius: 14, padding: 15 }}>
									<Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: selected ? "800" : "600" }}>{option.label}</Text>
								</AppPressable>
							);
						})}
					</View>
				</View>
			</Modal>
		</View>
	);
}
