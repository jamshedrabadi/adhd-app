import {
	View,
	Text,
	TextInput,
} from "react-native";

import { NudgeSchedule } from "../types/NudgeSchedule";

import { useTheme } from "../theme/ThemeProvider";

import { TimeField } from "./TimeField";
import { IntervalInput } from "./IntervalInput";
import { SoundSelector } from "./SoundSelector";

type Props = {
	schedule: NudgeSchedule;
	onChange: (
		schedule: NudgeSchedule,
	) => void;
};

export const ScheduleEditor = ({
	schedule,
	onChange,
}: Props) => {
	const { colors } = useTheme();

	return (
		<View>
			<Text
				style={{
					color: colors.textSecondary,
					marginBottom: 8,
					fontSize: 13,
				}}
			>
				Schedule Name
			</Text>

			<TextInput
				value={schedule.name}
				onChangeText={(text) =>
					onChange({
						...schedule,
						name: text,
					})
				}
				placeholder="New Schedule"
				placeholderTextColor={
					colors.textSecondary
				}
				style={{
					backgroundColor: colors.surfaceAlt,
					borderRadius: 12,
					borderWidth: 1,
					borderColor: colors.border,
					paddingHorizontal: 14,
					height: 52,
					color: colors.textPrimary,
					fontSize: 16,
					fontWeight: "600",
				}}
			/>

			<View
				style={{
					flexDirection: "row",
					gap: 12,
				}}
			>
				<View style={{ flex: 1 }}>
					<TimeField
						label="Start"
						value={schedule.startTime}
						onChange={(time) =>
							onChange({
								...schedule,
								startTime: time,
							})
						}
					/>
				</View>

				<View style={{ flex: 1 }}>
					<TimeField
						label="End"
						value={schedule.endTime}
						onChange={(time) =>
							onChange({
								...schedule,
								endTime: time,
							})
						}
					/>
				</View>
			</View>

			<IntervalInput
				value={schedule.nudgeInterval}
				onChange={(value) =>
					onChange({
						...schedule,
						nudgeInterval: value,
					})
				}
			/>

			<SoundSelector
				value={schedule.sound}
				onChange={(value) =>
					onChange({
						...schedule,
						sound: value,
					})
				}
			/>
		</View>
	);
};

export default ScheduleEditor;
