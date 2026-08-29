import { AttentionSession, MAX_PENDING_CUES, MIN_INTERVAL_MINUTES, SessionDraft } from "../types";

export const getTimedCueDates = (startedAt: Date, endAt: Date, intervalMinutes: number): Date[] => {
	const intervalMs = intervalMinutes * 60 * 1000;
	const cueDates: Date[] = [];

	for (let time = startedAt.getTime() + intervalMs; time <= endAt.getTime(); time += intervalMs) {
		cueDates.push(new Date(time));
	}

	return cueDates;
};

export const getPlannedCueCount = (draft: SessionDraft): number => {
	if (!draft.durationMinutes) {
		return 1;
	}

	return Math.floor(draft.durationMinutes / draft.intervalMinutes);
};

export const validateDraft = (draft: SessionDraft): string | null => {
	if (!Number.isInteger(draft.intervalMinutes) || draft.intervalMinutes < MIN_INTERVAL_MINUTES) {
		return `Choose an interval of at least ${MIN_INTERVAL_MINUTES} minutes.`;
	}

	if (draft.durationMinutes !== null && (!Number.isInteger(draft.durationMinutes) || draft.durationMinutes < draft.intervalMinutes)) {
		return "Duration must be at least one interval.";
	}

	if (getPlannedCueCount(draft) > MAX_PENDING_CUES) {
		return `This session would schedule more than ${MAX_PENDING_CUES} future interruptions. Shorten it or choose a longer interval.`;
	}

	return null;
};

export const getRemainingMs = (session: AttentionSession, now = Date.now()): number | null => {
	if (session.kind === "open-ended") {
		return null;
	}

	if (session.status === "paused") {
		return session.remainingMs;
	}

	return Math.max(0, new Date(session.endAt as string).getTime() - now);
};

export const getNextCueDate = (session: AttentionSession, now = Date.now()): Date | null => {
	if (session.status === "paused") {
		return null;
	}

	const intervalMs = session.intervalMinutes * 60 * 1000;
	const startTime = new Date(session.startedAt).getTime();
	const elapsedIntervals = Math.floor((now - startTime) / intervalMs);
	const nextTime = startTime + Math.max(1, elapsedIntervals + 1) * intervalMs;

	if (session.kind === "timed" && nextTime > new Date(session.endAt as string).getTime()) {
		return null;
	}

	return new Date(nextTime);
};
