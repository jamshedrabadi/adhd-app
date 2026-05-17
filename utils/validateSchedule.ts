import { NudgeSchedule } from "../types/NudgeSchedule";
import { getScheduleDurationMinutes } from "./time";

export const validateSchedule = (
	schedule: NudgeSchedule,
) => {
	const duration =
		getScheduleDurationMinutes(
			schedule.startTime,
			schedule.endTime,
		);

	const interval = Number(
		schedule.nudgeInterval,
	);

	if (interval > duration) {
		return {
			valid: false,
			message: "Interval must be shorter than the schedule duration.",
		};
	}

	return {
		valid: true,
		message: null,
	};
};
