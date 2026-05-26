import {
	View,
	Text,
	Pressable,
	Switch,
} from "react-native";

import { NudgeSchedule } from "../types/NudgeSchedule";
import { useTheme } from "../theme/ThemeProvider";
import { formatTime } from "../utils/time";

type Props = {
	schedule: NudgeSchedule;
	onPress: () => void;
	onToggleEnabled: () => void;
};

export const NudgeScheduleCard = ({
	schedule,
	onPress,
	onToggleEnabled,
}: Props) => {
	const { colors } = useTheme();

	const summaryText = `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`;

	const soundLabel = schedule.sound
		.split("-")
		.map(
			(word) =>
				word.charAt(0).toUpperCase() + word.slice(1),
		)
		.join(" ");

	const detailText = `Every ${schedule.nudgeInterval} minute${schedule.nudgeInterval === 1
		? ""
		: "s"
		} (${soundLabel})`;

	return (
		<Pressable
			onPress={onPress}
			style={{
				backgroundColor: colors.surface,
				borderRadius: 16,
				borderWidth: 1,
				borderColor: colors.border,
				paddingHorizontal: 18,
				paddingVertical: 20,
				opacity: schedule.enabled ? 1 : 0.5,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View style={{ flex: 1 }}>
					<Text
						numberOfLines={1}
						style={{
							color: colors.textPrimary,
							fontSize: 19,
							fontWeight: "700",
						}}
					>
						{schedule.name}
					</Text>

					<Text
						style={{
							color: colors.textPrimary,
							fontSize: 15,
							marginTop: 16,
						}}
					>
						{summaryText}
					</Text>

					<Text
						style={{
							color: colors.textSecondary,
							fontSize: 13,
							marginTop: 10,
							lineHeight: 18,
						}}
					>
						{detailText}
					</Text>
				</View>

				<View
					style={{
						alignItems: "center",
						marginLeft: 16,
					}}
				>
					<Pressable
						onPress={(event) => {
							event.stopPropagation();

							onToggleEnabled();
						}}
						hitSlop={8}
					>
						<View pointerEvents="none">
							<Switch
								value={schedule.enabled}
								onValueChange={() => { }}
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
						</View>
					</Pressable>
				</View>
			</View>
		</Pressable>
	);
};

export default NudgeScheduleCard;
