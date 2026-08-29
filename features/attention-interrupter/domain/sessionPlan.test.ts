import { getNextCueDate, getPlannedCueCount, getTimedCueDates, getRemainingMs, validateDraft } from "./sessionPlan";

import { AttentionSession } from "../types";

const createTimedSession = (overrides: Partial<AttentionSession> = {}): AttentionSession => ({
	version: 1,
	id: "session-1",
	kind: "timed",
	status: "active",
	intervalMinutes: 5,
	createdAt: "2026-08-29T10:00:00.000Z",
	startedAt: "2026-08-29T10:00:00.000Z",
	endAt: "2026-08-29T11:00:00.000Z",
	pausedAt: null,
	remainingMs: null,
	notificationIds: [],
	repeatingNotificationId: null,
	...overrides,
});

describe("session plans", () => {
	it("creates the first timed cue after a full interval and includes the end boundary", () => {
		const cues = getTimedCueDates(new Date("2026-08-29T10:00:00.000Z"), new Date("2026-08-29T10:15:00.000Z"), 5);

		expect(cues.map((cue) => cue.toISOString())).toEqual([
			"2026-08-29T10:05:00.000Z",
			"2026-08-29T10:10:00.000Z",
			"2026-08-29T10:15:00.000Z",
		]);
	});

	it("keeps open-ended sessions to one repeating notification", () => {
		expect(getPlannedCueCount({ durationMinutes: null, intervalMinutes: 5 })).toBe(1);
	});

	it("rejects timed sessions above the shared 60-cue limit", () => {
		expect(validateDraft({ durationMinutes: 305, intervalMinutes: 5 })).toContain("60");
		expect(validateDraft({ durationMinutes: 300, intervalMinutes: 5 })).toBeNull();
	});

	it("keeps paused time fixed and calculates the next active cue from actual timestamps", () => {
		const activeSession = createTimedSession();
		expect(getNextCueDate(activeSession, new Date("2026-08-29T10:07:00.000Z").getTime())?.toISOString()).toBe("2026-08-29T10:10:00.000Z");

		const pausedSession = createTimedSession({ status: "paused", remainingMs: 420000 });
		expect(getRemainingMs(pausedSession, new Date("2026-08-29T10:40:00.000Z").getTime())).toBe(420000);
		expect(getNextCueDate(pausedSession)).toBeNull();
	});
});
