import {
	View,
	Text,
	Pressable,
	Switch,
} from "react-native";

import { NudgeSchedule } from "../types/NudgeSchedule";
import { useTheme } from "../theme/ThemeProvider";

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

	const summaryText = `${schedule.startTime} → ${schedule.endTime}`;

	const detailText = `Every ${schedule.nudgeInterval} min • ${schedule.sound}`;

	return (
		<Pressable
			onPress={onPress}
			style={{
				backgroundColor: colors.surface,
				borderRadius: 16,
				borderWidth: 1,
				borderColor: colors.border,
				padding: 18,
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
							fontSize: 18,
							fontWeight: "700",
						}}
					>
						{schedule.name}
					</Text>

					<Text
						style={{
							color: colors.textPrimary,
							fontSize: 15,
							marginTop: 8,
						}}
					>
						{summaryText}
					</Text>

					<Text
						style={{
							color: colors.textSecondary,
							fontSize: 13,
							marginTop: 4,
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
					>
						<Switch
							value={schedule.enabled}
							onValueChange={() =>
								onToggleEnabled()
							}
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
					</Pressable>
				</View>
			</View>
		</Pressable>
	);
};

export default NudgeScheduleCard;
