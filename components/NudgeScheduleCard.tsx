import { View, Text, Switch, TextInput, Pressable, Animated, Easing, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

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
	const [collapsed, setCollapsed] = useState(!schedule.enabled);
	const [editingName, setEditingName] = useState(false);

	// Animated value (0 = collapsed, 1 = expanded)
	const animation = useRef(
		new Animated.Value(collapsed ? 0 : 1),
	).current;

	// Animate when enabled changes
	useEffect(() => {
		Animated.timing(animation, {
			toValue: collapsed ? 0 : 1,
			duration: 220,
			easing: Easing.out(Easing.ease),
			useNativeDriver: true,
		}).start();
	}, [collapsed, animation]);

	// Toggle manually
	const toggleCollapse = () => {
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
					<Animated.View
						style={{
							transform: [
								{
									rotate: animation.interpolate({
										inputRange: [0, 1],
										outputRange: ["0deg", "180deg"],
									}),
								},
							],
						}}
					>
						<Ionicons
							name="chevron-down"
							size={22}
							color={colors.textSecondary}
						/>
					</Animated.View>
				</Pressable>
			</View>

			{/* ANIMATED BODY */}
			<Animated.View
				style={{
					opacity: animation,
					transform: [
						{
							translateY: animation.interpolate({
								inputRange: [0, 1],
								outputRange: [-10, 0],
							}),
						},
					],
					maxHeight: collapsed ? 0 : 500,
					overflow: "hidden",
				}}
			>
				<View
					style={{
						paddingHorizontal: 16,
						paddingBottom: 16,
					}}
				>
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

					{/* End Time */}
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

					{/* Nudge Interval */}
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

					{/* Sound */}
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
				</View>
			</Animated.View>
		</View>
	);
};

export default NudgeScheduleCard;
