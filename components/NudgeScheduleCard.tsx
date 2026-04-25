import { View, Text, Switch, TextInput, Pressable, Animated, Easing } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { NudgeSchedule } from "../types/nudgeSchedule";
import { colors } from "../theme/theme";

type Props = {
	schedule: NudgeSchedule;
	index: number;
	onUpdate: (updated: NudgeSchedule) => void;
};

export const NudgeScheduleCard = ({ schedule, index, onUpdate }: Props) => {
	const [collapsed, setCollapsed] = useState(!schedule.enabled);

	// Animated value (0 = collapsed, 1 = expanded)
	const animation = useRef(new Animated.Value(schedule.enabled ? 1 : 0)).current;

	// Animate when enabled changes
	useEffect(() => {
		const toValue = schedule.enabled ? 1 : 0;

		Animated.timing(animation, {
			toValue,
			duration: 250,
			easing: Easing.out(Easing.ease),
			useNativeDriver: false,
		}).start();

		setCollapsed(!schedule.enabled);
	}, [schedule.enabled, animation]);

	// Toggle manually
	const toggleCollapse = () => {
		const toValue = collapsed ? 1 : 0;

		Animated.timing(animation, {
			toValue,
			duration: 250,
			easing: Easing.out(Easing.ease),
			useNativeDriver: false,
		}).start();

		setCollapsed(!collapsed);
	};

	// Interpolated height
	const bodyHeight = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 260], // adjust if needed
	});

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
					}}
				>
					<Switch
						value={schedule.enabled}
						onValueChange={(value) =>
							onUpdate({ ...schedule, enabled: value })
						}
						trackColor={{
							false: colors.surfaceAlt,
							true: colors.accentMuted,
						}}
						thumbColor={schedule.enabled ? colors.accent : "#aaa"}
					/>

					<Text
						style={{
							color: colors.textPrimary,
							fontSize: 16,
							fontWeight: "600",
						}}
					>
						Schedule {index + 1}
					</Text>
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
						name={collapsed ? "chevron-down" : "chevron-up"}
						size={22}
						color={colors.textSecondary}
					/>
				</Pressable>
			</View>

			{/* ANIMATED BODY */}
			<Animated.View
				style={{
					overflow: "hidden",
					height: bodyHeight,
				}}
			>
				<View
					style={{
						paddingHorizontal: 16,
						paddingBottom: 16,
					}}
				>
					{/* Start Time */}
					<Text style={{ color: colors.textSecondary }}>Start Time</Text>
					<TextInput
						value={schedule.startTime}
						onChangeText={(text) =>
							onUpdate({ ...schedule, startTime: text })
						}
						editable={schedule.enabled}
						placeholder="HH:MM"
						placeholderTextColor={colors.textSecondary}
						style={{
							borderBottomWidth: 1,
							borderColor: colors.border,
							color: colors.textPrimary,
							paddingVertical: 4,
						}}
					/>

					{/* End Time */}
					<Text style={{ color: colors.textSecondary, marginTop: 12 }}>
						End Time
					</Text>
					<TextInput
						value={schedule.endTime}
						onChangeText={(text) =>
							onUpdate({ ...schedule, endTime: text })
						}
						editable={schedule.enabled}
						placeholder="HH:MM"
						placeholderTextColor={colors.textSecondary}
						style={{
							borderBottomWidth: 1,
							borderColor: colors.border,
							color: colors.textPrimary,
							paddingVertical: 4,
						}}
					/>

					{/* Interval */}
					<Text style={{ color: colors.textSecondary, marginTop: 12 }}>
						Interval (minutes)
					</Text>
					<TextInput
						value={schedule.interval}
						onChangeText={(text) =>
							onUpdate({ ...schedule, interval: text })
						}
						editable={schedule.enabled}
						placeholder="10"
						placeholderTextColor={colors.textSecondary}
						style={{
							borderBottomWidth: 1,
							borderColor: colors.border,
							color: colors.textPrimary,
							paddingVertical: 4,
						}}
						keyboardType="numeric"
					/>

					{/* Sound */}
					<Text style={{ color: colors.textSecondary, marginTop: 12 }}>
						Sound
					</Text>
					<TextInput
						value={schedule.sound}
						onChangeText={(text) =>
							onUpdate({ ...schedule, sound: text })
						}
						editable={schedule.enabled}
						placeholder="default"
						placeholderTextColor={colors.textSecondary}
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
