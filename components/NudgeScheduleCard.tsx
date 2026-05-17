import {
	View,
	Switch,
	Text,
	TextInput,
	Pressable,
	Alert,
} from "react-native";

import { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	Easing,
	interpolate,
} from "react-native-reanimated";

import { NudgeSchedule } from "../types/NudgeSchedule";
import { colors } from "../theme/theme";
import { TimeField } from "./TimeField";
import { IntervalSelector } from "./IntervalSelector";
import { SoundSelector } from "./SoundSelector";
import { validateSchedule } from "../utils/validateSchedule";

type Props = {
	schedule: NudgeSchedule;
	index: number;
	onUpdate: (updated: NudgeSchedule) => void;
	onDelete: (id: string) => void;
};

export const NudgeScheduleCard = ({
	schedule,
	index,
	onUpdate,
	onDelete,
}: Props) => {
	const [collapsed, setCollapsed] = useState(!schedule.enabled);
	const [contentHeight, setContentHeight] = useState(0);

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

	const validation = validateSchedule(schedule);

	const handleDelete = () => {
		Alert.alert(
			"Delete Schedule",
			`Are you sure you want to delete "${schedule.name}"?`,
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
							onUpdate({
								...schedule,
								enabled: false,
							});
						},
					},
				],
			);

			return;
		}

		onUpdate({
			...schedule,
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
				opacity: schedule.enabled ? 1 : 0.5, // dim when disabled
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
						value={schedule.enabled}
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
						value={
							schedule.name || `Schedule ${index + 1}`
						}
						onChangeText={(text) =>
							onUpdate({
								...schedule,
								name: text,
							})
						}
						placeholder={`Schedule ${index + 1}`}
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
						value={schedule.startTime}
						disabled={!schedule.enabled}
						onChange={(time) =>
							onUpdate({
								...schedule,
								startTime: time,
							})
						}
					/>

					{/* END TIME */}
					<TimeField
						label="End Time"
						value={schedule.endTime}
						disabled={!schedule.enabled}
						onChange={(time) =>
							onUpdate({
								...schedule,
								endTime: time,
							})
						}
					/>

					{/* INTERVAL */}
					<IntervalSelector
						value={schedule.nudgeInterval}
						disabled={!schedule.enabled}
						onChange={(value) =>
							onUpdate({
								...schedule,
								nudgeInterval: value,
							})
						}
					/>

					{/* SOUND */}
					<SoundSelector
						value={schedule.sound}
						disabled={!schedule.enabled}
						onChange={(value) =>
							onUpdate({
								...schedule,
								sound: value,
							})
						}
					/>
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
