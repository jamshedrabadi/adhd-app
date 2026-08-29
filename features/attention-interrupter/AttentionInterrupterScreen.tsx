import { useState } from "react";
import { Alert, Linking, Modal, ScrollView, Text, View } from "react-native";

import { AppPressable } from "@/components/ui/AppPressable";
import { hasNotificationPermission } from "@/lib/notifications/localNotifications";
import { useTheme } from "@/theme/ThemeProvider";

import { ActiveSession } from "./components/ActiveSession";
import { SessionSetup } from "./components/SessionSetup";
import { useAttentionSession } from "./hooks/useAttentionSession";
import { SessionDraft } from "./types";

const INITIAL_DRAFT: SessionDraft = {
	durationMinutes: 60,
	intervalMinutes: 10,
};

export const AttentionInterrupterScreen = () => {
	const { colors } = useTheme();
	const [draft, setDraft] = useState<SessionDraft>(INITIAL_DRAFT);
	const [isStarting, setIsStarting] = useState(false);
	const [showPermissionExplanation, setShowPermissionExplanation] = useState(false);
	const { session, isLoading, error, refreshSession, startSession, stopSession, pauseSession, resumeSession, extendSession } = useAttentionSession();

	const showPermissionDenied = (): void => {
		Alert.alert(
			"Notifications are off",
			"Cueda needs notification access to run attention sessions when the app is closed.",
			[
				{ text: "Not now", style: "cancel" },
				{ text: "Open Settings", onPress: () => void Linking.openSettings() },
			],
		);
	};

	const start = async (): Promise<void> => {
		setIsStarting(true);
		const result = await startSession(draft);
		setIsStarting(false);

		if (result === "permission-denied") {
			showPermissionDenied();
		}
	};

	const beginStart = async (): Promise<void> => {
		if (await hasNotificationPermission()) {
			void start();
			return;
		}

		setShowPermissionExplanation(true);
	};

	const confirmStop = (): void => {
		Alert.alert("Stop this session?", "Remaining interruptions will be cancelled.", [
			{ text: "Keep session", style: "cancel" },
			{ text: "Stop session", style: "destructive", onPress: () => void stopSession() },
		]);
	};

	if (isLoading) {
		return <View style={{ backgroundColor: colors.background, flex: 1 }} />;
	}

	return (
		<View style={{ backgroundColor: colors.background, flex: 1 }}>
			<ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
				{session ? (
					<ActiveSession
						onComplete={() => void refreshSession()}
						onExtend={() => void extendSession()}
						onPause={() => void pauseSession()}
						onResume={() => void resumeSession()}
						onStop={confirmStop}
						session={session}
					/>
				) : (
					<SessionSetup draft={draft} isStarting={isStarting} onChange={setDraft} onStart={() => void beginStart()} />
				)}
				{error && <Text style={{ color: colors.danger, fontSize: 14, lineHeight: 20, marginTop: 16 }}>{error}</Text>}
			</ScrollView>

			<Modal animationType="fade" onRequestClose={() => setShowPermissionExplanation(false)} transparent visible={showPermissionExplanation}>
				<View style={{ backgroundColor: colors.overlay, flex: 1, justifyContent: "flex-end", padding: 20 }}>
					<View style={{ backgroundColor: colors.surfaceRaised, borderRadius: 24, gap: 16, padding: 22 }}>
						<Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: "800" }}>Allow attention check-ins</Text>
						<Text style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 24 }}>Cueda needs notification access to send your check-ins, even when the app is closed. You can turn this off any time in Settings.</Text>
						<AppPressable onPress={() => { setShowPermissionExplanation(false); void start(); }} style={{ alignItems: "center", backgroundColor: colors.accent, borderRadius: 16, paddingVertical: 16 }}>
							<Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>Continue</Text>
						</AppPressable>
						<AppPressable onPress={() => setShowPermissionExplanation(false)} style={{ alignItems: "center", borderRadius: 16, paddingVertical: 14 }}>
							<Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: "700" }}>Not now</Text>
						</AppPressable>
					</View>
				</View>
			</Modal>
		</View>
	);
};
