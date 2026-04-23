import { View, Text, Switch, TextInput } from "react-native";
import { Schedule } from "../types/schedule";

type Props = {
	schedule: Schedule;
	onUpdate: (updated: Schedule) => void;
};

export const ScheduleCard = ({ schedule, onUpdate }: Props) => {
	return (
		<View
			style={{
				padding: 15,
				marginVertical: 10,
				backgroundColor: "#eee",
				borderRadius: 10,
			}}
		>
			{/* Toggle */}
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Text>Enabled</Text>
				<Switch
					value={schedule.enabled}
					onValueChange={(value) =>
						onUpdate({ ...schedule, enabled: value })
					}
				/>
			</View>

			{/* Start Time */}
			<Text>Start Time</Text>
			<TextInput
				value={schedule.startTime}
				onChangeText={(text) =>
					onUpdate({ ...schedule, startTime: text })
				}
				placeholder="HH:MM"
				style={{ borderBottomWidth: 1, marginBottom: 10 }}
			/>

			{/* End Time */}
			<Text>End Time</Text>
			<TextInput
				value={schedule.endTime}
				onChangeText={(text) =>
					onUpdate({ ...schedule, endTime: text })
				}
				placeholder="HH:MM"
				style={{ borderBottomWidth: 1, marginBottom: 10 }}
			/>

			{/* Interval */}
			<Text>Interval (minutes)</Text>
			<TextInput
				value={schedule.interval}
				onChangeText={(text) =>
					onUpdate({ ...schedule, interval: text })
				}
				keyboardType="numeric"
				style={{ borderBottomWidth: 1, marginBottom: 10 }}
			/>

			{/* Sound */}
			<Text>Sound</Text>
			<TextInput
				value={schedule.sound}
				onChangeText={(text) =>
					onUpdate({ ...schedule, sound: text })
				}
				placeholder="default"
				style={{ borderBottomWidth: 1 }}
			/>
		</View>
	);
};

export default ScheduleCard;
