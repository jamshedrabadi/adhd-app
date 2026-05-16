import {
	View,
	Text,
	Switch,
	TextInput,
	Pressable,
	Animated,
	Alert,
	LayoutAnimation,
	Platform,
	UIManager,
} from "react-native";

import { useEffect, useRef, useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { NudgeSchedule } from "../types/NudgeSchedule";
import { colors } from "../theme/theme";

// Enable LayoutAnimation on Android
if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(
		true,
	);
}

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

	const [editingName, setEditingName] =
		useState(false);

	// Fade animation
	const fadeAnim = useRef(
		new Animated.Value(collapsed ? 0 : 1),
	).current;

	// Animate collapse/expand
	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: collapsed ? 0 : 1,
			duration: 180,
			useNativeDriver: true,
		}).start();
	}, [collapsed, fadeAnim]);

	const toggleCollapse = () => {
		LayoutAnimation.configureNext(
			LayoutAnimation.Presets.easeInEaseOut,
		);

		setCollapsed((prev) => !prev);
	};

	return (
		<View
			style={{
				marginVertical: 8,
				backgroundColor: colors.surface,
				borderRadius: 12,
				borderWidth: 1,
				borderColor: colors.border,
				opacity: schedule.enabled ? 1 : 0.5, // dim when disabled
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
						gap: 10,
						flex: 1,
					}}
				>
					<Switch
						value={schedule.enabled}
						onValueChange={(value) => {
							if (!value) {
								Alert.alert(
									"Disable Schedule?",
									"Nudges from this schedule will stop.",
									[
										{
											text: "Cancel",
											style: "cancel",
										},
										{
											text: "Disable",
											style: "destructive",
											onPress: () =>
												onUpdate({
													...schedule,
													enabled: false,
												}),
										},
									],
								);

								return;
							}

							onUpdate({
								...schedule,
								enabled: true,
							});
						}}
						trackColor={{
							false: colors.surfaceAlt,
							true: colors.accentMuted,
						}}
						thumbColor={
							schedule.enabled
								? colors.accent
								: "#aaa"
						}
					/>

					{editingName ? (
						<TextInput
							value={schedule.name}
							onChangeText={(text) =>
								onUpdate({
									...schedule,
									name: text,
								})
							}
							onBlur={() =>
								setEditingName(false)
							}
							autoFocus
							style={{
								color: colors.textPrimary,
								fontSize: 16,
								fontWeight: "600",
								borderBottomWidth: 1,
								borderColor: colors.border,
								minWidth: 140,
								paddingVertical: 2,
							}}
						/>
					) : (
						<Pressable
							onPress={() =>
								setEditingName(true)
							}
						>
							<Text
								style={{
									color: colors.textPrimary,
									fontSize: 16,
									fontWeight: "600",
								}}
							>
								{schedule.name}
							</Text>
						</Pressable>
					)}
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
					<Ionicons
						name={
							collapsed
								? "chevron-down"
								: "chevron-up"
						}
						size={22}
						color={
							colors.textSecondary
						}
					/>
				</Pressable>
			</View>

			{/* COLLAPSIBLE BODY */}
			{!collapsed && (
				<Animated.View
					style={{
						opacity: fadeAnim,
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
							paddingVertical: 4,
						}}
					/>

					{/* END TIME */}
					<Text
						style={{
							color: colors.textSecondary,
							marginTop: 12,
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
							paddingVertical: 4,
						}}
					/>

					{/* INTERVAL */}
					<Text
						style={{
							color: colors.textSecondary,
							marginTop: 12,
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
							paddingVertical: 4,
						}}
						keyboardType="numeric"
					/>

					{/* SOUND */}
					<Text
						style={{
							color: colors.textSecondary,
							marginTop: 12,
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
							paddingVertical: 4,
						}}
					/>
				</Animated.View>
			)}
		</View>
	);
};

export default NudgeScheduleCard;
