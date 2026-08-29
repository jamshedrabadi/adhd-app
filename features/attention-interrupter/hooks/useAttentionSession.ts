import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { createId } from "@/lib/id";
import { cancelNotifications, getPendingNotificationIds, requestNotificationPermission, scheduleRepeatingCue, scheduleTimedCues } from "@/lib/notifications/localNotifications";

import { getNextCueDate, getRemainingMs, getTimedCueDates, validateDraft } from "../domain/sessionPlan";
import { clearAttentionSession, loadAttentionSession, saveAttentionSession } from "../services/sessionStorage";
import { AttentionSession, EXTENSION_MINUTES, MAX_PENDING_CUES, SessionDraft } from "../types";

type StartResult = "started" | "permission-denied" | "invalid" | "error";

const getFutureCueDates = (session: AttentionSession, endAt: Date, now: Date): Date[] => getTimedCueDates(
	new Date(session.startedAt),
	endAt,
	session.intervalMinutes,
).filter((date) => date.getTime() > now.getTime());

export const useAttentionSession = () => {
	const [session, setSession] = useState<AttentionSession | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const refreshSession = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		setError(null);

		try {
			const storedSession = await loadAttentionSession();

			if (!storedSession) {
				setSession(null);
				return;
			}

			if (storedSession.kind === "timed" && storedSession.status === "active" && getRemainingMs(storedSession) === 0) {
				await cancelNotifications(storedSession.notificationIds);
				await clearAttentionSession();
				setSession(null);
				return;
			}

			const pendingIds = await getPendingNotificationIds();
			const notificationIds = storedSession.notificationIds.filter((notificationId) => pendingIds.has(notificationId));
			const normalizedSession = { ...storedSession, notificationIds };

			if (notificationIds.length !== storedSession.notificationIds.length) {
				await saveAttentionSession(normalizedSession);
			}

			setSession(normalizedSession);
		} catch (refreshError) {
			console.error("Unable to restore the attention session.", refreshError);
			setError("We could not restore your attention session.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void refreshSession();
	}, [refreshSession]);

	useFocusEffect(useCallback(() => {
		void refreshSession();
	}, [refreshSession]));

	const startSession = useCallback(async (draft: SessionDraft): Promise<StartResult> => {
		const validationError = validateDraft(draft);

		if (validationError) {
			setError(validationError);
			return "invalid";
		}

		if (!await requestNotificationPermission()) {
			return "permission-denied";
		}

		try {
			setError(null);
			const now = new Date();
			const id = createId();
			const endAt = draft.durationMinutes === null
				? null
				: new Date(now.getTime() + draft.durationMinutes * 60 * 1000);
			const baseSession: AttentionSession = {
				version: 1,
				id,
				kind: endAt ? "timed" : "open-ended",
				status: "active",
				intervalMinutes: draft.intervalMinutes,
				createdAt: now.toISOString(),
				startedAt: now.toISOString(),
				endAt: endAt?.toISOString() ?? null,
				pausedAt: null,
				remainingMs: null,
				notificationIds: [],
				repeatingNotificationId: null,
			};

			const notificationIds = endAt
				? await scheduleTimedCues(getTimedCueDates(now, endAt, draft.intervalMinutes), { sessionId: id })
				: [];
			const repeatingNotificationId = endAt
				? null
				: await scheduleRepeatingCue(draft.intervalMinutes, { sessionId: id });
			const nextSession = { ...baseSession, notificationIds, repeatingNotificationId };

			await saveAttentionSession(nextSession);
			setSession(nextSession);
			return "started";
		} catch (startError) {
			console.error("Unable to start the attention session.", startError);
			setError("Cueda could not schedule this session. Please try again.");
			return "error";
		}
	}, []);

	const stopSession = useCallback(async (): Promise<void> => {
		if (!session) {
			return;
		}

		await cancelNotifications([...session.notificationIds, ...(session.repeatingNotificationId ? [session.repeatingNotificationId] : [])]);
		await clearAttentionSession();
		setSession(null);
	}, [session]);

	const pauseSession = useCallback(async (): Promise<void> => {
		if (!session || session.status === "paused") {
			return;
		}

		const now = Date.now();
		const remainingMs = getRemainingMs(session, now);
		await cancelNotifications([...session.notificationIds, ...(session.repeatingNotificationId ? [session.repeatingNotificationId] : [])]);

		const nextSession: AttentionSession = {
			...session,
			status: "paused",
			pausedAt: new Date(now).toISOString(),
			remainingMs,
			notificationIds: [],
			repeatingNotificationId: null,
		};
		await saveAttentionSession(nextSession);
		setSession(nextSession);
	}, [session]);

	const resumeSession = useCallback(async (): Promise<StartResult> => {
		if (!session || session.status !== "paused") {
			return "invalid";
		}

		if (!await requestNotificationPermission()) {
			return "permission-denied";
		}

		try {
			const now = new Date();
			const endAt = session.kind === "timed" ? new Date(now.getTime() + (session.remainingMs as number)) : null;
			const nextSession: AttentionSession = {
				...session,
				status: "active",
				startedAt: now.toISOString(),
				endAt: endAt?.toISOString() ?? null,
				pausedAt: null,
				remainingMs: null,
				notificationIds: endAt
					? await scheduleTimedCues(getTimedCueDates(now, endAt, session.intervalMinutes), { sessionId: session.id })
					: [],
				repeatingNotificationId: endAt
					? null
					: await scheduleRepeatingCue(session.intervalMinutes, { sessionId: session.id }),
			};
			await saveAttentionSession(nextSession);
			setSession(nextSession);
			return "started";
		} catch (resumeError) {
			console.error("Unable to resume the attention session.", resumeError);
			setError("Cueda could not resume this session. Please try again.");
			return "error";
		}
	}, [session]);

	const extendSession = useCallback(async (): Promise<boolean> => {
		if (!session || session.kind !== "timed" || session.status !== "active") {
			return false;
		}

		const now = new Date();
		const endAt = new Date(new Date(session.endAt as string).getTime() + EXTENSION_MINUTES * 60 * 1000);
		const cueDates = getFutureCueDates(session, endAt, now);

		if (cueDates.length > MAX_PENDING_CUES) {
			setError(`You can keep up to ${MAX_PENDING_CUES} future interruptions queued at once.`);
			return false;
		}

		try {
			const notificationIds = await scheduleTimedCues(cueDates, { sessionId: session.id });
			await cancelNotifications(session.notificationIds);
			const nextSession = { ...session, endAt: endAt.toISOString(), notificationIds };
			await saveAttentionSession(nextSession);
			setSession(nextSession);
			return true;
		} catch (extendError) {
			console.error("Unable to extend the attention session.", extendError);
			setError("Cueda could not extend this session. Please try again.");
			return false;
		}
	}, [session]);

	const nextCue = useMemo(() => session ? getNextCueDate(session) : null, [session]);

	return {
		session,
		isLoading,
		error,
		nextCue,
		refreshSession,
		startSession,
		stopSession,
		pauseSession,
		resumeSession,
		extendSession,
	};
};
