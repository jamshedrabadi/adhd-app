const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const identity = require(path.join(projectRoot, "app.identity.json"));
const stringsPath = path.join(
	projectRoot,
	"android",
	"app",
	"src",
	"main",
	"res",
	"values",
	"strings.xml",
);

if (!fs.existsSync(stringsPath)) {
	process.exit(0);
}

const displayName = identity.displayName
	.replace(/&/g, "&amp;")
	.replace(/</g, "&lt;")
	.replace(/>/g, "&gt;")
	.replace(/\"/g, "&quot;")
	.replace(/\x27/g, "&apos;");

const appName = '<string name="app_name">' + displayName + "</string>";
const strings = fs.readFileSync(stringsPath, "utf8");
const nextStrings = strings.includes('name="app_name"')
	? strings.replace(/<string name="app_name">.*?<\/string>/, appName)
	: strings.replace("<resources>", "<resources>\n  " + appName);

fs.writeFileSync(stringsPath, nextStrings);
