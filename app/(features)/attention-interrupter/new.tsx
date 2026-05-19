import {
	View,
	Pressable,
	Text,
	Alert,
} from "react-native";

import { useRouter } from "expo-router";

import { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScheduleEditor } from "../../../components/ScheduleEditor";

import { NudgeSchedule } from "../../../types/NudgeSchedule";

import { useTheme } from "../../../theme/ThemeProvider";

const STORAGE_KEY = "NUDGE_SCHEDULES";

export const NewScheduleScreen = () => {
	const router = useRouter();

	const { colors } = useTheme();

	const [schedule, setSchedule] = useState<NudgeSchedule>({
		id: Date.now().toString(),
		name: "",
		enabled: true,
		startTime: "09:00",
		endTime: "17:00",
		nudgeInterval: 10,
		sound: "soft-chime",
	});

	const handleCancel = () => {
		router.back();
	};

	const handleSave = async () => {
		try {
			if (!schedule.name.trim()) {
				Alert.alert("Missing Schedule Name", "Please enter a schedule name.");
				return;
			}

			const existing = await AsyncStorage.getItem(STORAGE_KEY);

			const schedules: NudgeSchedule[] =
				existing
					? JSON.parse(existing)
					: [];

			schedules.push(schedule);

			await AsyncStorage.setItem(
				STORAGE_KEY,
				JSON.stringify(schedules),
			);

			router.back();
		} catch {
			Alert.alert("Error", "Failed to save schedule.");
		}
	};

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: colors.background,
			}}
		>
			{/* TOP BAR */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingHorizontal: 24,
					paddingTop: 20,
					paddingBottom: 16,
				}}
			>
				<Pressable
					onPress={handleCancel}
					hitSlop={8}
				>
					<Text
						style={{
							color: colors.textSecondary,
							fontSize: 16,
							fontWeight: "600",
						}}
					>
						Cancel
					</Text>
				</Pressable>

				<Pressable
					onPress={handleSave}
					hitSlop={8}
				>
					<Text
						style={{
							color: colors.accent,
							fontSize: 16,
							fontWeight: "700",
						}}
					>
						Save
					</Text>
				</Pressable>
			</View>

			{/* CONTENT */}
			<View
				style={{
					paddingHorizontal: 24,
				}}
			>
				<ScheduleEditor
					schedule={schedule}
					onChange={setSchedule}
				/>
			</View>
		</View>
	);
};

export default NewScheduleScreen;
