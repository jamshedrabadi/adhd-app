import {
	View,
	Button,
	FlatList,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	Platform,
} from "react-native";

import { useEffect, useRef, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import debounce from "lodash.debounce";

import { NudgeSchedule } from "../../../types/NudgeSchedule";
import { NudgeScheduleCard } from "../../../components/NudgeScheduleCard";
import { colors } from "../../../theme/theme";

const STORAGE_KEY = "NUDGE_SCHEDULES";

export const AttentionInterrupter = () => {
	const [nudgeSchedules, setNudgeSchedules] = useState<
		NudgeSchedule[]
	>([]);

	// Load schedules
	useEffect(() => {
		const loadNudgeSchedules = async () => {
			try {
				const data = await AsyncStorage.getItem(
					STORAGE_KEY,
				);

				if (data) {
					const parsedSchedules =
						JSON.parse(data);

					const schedulesWithNames =
						parsedSchedules.map(
							(
								schedule: NudgeSchedule,
								index: number,
							) => ({
								...schedule,
								name: schedule.name ?? `Schedule ${index + 1}`,
							}),
						);

					setNudgeSchedules(
						schedulesWithNames,
					);
				}
			} catch (error) {
				console.error(
					"Error loading schedules",
					error,
				);
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
				console.error(
					"Error saving schedules",
					error,
				);
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
			name: `Schedule ${nudgeSchedules.length + 1}`,
			enabled: true,
			startTime: "13:00",
			endTime: "17:00",
			nudgeInterval: "10",
			sound: "default",
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

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={
				Platform.OS === "ios"
					? "padding"
					: "height"
			}
		>
			<TouchableWithoutFeedback
				onPress={Keyboard.dismiss}
			>
				<View
					style={{
						flex: 1,
						padding: 24,
						backgroundColor:
							colors.background,
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
							index,
						}) => (
							<NudgeScheduleCard
								schedule={item}
								index={index}
								onUpdate={
									updateSchedule
								}
							/>
						)}
					/>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default AttentionInterrupter;
