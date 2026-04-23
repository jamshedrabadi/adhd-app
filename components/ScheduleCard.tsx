import { View, Text, Switch, TextInput, Pressable } from "react-native";
import { useState } from "react";

import { Schedule } from "../types/schedule";
import { colors } from "../theme/theme";

type Props = {
	schedule: Schedule;
	index: number;
	onUpdate: (updated: Schedule) => void;
};

export const ScheduleCard = ({ schedule, index, onUpdate }: Props) => {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<View
			style={{
				marginVertical: 8,
				backgroundColor: colors.surface,
				borderRadius: 12,
				borderWidth: 1,
				borderColor: colors.border,
				opacity: schedule.enabled ? 1 : 0.5,
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
				{/* Left: Title */}
				<Text
					style={{
						color: colors.textPrimary,
						fontSize: 16,
						fontWeight: "600",
					}}
				>
					Schedule {index + 1}
				</Text>

				{/* Right: Toggle + Arrow */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 12,
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

					<Pressable onPress={() => setCollapsed((prev) => !prev)}>
						<Text
							style={{
								color: colors.textSecondary,
								fontSize: 18,
							}}
						>
							{collapsed ? "▼" : "▲"}
						</Text>
					</Pressable>
				</View>
			</View>

			{/* BODY (collapsible) */}
			{!collapsed && (
				<View style={{
					paddingHorizontal: 16,
					paddingBottom: 16,
				}}>
					{/* Start Time */}
					<View
						key={"startTime"}
						style={{ marginTop: 8 }}
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
						style={{ marginTop: 8 }}
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
						style={{ marginTop: 8 }}
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
						style={{ marginTop: 8 }}
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
