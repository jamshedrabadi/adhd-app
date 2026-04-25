import { View, Text, Switch, TextInput, Pressable, LayoutAnimation, Platform, UIManager } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Schedule } from "../types/schedule";
import { colors } from "../theme/theme";

// Enable LayoutAnimation on Android
if (Platform.OS === "android") {
	UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = {
	schedule: Schedule;
	index: number;
	onUpdate: (updated: Schedule) => void;
};

export const ScheduleCard = ({ schedule, index, onUpdate }: Props) => {
	// Default: collapsed if disabled
	const [collapsed, setCollapsed] = useState(!schedule.enabled);

	// Auto collapse/expand when enabled changes
	useEffect(() => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setCollapsed(!schedule.enabled);
	}, [schedule.enabled]);

	const toggleCollapse = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

			{/* BODY */}
			{!collapsed && (
				<View style={{
					paddingHorizontal: 16,
					paddingBottom: 16,
				}}>
					{/* Start Time */}
					<View
						key={"startTime"}
						style={{ marginTop: 12 }}
					>
						<Text
							style={{
								color: colors.textSecondary,
								marginBottom: 4,
							}}
						>
							Start Time
						</Text>

						<TextInput
							value={schedule.startTime}
							onChangeText={(text) =>
								onUpdate({ ...schedule, startTime: text })
							}
							editable={schedule.enabled} // disable when off
							placeholder="HH:MM"
							placeholderTextColor={colors.textSecondary}
							style={{
								borderBottomWidth: 1,
								borderColor: colors.border,
								color: colors.textPrimary,
								paddingVertical: 4,
							}}
							keyboardType={"default"}
						/>
					</View>

					{/* End Time */}
					<View
						key={"endTime"}
						style={{ marginTop: 12 }}
					>
						<Text
							style={{
								color: colors.textSecondary,
								marginBottom: 4,
							}}
						>
							End Time
						</Text>

						<TextInput
							value={schedule.endTime}
							onChangeText={(text) =>
								onUpdate({ ...schedule, endTime: text })
							}
							editable={schedule.enabled} // disable when off
							placeholder="HH:MM"
							placeholderTextColor={colors.textSecondary}
							style={{
								borderBottomWidth: 1,
								borderColor: colors.border,
								color: colors.textPrimary,
								paddingVertical: 4,
							}}
							keyboardType={"default"}
						/>
					</View>

					{/* Interval */}
					<View
						key={"interval"}
						style={{ marginTop: 12 }}
					>
						<Text
							style={{
								color: colors.textSecondary,
								marginBottom: 4,
							}}
						>
							Interval (minutes)
						</Text>

						<TextInput
							value={schedule.interval}
							onChangeText={(text) =>
								onUpdate({ ...schedule, interval: text })
							}
							editable={schedule.enabled} // disable when off
							placeholder="10"
							placeholderTextColor={colors.textSecondary}
							style={{
								borderBottomWidth: 1,
								borderColor: colors.border,
								color: colors.textPrimary,
								paddingVertical: 4,
							}}
							keyboardType={"numeric"}
						/>
					</View>

					{/* Sound */}
					<View
						key={"sound"}
						style={{ marginTop: 12 }}
					>
						<Text
							style={{
								color: colors.textSecondary,
								marginBottom: 4,
							}}
						>
							Sound
						</Text>

						<TextInput
							value={schedule.sound}
							onChangeText={(text) =>
								onUpdate({ ...schedule, sound: text })
							}
							editable={schedule.enabled} // disable when off
							placeholder="default"
							placeholderTextColor={colors.textSecondary}
							style={{
								borderBottomWidth: 1,
								borderColor: colors.border,
								color: colors.textPrimary,
								paddingVertical: 4,
							}}
							keyboardType={"default"}
						/>
					</View>
				</View>
			)}
		</View>
	);
};
