export const MIN_INTERVAL_MINUTES = 5;
export const MAX_PENDING_CUES = 60;
export const EXTENSION_MINUTES = 15;

export type SessionKind = "timed" | "open-ended";
export type SessionStatus = "active" | "paused";

export type AttentionSession = {
	version: 1;
	id: string;
	kind: SessionKind;
	status: SessionStatus;
	intervalMinutes: number;
	createdAt: string;
	startedAt: string;
	endAt: string | null;
	pausedAt: string | null;
	remainingMs: number | null;
	notificationIds: string[];
	repeatingNotificationId: string | null;
};

export type SessionDraft = {
	durationMinutes: number | null;
	intervalMinutes: number;
};
