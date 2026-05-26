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
		<View
			style={{
				paddingBottom: 40,
			}}
		>
			<View
				style={{
					marginBottom: 28,
				}}
			>
				<Text
					style={{
						color: colors.textSecondary,
						marginBottom: 8,
						fontSize: 13,
						fontWeight: "600",
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
						borderRadius: 14,
						borderWidth: 1,
						borderColor: colors.border,
						paddingHorizontal: 16,
						height: 54,
						color: colors.textPrimary,
						fontSize: 16,
						fontWeight: "600",
					}}
				/>
			</View>

			<View
				style={{
					marginBottom: 28,
				}}
			>
				<Text
					style={{
						color: colors.textSecondary,
						fontSize: 13,
						fontWeight: "600",
						marginBottom: 14,
					}}
				>
					Time Window
				</Text>

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
			</View>

			<View
				style={{
					marginBottom: 28,
				}}
			>
				<Text
					style={{
						color: colors.textSecondary,
						fontSize: 13,
						fontWeight: "600",
						marginBottom: 14,
					}}
				>
					Nudge Frequency
				</Text>

				<IntervalInput
					value={schedule.nudgeInterval}
					onChange={(value) =>
						onChange({
							...schedule,
							nudgeInterval: value,
						})
					}
				/>
			</View>

			<View
				style={{
					marginBottom: 8,
				}}
			>
				<Text
					style={{
						color: colors.textSecondary,
						fontSize: 13,
						fontWeight: "600",
						marginBottom: 14,
					}}
				>
					Sound
				</Text>

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
		</View>
	);
};

export default ScheduleEditor;
