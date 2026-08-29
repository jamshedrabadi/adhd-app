import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";

void SplashScreen.preventAutoHideAsync();

const RootLayoutContent = () => {
	const { colors, isReady, resolvedMode } = useTheme();
	const router = useRouter();

	useEffect(() => {
		if (isReady) {
			void SplashScreen.hideAsync();
		}
	}, [isReady]);

	if (!isReady) {
		return <View style={{ backgroundColor: colors.background, flex: 1 }} />;
	}

	return (
		<>
			<StatusBar style={resolvedMode === "dark" ? "light" : "dark"} />
			<Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.textPrimary, headerTitleStyle: { color: colors.textPrimary, fontWeight: "700" } }}>
				<Stack.Screen name="index" options={{ headerTitle: "", headerRight: () => (
					<Pressable accessibilityLabel="Open settings" hitSlop={8} onPress={() => router.push("/settings")} style={({ pressed }) => ({ alignItems: "center", backgroundColor: pressed ? colors.surfacePressed : "transparent", borderRadius: 19, height: 38, justifyContent: "center", width: 38 })}>
						<Ionicons color={colors.textPrimary} name="settings-outline" size={22} />
					</Pressable>
				) }} />
				<Stack.Screen name="settings" options={{ title: "Settings" }} />
				<Stack.Screen name="(features)/attention-interrupter/index" options={{ title: "Attention Interrupter" }} />
			</Stack>
		</>
	);
};

export default function RootLayout() {
	return <ThemeProvider><RootLayoutContent /></ThemeProvider>;
}
