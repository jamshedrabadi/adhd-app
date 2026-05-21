export const timeStringToMinutes = (
	time: string,
) => {
	const [hours, minutes] = time
		.split(":")
		.map(Number);

	return hours * 60 + minutes;
};

export const getScheduleDurationMinutes = (
	startTime: string,
	endTime: string,
) => {
	const start = timeStringToMinutes(startTime);
	const end = timeStringToMinutes(endTime);

	// Overnight schedule support
	if (end <= start) {
		return 24 * 60 - start + end;
	}

	return end - start;
};

export const minutesToTimeString = (
	totalMinutes: number,
) => {
	const normalized = totalMinutes % (24 * 60);

	const hours = Math.floor(
		normalized / 60,
	);

	const minutes = normalized % 60;

	return `${hours
		.toString()
		.padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}`;
};

export const formatTime = (
	time: string,
) => {
	const [hours, minutes] = time
		.split(":")
		.map(Number);

	const date = new Date();

	date.setHours(hours);
	date.setMinutes(minutes);

	return date.toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit",
	});
};
