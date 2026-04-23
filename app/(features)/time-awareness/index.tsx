import { View, Button, FlatList } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Schedule } from "../../../types/schedule";
import { ScheduleCard } from "../../../components/ScheduleCard";

const STORAGE_KEY = "SCHEDULES";

export const TimeAwareness = () => {
	const [schedules, setSchedules] = useState<Schedule[]>([]);

	// Load on mount
	useEffect(() => {
		const loadSchedules = async () => {
			try {
				const data = await AsyncStorage.getItem(STORAGE_KEY);
				if (data) {
					setSchedules(JSON.parse(data));
				}
			} catch (error) {
				console.error("Error loading schedules", error);
			}
		};

		loadSchedules();
	}, []);

	// Save whenever schedules change
	useEffect(() => {
		const saveSchedules = async () => {
			try {
				await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
			} catch (error) {
				console.error("Error saving schedules", error);
			}
		};

		saveSchedules();
	}, [schedules]);

	const addSchedule = () => {
		const newSchedule: Schedule = {
			id: Date.now().toString(),
			enabled: true,
			startTime: "13:00",
			endTime: "17:00",
			interval: "10",
			sound: "default",
		};

		setSchedules((prev) => [...prev, newSchedule]);
	};

	const updateSchedule = (updated: Schedule) => {
		setSchedules((prev) =>
			prev.map((s) => (s.id === updated.id ? updated : s)),
		);
	};

	return (
		<View style={{ flex: 1, padding: 20 }}>
			<Button title="Add Schedule" onPress={addSchedule} />

			<FlatList
				data={schedules}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<ScheduleCard
						schedule={item}
						onUpdate={updateSchedule}
					/>
				)}
			/>
		</View>
	);
};

export default TimeAwareness;
