import { NudgeSchedule } from "../types/NudgeSchedule";

import {
	getScheduleDurationMinutes,
	minutesToTimeString,
	timeStringToMinutes,
} from "./time";

export const generateTriggers = (
	schedule: NudgeSchedule,
) => {
	const start =
		timeStringToMinutes(
			schedule.startTime,
		);

	const duration =
		getScheduleDurationMinutes(
			schedule.startTime,
			schedule.endTime,
		);

	const interval = Number(
		schedule.nudgeInterval,
	);

	const end = start + duration;

	const triggers: string[] = [];

	for (
		let current = start;
		current <= end;
		current += interval
	) {
		triggers.push(
			minutesToTimeString(current),
		);
	}

	return triggers;
};
