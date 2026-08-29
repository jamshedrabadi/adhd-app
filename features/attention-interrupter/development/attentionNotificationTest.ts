import { Platform } from "react-native";

import { cancelNotifications, scheduleTimedCues } from "../services/attentionNotifications";

const TEST_DELAY_MS = 3_000;

export const isAttentionNotificationTestEnabled = __DEV__
	&& Platform.OS === "android"
	&& process.env.EXPO_PUBLIC_ENABLE_NOTIFICATION_TESTS === "true";

export const scheduleAttentionNotificationTest = async (): Promise<string> => {
	if (!isAttentionNotificationTestEnabled) {
		throw new Error("Development notification testing is disabled.");
	}

	const notificationIds = await scheduleTimedCues([
		new Date(Date.now() + TEST_DELAY_MS),
	], { sessionId: "development-notification-test" });

	return notificationIds[0];
};

export const cancelAttentionNotificationTest = async (notificationId: string): Promise<void> => {
	await cancelNotifications([notificationId]);
};
