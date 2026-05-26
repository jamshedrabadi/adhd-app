import { useMemo, useState } from "react";

import {
	View,
	Text,
	Pressable,
	Platform,
} from "react-native";

import DateTimePicker, {
	DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { useTheme } from "../theme/ThemeProvider";

type Props = {
	value: string;
	onChange: (time: string) => void;
	disabled?: boolean;
};

export const TimeField = ({
	value,
	onChange,
	disabled = false,
}: Props) => {
	const { colors } = useTheme();

	const [showPicker, setShowPicker] = useState(false);

	// Convert "13:00" -> Date
	const dateValue = useMemo(() => {
		const [hours, minutes] = value
			.split(":")
			.map(Number);

		const date = new Date();

		date.setHours(hours);
		date.setMinutes(minutes);
		date.setSeconds(0);

		return date;
	}, [value]);

	const handleChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date,
	) => {
		// Android closes automatically
		if (Platform.OS === "android") {
			setShowPicker(false);
		}

		if (!selectedDate) {
			return;
		}

		const hours = selectedDate
			.getHours()
			.toString()
			.padStart(2, "0");

		const minutes = selectedDate
			.getMinutes()
			.toString()
			.padStart(2, "0");

		onChange(`${hours}:${minutes}`);
	};

	const formattedTime = dateValue.toLocaleTimeString(
		[],
		{
			hour: "numeric",
			minute: "2-digit",
		},
	);

	return (
		<View style={{ marginTop: 16 }}>
			<Pressable
				onPress={() =>
					!disabled &&
					setShowPicker(true)
				}
				style={({ pressed }) => ({
					backgroundColor: colors.surfaceAlt,
					borderRadius: 12,
					paddingVertical: 14,
					paddingHorizontal: 14,
					opacity:
						pressed
							? 0.7
							: disabled
								? 0.5
								: 1,
				})}
			>
				<Text
					style={{
						color: colors.textPrimary,
						fontSize: 16,
					}}
				>
					{formattedTime}
				</Text>
			</Pressable>

			{showPicker && (
				<DateTimePicker
					value={dateValue}
					mode="time"
					is24Hour={false}
					display="default"
					onChange={handleChange}
				/>
			)}
		</View>
	);
};

export default TimeField;
