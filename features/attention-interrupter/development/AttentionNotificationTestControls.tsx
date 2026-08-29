import { useState } from "react";
import { Alert, Text, View } from "react-native";

import { AppPressable } from "@/components/ui/AppPressable";
import { useTheme } from "@/theme/ThemeProvider";

import { requestNotificationPermission } from "../services/attentionNotifications";

import { cancelAttentionNotificationTest, scheduleAttentionNotificationTest } from "./attentionNotificationTest";

export const AttentionNotificationTestControls = () => {
	const { colors } = useTheme();
	const [notificationId, setNotificationId] = useState<string | null>(null);
	const [isScheduling, setIsScheduling] = useState(false);

	const scheduleTest = async (): Promise<void> => {
		setIsScheduling(true);

		try {
			if (!await requestNotificationPermission()) {
				Alert.alert("Notifications are off", "Enable notifications to run this development test.");
				return;
			}

			const nextNotificationId = await scheduleAttentionNotificationTest();
			setNotificationId(nextNotificationId);
			Alert.alert("Test queued", "Cueda will send one notification in 3 seconds.");
		} catch (error) {
			console.error("Unable to schedule the development notification test.", error);
			Alert.alert("Test unavailable", "Cueda could not schedule the development notification test.");
		} finally {
			setIsScheduling(false);
		}
	};

	const cancelTest = async (): Promise<void> => {
		if (!notificationId) {
			return;
		}

		await cancelAttentionNotificationTest(notificationId);
		setNotificationId(null);
	};

	return (
		<View style={{ borderColor: colors.border, borderRadius: 16, borderWidth: 1, gap: 10, padding: 14 }}>
			<Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 0.7, textTransform: "uppercase" }}>Development only</Text>
			<AppPressable disabled={isScheduling} onPress={() => void scheduleTest()} style={{ alignItems: "center", borderColor: colors.border, borderRadius: 12, borderWidth: 1, paddingVertical: 12 }}>
				<Text style={{ color: colors.textSecondary, fontSize: 14, fontWeight: "700" }}>{isScheduling ? "Scheduling…" : "Send test notification in 3 seconds"}</Text>
			</AppPressable>
			{notificationId && (
				<AppPressable onPress={() => void cancelTest()} style={{ alignItems: "center", borderRadius: 12, paddingVertical: 8 }}>
					<Text style={{ color: colors.danger, fontSize: 13, fontWeight: "700" }}>Cancel queued test</Text>
				</AppPressable>
			)}
		</View>
	);
};
