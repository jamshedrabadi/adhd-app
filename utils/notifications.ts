import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
	handleNotification: () =>
		Promise.resolve({
			shouldShowBanner: true,
			shouldShowList: true,
			shouldPlaySound: true,
			shouldSetBadge: false,
		}),
});

export const requestNotificationPermissions =
	async () => {
		const settings = await Notifications.getPermissionsAsync();

		if (settings.granted) {
			return true;
		}

		const permissionResponse = await Notifications.requestPermissionsAsync();

		return (permissionResponse.granted);
	};

export const sendTestNotification = async () => {
	const granted = await requestNotificationPermissions();

	if (!granted) {
		throw new Error("Notification permission denied");
	}

	await Notifications.scheduleNotificationAsync({
		content: {
			title: "Attention Interrupter",
			body: "Time awareness check.",
			sound: true,
		},
		trigger: {
			type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
			seconds: 5,
		},
	});
};
