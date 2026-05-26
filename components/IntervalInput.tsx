import {
	View,
	Text,
	TextInput,
	Pressable,
} from "react-native";

import {
	useEffect,
	useState,
} from "react";

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

	const [text, setText] = useState(
		value.toString(),
	);

	useEffect(() => {
		setText(value.toString());
	}, [value]);

	const updateValue = (newValue: number) => {
		onChange(
			Math.min(
				MAX_INTERVAL,
				Math.max(
					MIN_INTERVAL,
					newValue,
				),
			),
		);
	};

	return (
		<View
			style={{
				marginTop: 18,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					alignSelf: "flex-start",
					backgroundColor: colors.surfaceAlt,
					borderRadius: 14,
					borderWidth: 1,
					borderColor: colors.border,
					paddingHorizontal: 10,
					paddingVertical: 6,
					gap: 8,
				}}
			>
				<Pressable
					onPress={() =>
						!disabled &&
						updateValue(value - 1)
					}
					android_ripple={{
						color: "rgba(255,255,255,0.12)",
						borderless: false,
					}}
					hitSlop={6}
					style={({ pressed }) => ({
						width: 56,
						height: 48,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: pressed
							? colors.border
							: "transparent",
						transform: [
							{
								scale: pressed
									? 0.94
									: 1,
							},
						],
					})}
				>
					<Ionicons
						name="remove"
						size={18}
						color={colors.textPrimary}
					/>
				</Pressable>

				<TextInput
					value={text}
					onChangeText={(newText) => {
						if (
							!/^\d*$/.test(newText)
						) {
							return;
						}

						setText(newText);

						if (newText === "") {
							return;
						}

						updateValue(Number(newText));
					}}
					onBlur={() => {
						if (text === "") {
							setText(
								value.toString(),
							);
						}
					}}
					editable={!disabled}
					keyboardType="numeric"
					textAlign="center"
					style={{
						minWidth: 42,
						color: colors.textPrimary,
						fontSize: 16,
						fontWeight: "700",
						paddingVertical: 0,
					}}
				/>

				<Text
					style={{
						color: colors.textSecondary,
						fontSize: 14,
						marginRight: 2,
					}}
				>
					min
				</Text>

				<Pressable
					onPress={() =>
						!disabled &&
						updateValue(value + 1)
					}
					android_ripple={{
						color: "rgba(255,255,255,0.12)",
						borderless: false,
					}}
					hitSlop={6}
					style={({ pressed }) => ({
						width: 56,
						height: 48,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: pressed
							? colors.border
							: "transparent",
						transform: [
							{
								scale: pressed
									? 0.94
									: 1,
							},
						],
					})}
				>
					<Ionicons
						name="add"
						size={18}
						color={colors.textPrimary}
					/>
				</Pressable>
			</View>
		</View>
	);
};

export default IntervalInput;
