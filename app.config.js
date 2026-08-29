const identity = require("./app.identity.json");

module.exports = {
	expo: {
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		userInterfaceStyle: "automatic",
		ios: {
			bundleIdentifier: identity.iosBundleIdentifier,
			supportsTablet: true,
		},
		android: {
			package: identity.androidPackage,
			adaptiveIcon: {
				backgroundColor: "#E6F4FE",
				foregroundImage: "./assets/images/android-icon-foreground.png",
				backgroundImage: "./assets/images/android-icon-background.png",
				monochromeImage: "./assets/images/android-icon-monochrome.png",
			},
			predictiveBackGestureEnabled: false,
		},
		web: {
			output: "static",
			favicon: "./assets/images/favicon.png",
		},
		plugins: [
			"expo-router",
			[
				"expo-notifications",
				{
					color: "#087E8B",
					sounds: [
						"./assets/sounds/attention_bells.wav",
					],
				},
			],
			[
				"expo-splash-screen",
				{
					image: "./assets/images/splash-icon.png",
					imageWidth: 200,
					resizeMode: "contain",
					backgroundColor: "#ffffff",
				},
			],
		],
		experiments: {
			typedRoutes: true,
			reactCompiler: true,
		},
		name: identity.displayName,
		slug: identity.slug,
		scheme: identity.scheme,
		description: identity.storeSubtitle,
	},
};
