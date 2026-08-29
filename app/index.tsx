import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AppPressable } from "@/components/ui/AppPressable";
import { getNextCueDate } from "@/features/attention-interrupter/domain/sessionPlan";
import { useAttentionSession } from "@/features/attention-interrupter/hooks/useAttentionSession";
import { formatClockTime } from "@/lib/time/format";
import { useTheme } from "@/theme/ThemeProvider";

const getGreeting = (): string => {
	const hour = new Date().getHours();

	if (hour < 12) {
		return "Good morning";
	}

	if (hour < 18) {
		return "Good afternoon";
	}

	return "Good evening";
};

export default function HomeScreen() {
	const router = useRouter();
	const { colors } = useTheme();
	const { session } = useAttentionSession();
	const nextCue = session ? getNextCueDate(session) : null;

	return (
		<View style={{ backgroundColor: colors.background, flex: 1, paddingHorizontal: 24, paddingTop: 40 }}>
			<View style={{ marginBottom: 28 }}>
				<Text style={{ color: colors.textPrimary, fontSize: 32, fontWeight: "800", letterSpacing: -1 }}>{getGreeting()}</Text>
				<Text style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 24, marginTop: 8, maxWidth: "92%" }}>A little external structure for noticing time and returning to your attention.</Text>
			</View>

			<AppPressable onPress={() => router.push("/(features)/attention-interrupter")} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 24, borderWidth: 1, padding: 22 }}>
				<View style={{ alignItems: "center", backgroundColor: colors.accentMuted, borderRadius: 18, height: 56, justifyContent: "center", marginBottom: 18, width: 56 }}>
					<Ionicons color={colors.accent} name="pulse-outline" size={28} />
				</View>
				<Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: "800", marginBottom: 10 }}>Attention Interrupter</Text>
				<Text style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 24 }}>
					{session && nextCue
						? `Active · next interruption at ${formatClockTime(nextCue)}.`
						: session?.status === "paused"
							? "Paused · resume when you’re ready."
							: "Start a calm, temporary session of attention check-ins."}
				</Text>
			</AppPressable>
		</View>
	);
}
