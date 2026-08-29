import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { AppPressable } from "@/components/ui/AppPressable";
import { formatClockTime, formatMinutes } from "@/lib/time/format";
import { useTheme } from "@/theme/ThemeProvider";

import { getNextCueDate, getRemainingMs } from "../domain/sessionPlan";
import { AttentionSession, EXTENSION_MINUTES } from "../types";

type Props = {
	session: AttentionSession;
	onPause: () => void;
	onResume: () => void;
	onExtend: () => void;
	onComplete: () => void;
	onStop: () => void;
};

export const ActiveSession = ({ session, onPause, onResume, onExtend, onComplete, onStop }: Props) => {
	const { colors } = useTheme();
	const [now, setNow] = useState(Date.now());
	const isPaused = session.status === "paused";

	useEffect(() => {
		if (isPaused) {
			return undefined;
		}

		const timer = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(timer);
	}, [isPaused]);

	const remainingMs = getRemainingMs(session, now);
	const nextCue = getNextCueDate(session, now);
	const isOpenEnded = session.kind === "open-ended";
	const startedAt = new Date(session.startedAt);
	const headline = isPaused
		? "Session paused"
		: isOpenEnded
			? "Attention session active"
			: "Attention session active";
	const primaryTime = isOpenEnded
		? `Started ${formatMinutes((now - startedAt.getTime()) / 60000)} ago`
		: `${formatMinutes((remainingMs ?? 0) / 60000)} remaining`;

	useEffect(() => {
		if (session.kind === "timed" && session.status === "active" && remainingMs === 0) {
			onComplete();
		}
	}, [onComplete, remainingMs, session.kind, session.status]);

	return (
		<View style={{ gap: 20 }}>
			<View>
				<Text style={{ color: colors.textPrimary, fontSize: 29, fontWeight: "800", letterSpacing: -0.8 }}>{headline}</Text>
				<Text style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 24, marginTop: 8 }}>
					{isPaused ? "Your remaining time is safely on hold." : "A gentle cue will help you notice the moment."}
				</Text>
			</View>

			<View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 24, borderWidth: 1, overflow: "hidden", padding: 22 }}>
				<Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" }}>
					{isPaused ? "On hold" : "Session status"}
				</Text>
				<Text style={{ color: colors.textPrimary, fontSize: 34, fontWeight: "800", letterSpacing: -1, marginTop: 8 }}>{primaryTime}</Text>
				<View style={{ backgroundColor: colors.surfacePressed, borderRadius: 16, marginTop: 20, padding: 16 }}>
					<Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "700", letterSpacing: 0.7, textTransform: "uppercase" }}>Next interruption</Text>
					<Text style={{ color: colors.textPrimary, fontSize: 19, fontWeight: "700", marginTop: 6 }}>
						{nextCue ? `${formatClockTime(nextCue)} · in ${formatMinutes((nextCue.getTime() - now) / 60000)}` : isPaused ? "Resume when you’re ready" : "No more interruptions"}
					</Text>
				</View>
				<Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 16 }}>
					Every {session.intervalMinutes} minutes · Cueda attention bells
				</Text>
			</View>

			<View style={{ gap: 10 }}>
				<AppPressable onPress={isPaused ? onResume : onPause} style={{ alignItems: "center", backgroundColor: colors.accent, borderRadius: 16, paddingVertical: 17 }}>
					<Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>{isPaused ? "Resume session" : "Pause session"}</Text>
				</AppPressable>
				{session.kind === "timed" && !isPaused && (
					<AppPressable onPress={onExtend} style={{ alignItems: "center", backgroundColor: colors.accentMuted, borderColor: colors.accent, borderRadius: 16, borderWidth: 1, paddingVertical: 16 }}>
						<Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "800" }}>Add {EXTENSION_MINUTES} minutes</Text>
					</AppPressable>
				)}
				<AppPressable onPress={onStop} style={{ alignItems: "center", backgroundColor: colors.dangerMuted, borderRadius: 16, paddingVertical: 16 }}>
					<Text style={{ color: colors.danger, fontSize: 16, fontWeight: "800" }}>Stop session</Text>
				</AppPressable>
			</View>
		</View>
	);
};
