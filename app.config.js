const baseConfig = require("./app.json");
const identity = require("./app.identity.json");

module.exports = {
	...baseConfig,
	expo: {
		...baseConfig.expo,
		name: identity.displayName,
		description: identity.storeSubtitle,
	},
};
