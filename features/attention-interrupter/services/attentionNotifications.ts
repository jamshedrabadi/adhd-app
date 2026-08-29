import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const ATTENTION_CHANNEL_ID = "attention-interruptions";
const ATTENTION_SOUND_FILE = "attention_bells.wav";

Notifications.setNotificationHandler({
	handleNotification: () => Promise.resolve({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export const ensureNotificationChannel = async (): Promise<void> => {
	if (Platform.OS !== "android") {
		return;
	}

	await Notifications.setNotificationChannelAsync(ATTENTION_CHANNEL_ID, {
		name: "Cueda attention bells",
		importance: Notifications.AndroidImportance.HIGH,
		vibrationPattern: [0, 180],
		sound: ATTENTION_SOUND_FILE,
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
};

const createCueContent = ({ sessionId }: CueContent): Notifications.NotificationContentInput => ({
	title: "Attention check-in",
	body: "Take a moment to notice where your attention is.",
	sound: ATTENTION_SOUND_FILE,
	data: {
		feature: "attention-interrupter",
		sessionId,
	},
});

export const scheduleTimedCues = async (dates: Date[], content: CueContent): Promise<string[]> => {
	await ensureNotificationChannel();
	const notificationIds: string[] = [];

	for (const date of dates) {
		const notificationId = await Notifications.scheduleNotificationAsync({
			content: createCueContent(content),
			trigger: {
				type: Notifications.SchedulableTriggerInputTypes.DATE,
				date,
				...(Platform.OS === "android" ? { channelId: ATTENTION_CHANNEL_ID } : {}),
			},
		});
		notificationIds.push(notificationId);
	}

	return notificationIds;
};

export const scheduleRepeatingCue = async (intervalMinutes: number, content: CueContent): Promise<string> => {
	await ensureNotificationChannel();

	return Notifications.scheduleNotificationAsync({
		content: createCueContent(content),
		trigger: {
			type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
			seconds: intervalMinutes * 60,
			repeats: true,
			...(Platform.OS === "android" ? { channelId: ATTENTION_CHANNEL_ID } : {}),
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
