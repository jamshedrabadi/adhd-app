import {
	View,
	Text,
	Pressable,
} from "react-native";

import { useTheme } from "../theme/ThemeProvider";
import { NUDGE_SOUNDS } from "../utils/sounds";

type Props = {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
};

export const SoundSelector = ({
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
				Sound
			</Text>

			<View
				style={{
					gap: 8,
				}}
			>
				{NUDGE_SOUNDS.map((sound) => {
					const selected =
						value === sound.id;

					return (
						<Pressable
							key={sound.id}
							onPress={() =>
								!disabled &&
								onChange(sound.id)
							}
							style={{
								paddingHorizontal: 14,
								paddingVertical: 14,
								borderRadius: 12,
								borderWidth: 1,
								borderColor: selected
									? colors.accent
									: colors.border,
								backgroundColor: selected
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
								{sound.label}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};

export default SoundSelector;
