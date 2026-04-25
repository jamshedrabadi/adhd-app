import { View, Button, FlatList } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NudgeSchedule } from "../../../types/nudgeSchedule";
import { NudgeScheduleCard } from "../../../components/NudgeScheduleCard";
import { colors } from "../../../theme/theme";

const STORAGE_KEY = "NUDGE_SCHEDULES";

export const AttentionInterrupter = () => {
	const [nudgeSchedules, setNudgeSchedules] = useState<NudgeSchedule[]>([]);

	// Load on mount
	useEffect(() => {
		const loadNudgeSchedules = async () => {
			try {
				const data = await AsyncStorage.getItem(STORAGE_KEY);
				if (data) {
					setNudgeSchedules(JSON.parse(data));
				}
			} catch (error) {
				console.error("Error loading nudge schedules", error);
			}
		};

		loadNudgeSchedules();
	}, []);

	// Save whenever nudge schedules change
	useEffect(() => {
		const saveNudgeSchedules = async () => {
			try {
				await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nudgeSchedules));
			} catch (error) {
				console.error("Error saving nudge schedules", error);
			}
		};

		saveNudgeSchedules();
	}, [nudgeSchedules]);

	const addSchedule = () => {
		const newSchedule: NudgeSchedule = {
			id: Date.now().toString(),
			enabled: true,
			startTime: "13:00",
			endTime: "17:00",
			nudgeInterval: "10",
			sound: "default",
		};

		setNudgeSchedules((prev) => [...prev, newSchedule]);
	};

	const updateSchedule = (updated: NudgeSchedule) => {
		setNudgeSchedules((prev) =>
			prev.map((s) => (s.id === updated.id ? updated : s)),
		);
	};

	return (
		<View
			style={{
				flex: 1,
				padding: 24,
				backgroundColor: colors.background,
			}}
		>
			<View style={{ marginBottom: 12 }}>
				<Button title="Add Nudge Schedule" onPress={addSchedule} />
			</View>

			<FlatList
				data={nudgeSchedules}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					paddingTop: 12,
					paddingBottom: 24,
				}}
				ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
				renderItem={({ item, index }) => (
					<NudgeScheduleCard
						schedule={item}
						index={index}
						onUpdate={updateSchedule}
					/>
				)}
			/>
		</View>
	);
};

export default AttentionInterrupter;
