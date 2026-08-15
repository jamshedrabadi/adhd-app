const baseConfig = require("./app.json");
const identity = require("./app.identity.json");

module.exports = {
	...baseConfig,
	expo: {
		...baseConfig.expo,
		name: identity.displayName,
		slug: identity.slug,
		scheme: identity.scheme,
		description: identity.storeSubtitle,
		android: {
			...baseConfig.expo.android,
			package: identity.androidPackage,
		},
	},
};
