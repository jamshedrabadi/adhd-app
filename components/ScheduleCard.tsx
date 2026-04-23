import { View, Text, Switch, TextInput } from "react-native";

import { Schedule } from "../types/schedule";
import { colors } from "../theme/theme";

type Props = {
	schedule: Schedule;
	onUpdate: (updated: Schedule) => void;
};

export const ScheduleCard = ({ schedule, onUpdate }: Props) => {
	return (
		<View
			style={{
				padding: 24,
				marginVertical: 8,
				backgroundColor: colors.surface,
				borderRadius: 12,
				borderWidth: 1,
				borderColor: colors.border,
			}}
		>
			{/* Toggle */}
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Text style={{ color: colors.textPrimary }}>
					Enabled
				</Text>

				<Switch
					value={schedule.enabled}
					onValueChange={(value) =>
						onUpdate({ ...schedule, enabled: value })
					}
					trackColor={{
						false: colors.surfaceAlt,
						true: colors.accentMuted,
					}}
					thumbColor={schedule.enabled ? colors.accent : "#ccc"}
				/>
			</View>

			{/* Start Time */}
			<View key={"startTime"} style={{ marginTop: 16 }}>
				<Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
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
			<View key={"endTime"} style={{ marginTop: 16 }}>
				<Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
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
			<View key={"interval"} style={{ marginTop: 16 }}>
				<Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
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
			<View key={"sound"} style={{ marginTop: 16 }}>
				<Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
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
	);
};

export default ScheduleCard;
