import {
	View,
	Text,
	TextInput,
	Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeProvider";

type Props = {
	value: number;
	disabled?: boolean;
	onChange: (value: number) => void;
};

const MIN_INTERVAL = 1;
const MAX_INTERVAL = 240;

export const IntervalInput = ({
	value,
	disabled,
	onChange,
}: Props) => {
	const { colors } = useTheme();

	const decrement = () => {
		if (disabled) {
			return;
		}

		onChange(
			Math.max(
				MIN_INTERVAL,
				value - 1,
			),
		);
	};

	const increment = () => {
		if (disabled) {
			return;
		}

		onChange(
			Math.min(
				MAX_INTERVAL,
				value + 1,
			),
		);
	};

	return (
		<View
			style={{
				marginTop: 16,
			}}
		>
			<Text
				style={{
					color: colors.textSecondary,
					marginBottom: 8,
				}}
			>
				Nudge Interval (minutes)
			</Text>

			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: colors.surfaceAlt,
					borderRadius: 12,
					borderWidth: 1,
					borderColor: colors.border,
					overflow: "hidden",
				}}
			>
				<Pressable
					onPress={decrement}
					style={{
						width: 56,
						height: 56,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Ionicons
						name="remove"
						size={22}
						color={
							colors.textPrimary
						}
					/>
				</Pressable>

				<TextInput
					value={value.toString()}
					onChangeText={(text) => {
						const parsed = Number(text);

						if (Number.isNaN(parsed)) {
							return;
						}

						onChange(
							Math.min(
								MAX_INTERVAL,
								Math.max(
									MIN_INTERVAL,
									parsed,
								),
							),
						);
					}}
					editable={!disabled}
					keyboardType="numeric"
					textAlign="center"
					style={{
						flex: 1,
						height: 56,
						color: colors.textPrimary,
						fontSize: 18,
						fontWeight: "600",
					}}
				/>

				<Pressable
					onPress={increment}
					style={{
						width: 56,
						height: 56,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Ionicons
						name="add"
						size={22}
						color={
							colors.textPrimary
						}
					/>
				</Pressable>
			</View>
		</View>
	);
};

export default IntervalInput;
