import { ReactNode, useRef } from "react";
import { Animated, Pressable, PressableProps, ViewStyle } from "react-native";

type Props = Omit<PressableProps, "children" | "style"> & {
	children: ReactNode;
	style?: ViewStyle;
	disabled?: boolean;
};

export const AppPressable = ({ children, disabled = false, onPressIn, onPressOut, style, ...props }: Props) => {
	const scale = useRef(new Animated.Value(1)).current;

	const animate = (toValue: number): void => {
		Animated.timing(scale, {
			toValue,
			duration: 120,
			useNativeDriver: true,
		}).start();
	};

	return (
		<Pressable
			{...props}
			disabled={disabled}
			onPressIn={(event) => {
				if (!disabled) {
					animate(0.98);
				}
				onPressIn?.(event);
			}}
			onPressOut={(event) => {
				animate(1);
				onPressOut?.(event);
			}}
		>
			<Animated.View style={[style, { opacity: disabled ? 0.48 : 1, transform: [{ scale }] }]}>
				{children}
			</Animated.View>
		</Pressable>
	);
};
