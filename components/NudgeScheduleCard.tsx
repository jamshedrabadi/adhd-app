import {
	View,
	Text,
	Switch,
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

type Props = {
	schedule: NudgeSchedule;
	index: number;
	onUpdate: (updated: NudgeSchedule) => void;
};

export const NudgeScheduleCard = ({
	schedule,
	index,
	onUpdate,
}: Props) => {
	const [collapsed, setCollapsed] = useState(
		!schedule.enabled,
	);
	const [contentHeight, setContentHeight] =
		useState(0);

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
				borderColor: colors.border,
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
							schedule.name ||
							`Schedule ${index + 1}`
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

				{/* RIGHT: Chevron */}
				<Pressable
					onPress={toggleCollapse}
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

			{/* COLLAPSIBLE BODY */}
			<Animated.View
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
					<Text
						style={{
							color: colors.textSecondary,
						}}
					>
						Start Time
					</Text>

					<TextInput
						value={schedule.startTime}
						onChangeText={(text) =>
							onUpdate({
								...schedule,
								startTime: text,
							})
						}
						editable={schedule.enabled}
						placeholder="HH:MM"
						placeholderTextColor={
							colors.textSecondary
						}
						style={{
							borderBottomWidth: 1,
							borderColor: colors.border,
							color: colors.textPrimary,
							paddingVertical: 6,
						}}
					/>

					{/* END TIME */}
					<Text
						style={{
							color: colors.textSecondary,
							marginTop: 16,
						}}
					>
						End Time
					</Text>

					<TextInput
						value={schedule.endTime}
						onChangeText={(text) =>
							onUpdate({
								...schedule,
								endTime: text,
							})
						}
						editable={schedule.enabled}
						placeholder="HH:MM"
						placeholderTextColor={
							colors.textSecondary
						}
						style={{
							borderBottomWidth: 1,
							borderColor: colors.border,
							color: colors.textPrimary,
							paddingVertical: 6,
						}}
					/>

					{/* INTERVAL */}
					<Text
						style={{
							color: colors.textSecondary,
							marginTop: 16,
						}}
					>
						Nudge Interval (minutes)
					</Text>

					<TextInput
						value={schedule.nudgeInterval}
						onChangeText={(text) =>
							onUpdate({
								...schedule,
								nudgeInterval: text,
							})
						}
						editable={schedule.enabled}
						placeholder="10"
						placeholderTextColor={
							colors.textSecondary
						}
						style={{
							borderBottomWidth: 1,
							borderColor: colors.border,
							color: colors.textPrimary,
							paddingVertical: 6,
						}}
						keyboardType="numeric"
					/>

					{/* SOUND */}
					<Text
						style={{
							color: colors.textSecondary,
							marginTop: 16,
						}}
					>
						Sound
					</Text>

					<TextInput
						value={schedule.sound}
						onChangeText={(text) =>
							onUpdate({
								...schedule,
								sound: text,
							})
						}
						editable={schedule.enabled}
						placeholder="default"
						placeholderTextColor={
							colors.textSecondary
						}
						style={{
							borderBottomWidth: 1,
							borderColor: colors.border,
							color: colors.textPrimary,
							paddingVertical: 6,
						}}
					/>
				</View>
			</Animated.View>
		</View>
	);
};

export default NudgeScheduleCard;
