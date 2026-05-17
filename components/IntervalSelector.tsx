import {
	View,
	Text,
	Pressable,
} from "react-native";

import { useTheme } from "../theme/ThemeProvider";

type Props = {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
};

const INTERVAL_OPTIONS = [
	5,
	10,
	15,
	20,
	30,
];

export const IntervalSelector = ({
	value,
	onChange,
	disabled = false,
}: Props) => {
	const { colors } = useTheme();

	return (
		<View style={{ marginTop: 16 }}>
			<Text
				style={{
					color: colors.textSecondary,
					marginBottom: 12,
				}}
			>
				Nudge Interval
			</Text>

			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					gap: 8,
				}}
			>
				{INTERVAL_OPTIONS.map((option) => {
					const selected =
						value === option.toString();

					return (
						<Pressable
							key={option}
							onPress={() =>
								!disabled &&
								onChange(
									option.toString(),
								)
							}
							style={{
								paddingHorizontal: 14,
								paddingVertical: 10,
								borderRadius: 999,
								borderWidth: 1,
								borderColor: selected
									? colors.accent
									: colors.border,
								backgroundColor:
									selected
										? colors.accentMuted
										: colors.surfaceAlt,
								opacity: disabled
									? 0.5
									: 1,
							}}
						>
							<Text
								style={{
									color: colors.textPrimary,
									fontWeight: "600",
								}}
							>
								{option}m
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};

export default IntervalSelector;
