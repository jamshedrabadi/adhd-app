import {
	View,
	Text,
	Pressable,
	Alert,
} from "react-native";

import {
	useEffect,
	useMemo,
	useState,
} from "react";

import {
	useLocalSearchParams,
	useRouter,
} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

import { ScheduleEditor } from "../../../components/ScheduleEditor";

import { NudgeSchedule } from "../../../types/NudgeSchedule";

import { useTheme } from "../../../theme/ThemeProvider";

const STORAGE_KEY = "NUDGE_SCHEDULES";

export const ScheduleEditorScreen = () => {
	const router = useRouter();

	const { scheduleId } =
		useLocalSearchParams<{
			scheduleId?: string;
		}>();

	const isEditing = !!scheduleId;

	const { colors } = useTheme();

	const [schedule, setSchedule] =
		useState<NudgeSchedule>({
			id: Date.now().toString(),
			name: "",
			enabled: true,
			startTime: "09:00",
			endTime: "17:00",
			nudgeInterval: 10,
			sound: "soft-chime",
		});

	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const loadSchedule = async () => {
			if (!scheduleId) {
				setLoaded(true);
				return;
			}

			try {
				const data = await AsyncStorage.getItem(STORAGE_KEY);

				if (!data) {
					setLoaded(true);
					return;
				}

				const schedules: NudgeSchedule[] = JSON.parse(data);

				const foundSchedule = schedules.find(
					(item) =>
						item.id === scheduleId,
				);

				if (foundSchedule) {
					setSchedule(foundSchedule);
				}
			} catch (error) {
				console.error("Failed to load schedule", error);
			} finally {
				setLoaded(true);
			}
		};

		loadSchedule();
	}, [scheduleId]);

	const isValid = useMemo(() => {
		return (
			schedule.name.trim().length > 0
		);
	}, [schedule]);

	const handleCancel = () => {
		router.back();
	};

	const handleSave = async () => {
		if (!schedule.name.trim()) {
			Alert.alert("Missing Schedule Name", "Please enter a schedule name.");

			return;
		}

		try {
			const data = await AsyncStorage.getItem(STORAGE_KEY);

			const schedules: NudgeSchedule[] =
				data
					? JSON.parse(data)
					: [];

			let updatedSchedules: | NudgeSchedule[];

			if (isEditing) {
				updatedSchedules = schedules.map(
					(item) =>
						item.id === schedule.id
							? schedule
							: item,
				);
			} else {
				updatedSchedules = [
					...schedules,
					schedule,
				];
			}

			await AsyncStorage.setItem(
				STORAGE_KEY,
				JSON.stringify(updatedSchedules),
			);

			router.back();
		} catch (error) {
			console.error("Failed to save schedule", error);

			Alert.alert("Error", "Failed to save schedule.");
		}
	};

	const handleDelete = () => {
		if (!isEditing) {
			return;
		}

		Alert.alert(
			"Delete Schedule",
			`Delete "${schedule.name}"?`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							const data = await AsyncStorage.getItem(STORAGE_KEY);

							if (!data) {
								return;
							}

							const schedules: NudgeSchedule[] = JSON.parse(data);

							const filtered = schedules.filter(
								(item) =>
									item.id !== schedule.id,
							);

							await AsyncStorage.setItem(
								STORAGE_KEY,
								JSON.stringify(filtered),
							);

							router.back();
						} catch {
							Alert.alert("Error", "Failed to delete schedule.");
						}
					},
				},
			],
		);
	};

	if (!loaded) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: colors.background,
				}}
			/>
		);
	}

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
					style={{
						paddingVertical: 8,
					}}
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

				<Text
					style={{
						color: colors.textPrimary,
						fontSize: 18,
						fontWeight: "700",
					}}
				>
					{isEditing
						? "Edit Schedule"
						: "New Schedule"}
				</Text>

				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 18,
					}}
				>
					{isEditing && (
						<Pressable
							onPress={handleDelete}
							hitSlop={8}
							style={{
								paddingVertical: 8,
							}}
						>
							<Ionicons
								name="trash-outline"
								size={22}
								color={
									colors.warning
								}
							/>
						</Pressable>
					)}

					<Pressable
						onPress={handleSave}
						hitSlop={8}
						disabled={!isValid}
						style={{
							paddingVertical: 8,
						}}
					>
						<Text
							style={{
								color: isValid
									? colors.accent
									: colors.textSecondary,
								fontSize: 16,
								fontWeight: "700",
							}}
						>
							Save
						</Text>
					</Pressable>
				</View>
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

export default ScheduleEditorScreen;
