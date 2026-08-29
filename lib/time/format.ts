export const formatClockTime = (date: Date): string => date.toLocaleTimeString([], {
	hour: "numeric",
	minute: "2-digit",
});

export const formatMinutes = (minutes: number): string => {
	const roundedMinutes = Math.max(0, Math.ceil(minutes));
	return `${roundedMinutes} min`;
};

export const formatDuration = (totalMinutes: number): string => {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	if (hours === 0) {
		return `${minutes} min`;
	}

	if (minutes === 0) {
		return `${hours} hr`;
	}

	return `${hours} hr ${minutes} min`;
};
