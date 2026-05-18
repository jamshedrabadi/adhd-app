import {
	View,
	Button,
	FlatList,
	KeyboardAvoidingView,
	Platform,
} from "react-native";

import { useEffect, useRef, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import debounce from "lodash.debounce";

import { NudgeSchedule } from "../../../types/NudgeSchedule";
import { NudgeScheduleCard } from "../../../components/NudgeScheduleCard";
import { useTheme } from "../../../theme/ThemeProvider";

const STORAGE_KEY = "NUDGE_SCHEDULES";

export const AttentionInterrupter = () => {
	const { colors } = useTheme();

	const [nudgeSchedules, setNudgeSchedules] = useState<
		NudgeSchedule[]
	>([]);

	// Load schedules
	useEffect(() => {
		const loadNudgeSchedules = async () => {
			try {
				const data = await AsyncStorage.getItem(STORAGE_KEY);

				if (data) {
					const parsedSchedules = JSON.parse(data);

					const normalizedSchedules: NudgeSchedule[] = parsedSchedules.map(
						(
							schedule: Partial<NudgeSchedule>,
						) => ({
							id:
								schedule.id ?? Date.now().toString(),
							name:
								schedule.name ?? "New Schedule",
							enabled:
								schedule.enabled ?? true,
							startTime:
								schedule.startTime ?? "13:00",
							endTime:
								schedule.endTime ?? "17:00",
							nudgeInterval:
								schedule.nudgeInterval ?? 10,
							sound:
								schedule.sound ?? "soft-chime",
						}),
					);

					setNudgeSchedules(normalizedSchedules);
				}
			} catch (error) {
				console.error("Error loading schedules", error);
			}
		};

		loadNudgeSchedules();
	}, []);

	// Debounced save
	const debouncedSave = useRef(
		debounce(async (value: NudgeSchedule[]) => {
			try {
				await AsyncStorage.setItem(
					STORAGE_KEY,
					JSON.stringify(value),
				);
			} catch (error) {
				console.error("Error saving schedules", error);
			}
		}, 500),
	).current;

	useEffect(() => {
		debouncedSave(nudgeSchedules);

		return () => {
			debouncedSave.cancel();
		};
	}, [nudgeSchedules, debouncedSave]);

	const addSchedule = () => {
		const newSchedule: NudgeSchedule = {
			id: Date.now().toString(),
			name: "New Schedule",
			enabled: true,
			startTime: "13:00",
			endTime: "17:00",
			nudgeInterval: 10,
			sound: "soft-chime",
		};

		setNudgeSchedules((prev) => [
			...prev,
			newSchedule,
		]);
	};

	const updateSchedule = (
		updated: NudgeSchedule,
	) => {
		setNudgeSchedules((prev) =>
			prev.map((schedule) =>
				schedule.id === updated.id
					? updated
					: schedule,
			),
		);
	};

	const deleteSchedule = (id: string) => {
		setNudgeSchedules((prev) =>
			prev.filter((schedule) => schedule.id !== id),
		);
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={
				Platform.OS === "ios"
					? "padding"
					: "height"
			}
		>
			<View
				style={{
					flex: 1,
					padding: 24,
					backgroundColor: colors.background,
				}}
			>
				<View
					style={{
						marginBottom: 12,
					}}
				>
					<Button
						title="Add Nudge Schedule"
						onPress={addSchedule}
					/>
				</View>

				<FlatList
					data={nudgeSchedules}
					keyboardDismissMode="on-drag"
					keyExtractor={(item) =>
						item.id
					}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{
						paddingTop: 12,
						paddingBottom: 120,
					}}
					ItemSeparatorComponent={() => (
						<View
							style={{
								height: 8,
							}}
						/>
					)}
					renderItem={({
						item,
					}) => (
						<NudgeScheduleCard
							schedule={item}
							onUpdate={updateSchedule}
							onDelete={deleteSchedule}
						/>
					)}
				/>
			</View>
		</KeyboardAvoidingView>
	);
};

export default AttentionInterrupter;
