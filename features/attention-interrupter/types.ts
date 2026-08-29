export const MIN_INTERVAL_MINUTES = 5;
export const MAX_PENDING_CUES = 60;
export const EXTENSION_MINUTES = 15;

export const ATTENTION_SOUNDS = [
	{ id: "soft-chime", label: "Soft Chime", fileName: "soft-chime.wav" },
	{ id: "bell", label: "Bell", fileName: "bell.wav" },
	{ id: "digital", label: "Digital", fileName: "digital.wav" },
	{ id: "knock", label: "Knock", fileName: "knock.wav" },
] as const;

export type AttentionSoundId = (typeof ATTENTION_SOUNDS)[number]["id"];
export type SessionKind = "timed" | "open-ended";
export type SessionStatus = "active" | "paused";

export type AttentionSession = {
	version: 1;
	id: string;
	kind: SessionKind;
	status: SessionStatus;
	intervalMinutes: number;
	sound: AttentionSoundId;
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
	sound: AttentionSoundId;
};
