import {
	View,
	Text,
	Pressable,
	Alert,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
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
import { validateSchedule } from "../../../utils/validateSchedule";
import { STORAGE_KEYS } from "../../../constants/storage";
import { generateId } from "../../../utils/id";

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
			id: generateId(),
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
				const data = await AsyncStorage.getItem(STORAGE_KEYS.NUDGE_SCHEDULES);

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

		const validation = validateSchedule(schedule);

		if (!validation.valid) {
			Alert.alert( "Invalid Schedule",
				validation.message ?? "Invalid schedule.",
			);

			return;
		}

		try {
			const data = await AsyncStorage.getItem(STORAGE_KEYS.NUDGE_SCHEDULES);

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
				STORAGE_KEYS.NUDGE_SCHEDULES,
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
							const data = await AsyncStorage.getItem(STORAGE_KEYS.NUDGE_SCHEDULES);

							if (!data) {
								return;
							}

							const schedules: NudgeSchedule[] = JSON.parse(data);

							const filtered = schedules.filter(
								(item) =>
									item.id !== schedule.id,
							);

							await AsyncStorage.setItem(
								STORAGE_KEYS.NUDGE_SCHEDULES,
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
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={
				Platform.OS === "ios"
					? "padding"
					: undefined
			}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: colors.background,
				}}
			>
				<ScrollView
					keyboardDismissMode="on-drag"
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{
						paddingHorizontal: 20,
						paddingTop: 20,
						paddingBottom: 140,
					}}
				>
					<ScheduleEditor
						schedule={schedule}
						onChange={setSchedule}
					/>
				</ScrollView>

				{/* BOTTOM ACTION BAR */}
				<View
					style={{
						flexDirection: "row",
						gap: 12,
						paddingHorizontal: 20,
						paddingTop: 16,
						paddingBottom: 28,
						borderTopWidth: 1,
						borderTopColor: colors.border,
						backgroundColor: colors.background,
					}}
				>
					<Pressable
						onPress={handleCancel}
						android_ripple={{
							color: "rgba(255,255,255,0.08)",
						}}
						style={({ pressed }) => ({
							flex: 1,
							height: 52,
							borderRadius: 14,
							borderWidth: 1,
							borderColor: colors.border,
							backgroundColor: pressed
								? colors.surfaceAlt
								: colors.surface,
							justifyContent: "center",
							alignItems: "center",
							overflow: "hidden",
						})}
					>
						<Text
							style={{
								color: colors.textPrimary,
								fontSize: 15,
								fontWeight: "600",
							}}
						>
							Cancel
						</Text>
					</Pressable>

					<Pressable
						onPress={handleSave}
						android_ripple={{
							color: "rgba(255,255,255,0.10)",
						}}
						disabled={!isValid}
						style={({ pressed }) => ({
							flex: 1,
							height: 52,
							borderRadius: 14,
							backgroundColor: pressed
								? colors.accentMuted
								: isValid
									? colors.accent
									: colors.surfaceAlt,
							justifyContent: "center",
							alignItems: "center",
							overflow: "hidden",
							opacity: !isValid ? 0.5 : 1,
						})}
					>
						<Text
							style={{
								color: "#FFFFFF",
								fontSize: 15,
								fontWeight: "700",
							}}
						>
							Save
						</Text>
					</Pressable>

					{isEditing && (
						<Pressable
							onPress={handleDelete}
							android_ripple={{
								color: "rgba(255,255,255,0.08)",
							}}
							style={({ pressed }) => ({
								width: 52,
								height: 52,
								borderRadius: 14,
								borderWidth: 1,
								borderColor: colors.warning,
								backgroundColor: pressed
									? colors.surfaceAlt
									: "transparent",
								justifyContent: "center",
								alignItems: "center",
								overflow: "hidden",
							})}
						>
							<Ionicons
								name="trash-outline"
								size={20}
								color={
									colors.warning
								}
							/>
						</Pressable>
					)}
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default ScheduleEditorScreen;
