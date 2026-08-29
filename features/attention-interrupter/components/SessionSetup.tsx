import { Text, TextInput, View } from "react-native";

import { AppPressable } from "@/components/ui/AppPressable";
import { formatClockTime, formatDuration } from "@/lib/time/format";
import { useTheme } from "@/theme/ThemeProvider";

import { ATTENTION_SOUNDS, AttentionSoundId, MAX_PENDING_CUES, MIN_INTERVAL_MINUTES, SessionDraft } from "../types";
import { getPlannedCueCount } from "../domain/sessionPlan";

type Props = {
	draft: SessionDraft;
	onChange: (draft: SessionDraft) => void;
	onStart: () => void;
	isStarting: boolean;
};

const numericValue = (value: string, fallback: number): number => {
	const parsedValue = Number(value);
	return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

export const SessionSetup = ({ draft, onChange, onStart, isStarting }: Props) => {
	const { colors } = useTheme();
	const plannedCueCount = getPlannedCueCount(draft);
	const endsAt = draft.durationMinutes === null
		? null
		: new Date(Date.now() + draft.durationMinutes * 60 * 1000);

	const updateSound = (sound: AttentionSoundId): void => onChange({ ...draft, sound });

	return (
		<View style={{ gap: 20 }}>
			<View>
				<Text style={{ color: colors.textPrimary, fontSize: 29, fontWeight: "800", letterSpacing: -0.8 }}>
					Start a check-in session
				</Text>
				<Text style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 24, marginTop: 8 }}>
					Gentle interruptions to help you notice time and return to what matters.
				</Text>
			</View>

			<View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, gap: 20, padding: 18 }}>
				<View>
					<Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" }}>Duration</Text>
					<View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
						{(["timed", "open-ended"] as const).map((kind) => {
							const selected = kind === "timed" ? draft.durationMinutes !== null : draft.durationMinutes === null;
							return (
								<AppPressable
									key={kind}
									onPress={() => onChange({ ...draft, durationMinutes: kind === "timed" ? draft.durationMinutes ?? 60 : null })}
									style={{ backgroundColor: selected ? colors.accentMuted : colors.surfacePressed, borderColor: selected ? colors.accent : colors.border, borderRadius: 12, borderWidth: 1, flex: 1, paddingHorizontal: 12, paddingVertical: 12 }}
								>
									<Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: selected ? "700" : "600", textAlign: "center" }}>
										{kind === "timed" ? "For a duration" : "Until I stop"}
									</Text>
								</AppPressable>
							);
						})}
					</View>
					{draft.durationMinutes !== null && (
						<View style={{ alignItems: "center", flexDirection: "row", gap: 10, marginTop: 12 }}>
							<TextInput
								accessibilityLabel="Session duration in minutes"
								keyboardType="number-pad"
								onChangeText={(value) => onChange({ ...draft, durationMinutes: numericValue(value, draft.durationMinutes as number) })}
								selectTextOnFocus
								style={{ backgroundColor: colors.surfacePressed, borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.textPrimary, fontSize: 18, fontWeight: "700", minWidth: 76, paddingHorizontal: 14, paddingVertical: 10, textAlign: "center" }}
								value={String(draft.durationMinutes)}
							/>
							<Text style={{ color: colors.textSecondary, fontSize: 15 }}>minutes</Text>
						</View>
					)}
				</View>

				<View>
					<Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" }}>Interrupt every</Text>
					<View style={{ alignItems: "center", flexDirection: "row", gap: 10, marginTop: 12 }}>
						<TextInput
							accessibilityLabel="Interruption interval in minutes"
							keyboardType="number-pad"
							onChangeText={(value) => onChange({ ...draft, intervalMinutes: numericValue(value, draft.intervalMinutes) })}
							selectTextOnFocus
							style={{ backgroundColor: colors.surfacePressed, borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.textPrimary, fontSize: 18, fontWeight: "700", minWidth: 76, paddingHorizontal: 14, paddingVertical: 10, textAlign: "center" }}
							value={String(draft.intervalMinutes)}
						/>
						<Text style={{ color: colors.textSecondary, fontSize: 15 }}>minutes</Text>
					</View>
					<Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginTop: 8 }}>Minimum {MIN_INTERVAL_MINUTES} minutes. Choose any whole-minute interval.</Text>
				</View>

				<View>
					<Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" }}>Sound</Text>
					<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
						{ATTENTION_SOUNDS.map((sound) => {
							const selected = sound.id === draft.sound;
							return (
								<AppPressable key={sound.id} onPress={() => updateSound(sound.id)} style={{ backgroundColor: selected ? colors.accentMuted : colors.surfacePressed, borderColor: selected ? colors.accent : colors.border, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10 }}>
									<Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: selected ? "700" : "600" }}>{sound.label}</Text>
								</AppPressable>
							);
						})}
					</View>
				</View>
			</View>

			<View style={{ backgroundColor: colors.accentMuted, borderRadius: 18, padding: 16 }}>
				<Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "700" }}>Your session</Text>
				<Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 21, marginTop: 6 }}>
					{draft.durationMinutes === null
						? `A check-in about every ${draft.intervalMinutes} minutes until you stop it.`
						: `${plannedCueCount} interruptions over ${formatDuration(draft.durationMinutes)}. First interruption in ${draft.intervalMinutes} minutes, around ${formatClockTime(new Date(Date.now() + draft.intervalMinutes * 60 * 1000))}.`}
				</Text>
				{plannedCueCount > MAX_PENDING_CUES && <Text style={{ color: colors.danger, fontSize: 13, fontWeight: "700", marginTop: 8 }}>This exceeds the {MAX_PENDING_CUES}-cue limit.</Text>}
				{endsAt && <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 6 }}>Ends around {formatClockTime(endsAt)}.</Text>}
			</View>

			<AppPressable disabled={isStarting} onPress={onStart} style={{ alignItems: "center", backgroundColor: colors.accent, borderRadius: 16, paddingVertical: 17 }}>
				<Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>{isStarting ? "Starting…" : "Start session"}</Text>
			</AppPressable>
		</View>
	);
};
