import {
	View,
	Button,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";

import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import { useRouter, useFocusEffect } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import debounce from "lodash.debounce";

import { NudgeSchedule } from "../../../types/NudgeSchedule";
import { NudgeScheduleCard } from "../../../components/NudgeScheduleCard";
import { useTheme } from "../../../theme/ThemeProvider";
import { sendTestNotification } from "../../../utils/notifications";

const STORAGE_KEY = "NUDGE_SCHEDULES";

export const AttentionInterrupter = () => {
	const router = useRouter();

	const { colors } = useTheme();

	const [nudgeSchedules, setNudgeSchedules] =
		useState<NudgeSchedule[]>([]);

	// Load schedules
	const loadNudgeSchedules = useCallback(async () => {
		try {
			const data = await AsyncStorage.getItem(STORAGE_KEY);

			if (!data) {
				setNudgeSchedules([]);
				return;
			}

			const parsedSchedules = JSON.parse(data);

			const normalizedSchedules: NudgeSchedule[] = parsedSchedules.map(
				(
					schedule: Partial<NudgeSchedule>,
				) => ({
					id:
						schedule.id ??
						Date.now().toString(),
					name:
						schedule.name ??
						"New Schedule",
					enabled:
						schedule.enabled ?? true,
					startTime:
						schedule.startTime ??
						"13:00",
					endTime:
						schedule.endTime ??
						"17:00",
					nudgeInterval:
						schedule.nudgeInterval ??
						10,
					sound:
						schedule.sound ??
						"soft-chime",
				}),
			);

			setNudgeSchedules(normalizedSchedules);
		} catch (error) {
			console.error(
				"Error loading schedules",
				error,
			);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			loadNudgeSchedules();
		}, [loadNudgeSchedules]),
	);

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
						flexDirection: "row",
						gap: 12,
						marginBottom: 12,
					}}
				>
					<View style={{ flex: 1 }}>
						<Button
							title="Add Nudge Schedule"
							onPress={() =>
								router.push(
									"/(features)/attention-interrupter/new",
								)
							}
						/>
					</View>

					<View style={{ flex: 1 }}>
						<Button
							title="Send Test Nudge"
							onPress={async () => {
								try {
									await sendTestNotification();
								} catch (error) {
									console.error("Notification error", error);
								}
							}}
						/>
					</View>
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
							onToggleEnabled={async () => {
								const targetSchedule =
									nudgeSchedules.find((schedule) =>
										schedule.id === item.id,
									);

								if (!targetSchedule) {
									return;
								}

								const nextEnabledState = !targetSchedule.enabled;

								const performToggle = async () => {
									try {
										const updatedSchedules = nudgeSchedules.map(
											(schedule) =>
												schedule.id === item.id
													? {
														...schedule,
														enabled: nextEnabledState,
													}
													: schedule,
										);

										setNudgeSchedules(updatedSchedules);

										await AsyncStorage.setItem(
											STORAGE_KEY,
											JSON.stringify(updatedSchedules),
										);
									} catch (error) {
										console.error("Failed to toggle schedule", error);
									}
								};

								if (!nextEnabledState) {
									Alert.alert(
										"Disable Schedule",
										`Disable "${targetSchedule.name}"?`,
										[
											{
												text: "Cancel",
												style: "cancel",
											},
											{
												text: "Disable",
												style: "destructive",
												onPress: performToggle,
											},
										],
									);

									return;
								}

								await performToggle();
							}}
							onPress={() =>
								router.push({
									pathname:
										"/(features)/attention-interrupter/edit/[scheduleId]",
									params: {
										scheduleId: item.id,
									},
								})
							}
						/>
					)}
				/>
			</View>
		</KeyboardAvoidingView>
	);
};

export default AttentionInterrupter;
