import {
	View,
	Switch,
	Text,
	TextInput,
	Pressable,
	Alert,
} from "react-native";

import {
	useEffect,
	useMemo,
	useState,
} from "react";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	Easing,
	interpolate,
} from "react-native-reanimated";

import { NudgeSchedule } from "../types/NudgeSchedule";
import { useTheme } from "../theme/ThemeProvider";
import { TimeField } from "./TimeField";
import { IntervalInput } from "./IntervalInput";
import { SoundSelector } from "./SoundSelector";
import { validateSchedule } from "../utils/validateSchedule";
import { generateTriggers } from "../utils/generateTriggers";

type Props = {
	schedule: NudgeSchedule;
	onUpdate: (updated: NudgeSchedule) => void;
	onDelete: (id: string) => void;
};

export const NudgeScheduleCard = ({
	schedule,
	onUpdate,
	onDelete,
}: Props) => {
	const { colors } = useTheme();

	const [collapsed, setCollapsed] = useState(!schedule.enabled);
	const [contentHeight, setContentHeight] = useState(0);
	const [draftSchedule, setDraftSchedule] = useState(schedule);

	const progress = useSharedValue(
		schedule.enabled ? 1 : 0,
	);

	// Sync collapse state with enabled state
	useEffect(() => {
		progress.value = withTiming(
			collapsed ? 0 : 1,
			{
				duration: 250,
				easing: Easing.out(Easing.ease),
			});
	}, [collapsed, progress]);

	useEffect(() => {
		setDraftSchedule(schedule);
	}, [schedule]);

	const toggleCollapse = () => {
		setCollapsed((prev) => !prev);
	};

	const animatedBodyStyle = useAnimatedStyle(() => {
		return {
			height: interpolate(
				progress.value,
				[0, 1],
				[0, contentHeight],
			),
			opacity: progress.value,
		};
	});

	const animatedChevronStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotate: `${interpolate(
						progress.value,
						[0, 1],
						[0, 180],
					)}deg`,
				},
			],
		};
	});

	const validation = validateSchedule(draftSchedule);

	const triggers = generateTriggers(draftSchedule);

	const isDirty = useMemo(() => {
		return (
			JSON.stringify(draftSchedule) !== JSON.stringify(schedule)
		);
	}, [draftSchedule, schedule]);

	const handleDelete = () => {
		Alert.alert(
			"Delete Schedule",
			`Are you sure you want to delete "${draftSchedule.name}"?`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						onDelete(schedule.id);
					},
				},
			],
		);
	};

	const handleSave = () => {
		onUpdate(draftSchedule);
	};

	const handleCancel = () => {
		setDraftSchedule(schedule);
	};

	const handleEnabledToggle = (value: boolean) => {
		if (!value) {
			Alert.alert(
				"Disable Schedule",
				"Are you sure you want to disable this nudge schedule?",
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "Disable",
						style: "destructive",
						onPress: () => {
							setDraftSchedule({
								...draftSchedule,
								enabled: false,
							});
						},
					},
				],
			);

			return;
		}

		setDraftSchedule({
			...draftSchedule,
			enabled: true,
		});
	};

	return (
		<View
			style={{
				backgroundColor: colors.surface,
				borderRadius: 12,
				borderWidth: 1,
				borderColor: validation.valid
					? colors.border
					: colors.warning,
				opacity: draftSchedule.enabled ? 1 : 0.5, // dim when disabled
				overflow: "hidden",
			}}
		>
			{/* HEADER */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					padding: 16,
				}}
			>
				{/* LEFT: Switch + Title */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 12,
						flex: 1,
					}}
				>
					<Switch
						value={draftSchedule.enabled}
						onValueChange={handleEnabledToggle}
						trackColor={{
							false: colors.surfaceAlt,
							true: colors.accentMuted,
						}}
						thumbColor={
							schedule.enabled
								? colors.accent
								: "#999"
						}
					/>

					<TextInput
						value={draftSchedule.name}
						onChangeText={(text) =>
							setDraftSchedule({
								...draftSchedule,
								name: text,
							})
						}
						placeholder="New Schedule"
						placeholderTextColor={
							colors.textSecondary
						}
						style={{
							color: colors.textPrimary,
							fontSize: 16,
							fontWeight: "600",
							flex: 1,
							paddingVertical: 0,
						}}
					/>
				</View>

				{/* RIGHT ACTIONS */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					{/* DELETE */}
					<Pressable
						onPress={handleDelete}
						hitSlop={8}
						android_disableSound
						style={{
							width: 44,
							height: 44,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Ionicons
							name="trash-outline"
							size={20}
							color={colors.warning}
						/>
					</Pressable>

					{/* CHEVRON */}
					<Pressable
						onPress={toggleCollapse}
						hitSlop={8}
						style={{
							width: 44,
							height: 44,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Animated.View
							style={animatedChevronStyle}
						>
							<Ionicons
								name="chevron-down"
								size={22}
								color={
									colors.textSecondary
								}
							/>
						</Animated.View>
					</Pressable>
				</View>
			</View>

			{/* COLLAPSIBLE BODY */}
			<Animated.View
				pointerEvents={
					collapsed
						? "none"
						: "auto"
				}
				style={[
					{
						overflow: "hidden",
					},
					animatedBodyStyle,
				]}
			>
				<View
					onLayout={(event) => {
						setContentHeight(
							event.nativeEvent.layout.height,
						);
					}}
					style={{
						position: "absolute",
						width: "100%",
						paddingHorizontal: 16,
						paddingBottom: 16,
					}}
				>
					{/* START TIME */}
					<TimeField
						label="Start Time"
						value={draftSchedule.startTime}
						disabled={!draftSchedule.enabled}
						onChange={(time) =>
							setDraftSchedule({
								...draftSchedule,
								startTime: time,
							})
						}
					/>

					{/* END TIME */}
					<TimeField
						label="End Time"
						value={draftSchedule.endTime}
						disabled={!draftSchedule.enabled}
						onChange={(time) =>
							setDraftSchedule({
								...draftSchedule,
								endTime: time,
							})
						}
					/>

					{/* INTERVAL */}
					<IntervalInput
						value={draftSchedule.nudgeInterval}
						disabled={!draftSchedule.enabled}
						onChange={(value) =>
							setDraftSchedule({
								...draftSchedule,
								nudgeInterval: value,
							})
						}
					/>

					{/* SOUND */}
					<SoundSelector
						value={draftSchedule.sound}
						disabled={!draftSchedule.enabled}
						onChange={(value) =>
							setDraftSchedule({
								...draftSchedule,
								sound: value,
							})
						}
					/>

					{isDirty && (
						<View
							style={{
								flexDirection: "row",
								gap: 12,
								marginTop: 20,
							}}
						>
							<Pressable
								onPress={handleCancel}
								style={{
									flex: 1,
									paddingVertical: 14,
									borderRadius: 12,
									borderWidth: 1,
									borderColor: colors.border,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										color: colors.textPrimary,
										fontWeight: "600",
									}}
								>
									Cancel
								</Text>
							</Pressable>

							<Pressable
								onPress={handleSave}
								disabled={!validation.valid}
								style={{
									flex: 1,
									paddingVertical: 14,
									borderRadius: 12,
									backgroundColor: validation.valid
										? colors.accent
										: colors.surfaceAlt,
									justifyContent: "center",
									alignItems: "center",
									opacity: validation.valid ? 1 : 0.5,
								}}
							>
								<Text
									style={{
										color: "white",
										fontWeight: "700",
									}}
								>
									Save Changes
								</Text>
							</Pressable>
						</View>
					)}

					{/* GENERATED NUDGES */}
					<View
						style={{
							marginTop: 20,
						}}
					>
						<Text
							style={{
								color: colors.textSecondary,
								fontSize: 13,
								marginBottom: 6,
							}}
						>
							Generated Nudges
						</Text>

						<Text
							style={{
								color: colors.textPrimary,
								fontSize: 14,
								lineHeight: 22,
							}}
						>
							{triggers.join(", ")}
						</Text>
					</View>
				</View>
			</Animated.View>

			{!validation.valid && (
				<View
					style={{
						paddingHorizontal: 16,
						paddingBottom: 16,
					}}
				>
					<Text
						style={{
							color: colors.warning,
							fontSize: 13,
						}}
					>
						{validation.message}
					</Text>
				</View>
			)}
		</View>
	);
};

export default NudgeScheduleCard;
