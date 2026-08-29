import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const getAttentionChannelId = (sound: string): string => `attention-${sound}`;

Notifications.setNotificationHandler({
	handleNotification: () => Promise.resolve({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export const ensureNotificationChannel = async (sound: string): Promise<void> => {
	if (Platform.OS !== "android") {
		return;
	}

	await Notifications.setNotificationChannelAsync(getAttentionChannelId(sound), {
		name: "Attention interruptions",
		importance: Notifications.AndroidImportance.HIGH,
		vibrationPattern: [0, 180],
		sound: `${sound}.wav`,
		lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
	});
};

export const hasNotificationPermission = async (): Promise<boolean> => {
	const permissions = await Notifications.getPermissionsAsync();
	return permissions.granted;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
	if (await hasNotificationPermission()) {
		return true;
	}

	const permissions = await Notifications.requestPermissionsAsync();
	return permissions.granted;
};

type CueContent = {
	sessionId: string;
	sound: string;
};

const createCueContent = ({ sessionId, sound }: CueContent): Notifications.NotificationContentInput => ({
	title: "Attention check-in",
	body: "Take a moment to notice where your attention is.",
	sound: `${sound}.wav`,
	data: {
		feature: "attention-interrupter",
		sessionId,
		sound,
	},
});

export const scheduleTimedCues = async (dates: Date[], content: CueContent): Promise<string[]> => {
	await ensureNotificationChannel(content.sound);
	const notificationIds: string[] = [];

	for (const date of dates) {
		const notificationId = await Notifications.scheduleNotificationAsync({
			content: {
				...createCueContent(content),
				...(Platform.OS === "android" ? { channelId: getAttentionChannelId(content.sound) } : {}),
			},
			trigger: {
				type: Notifications.SchedulableTriggerInputTypes.DATE,
				date,
			},
		});
		notificationIds.push(notificationId);
	}

	return notificationIds;
};

export const scheduleRepeatingCue = async (intervalMinutes: number, content: CueContent): Promise<string> => {
	await ensureNotificationChannel(content.sound);

	return Notifications.scheduleNotificationAsync({
		content: {
			...createCueContent(content),
			...(Platform.OS === "android" ? { channelId: getAttentionChannelId(content.sound) } : {}),
		},
		trigger: {
			type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
			seconds: intervalMinutes * 60,
			repeats: true,
		},
	});
};

export const cancelNotifications = async (notificationIds: string[]): Promise<void> => {
	await Promise.all(notificationIds.map((notificationId) => Notifications.cancelScheduledNotificationAsync(notificationId)));
};

export const getPendingNotificationIds = async (): Promise<Set<string>> => {
	const pendingNotifications = await Notifications.getAllScheduledNotificationsAsync();
	return new Set(pendingNotifications.map((notification) => notification.identifier));
};
