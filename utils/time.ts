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
