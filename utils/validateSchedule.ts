import { NudgeSchedule } from "../types/nudgeSchedule";
import { getScheduleDurationMinutes } from "./time";

export const validateSchedule = (
	schedule: NudgeSchedule,
) => {
	const duration =
		getScheduleDurationMinutes(
			schedule.startTime,
			schedule.endTime,
		);

	const interval = schedule.nudgeInterval;

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
