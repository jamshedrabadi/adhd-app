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
				paddingBottom: 24,
				gap: 24,
			}}
		>
			{/* NAME */}
			<View
				style={{
					backgroundColor: colors.surface,
					borderRadius: 18,
					borderWidth: 1,
					borderColor: colors.border,
					padding: 16,
				}}
			>
				<Text
					style={{
						color: colors.textSecondary,
						fontSize: 13,
						fontWeight: "600",
						marginBottom: 12,
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
					placeholder="Morning Focus"
					placeholderTextColor={
						colors.textSecondary
					}
					style={{
						color: colors.textPrimary,
						fontSize: 18,
						fontWeight: "600",
					}}
				/>
			</View>

			{/* TIME */}
			<View
				style={{
					backgroundColor:
						colors.surface,
					borderRadius: 18,
					borderWidth: 1,
					borderColor:
						colors.border,
					padding: 16,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						gap: 16,
					}}
				>
					<View style={{ flex: 1 }}>
						<Text
							style={{
								color:
									colors.textSecondary,
								fontSize: 13,
								fontWeight: "600",
								marginBottom: 8,
								marginLeft: 4,
							}}
						>
							Start
						</Text>

						<TimeField
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
						<Text
							style={{
								color:
									colors.textSecondary,
								fontSize: 13,
								fontWeight: "600",
								marginBottom: 8,
								marginLeft: 4,
							}}
						>
							End
						</Text>

						<TimeField
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

			{/* INTERVAL */}
			<View
				style={{
					backgroundColor: colors.surface,
					borderRadius: 18,
					borderWidth: 1,
					borderColor: colors.border,
					padding: 16,
				}}
			>
				<Text
					style={{
						color: colors.textSecondary,
						fontSize: 13,
						fontWeight: "600",
						marginBottom: -2,
					}}
				>
					Repeat Every
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

			{/* SOUND */}
			<View
				style={{
					backgroundColor: colors.surface,
					borderRadius: 18,
					borderWidth: 1,
					borderColor: colors.border,
					padding: 16,
				}}
			>
				<Text
					style={{
						color: colors.textSecondary,
						fontSize: 13,
						fontWeight: "600",
						marginBottom: -4,
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
