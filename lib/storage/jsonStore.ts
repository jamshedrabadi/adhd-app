import AsyncStorage from "@react-native-async-storage/async-storage";

export const readJson = async <Value>(key: string): Promise<Value | null> => {
	const rawValue = await AsyncStorage.getItem(key);

	if (!rawValue) {
		return null;
	}

	try {
		return JSON.parse(rawValue) as Value;
	} catch (error) {
		console.error(`Unable to read stored value for ${key}.`, error);
		return null;
	}
};

export const writeJson = async <Value>(key: string, value: Value): Promise<void> => {
	await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const removeStoredValue = async (key: string): Promise<void> => {
	await AsyncStorage.removeItem(key);
};
