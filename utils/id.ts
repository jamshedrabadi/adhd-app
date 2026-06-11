export const generateId = () => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return crypto.randomUUID(); // use built-in UUID generation if available
	}

	return `${Date.now()}-${Math.random()
		.toString(36)
		.slice(2, 10)}`; // fallback for environments without crypto.randomUUID
};
