import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetLocalStorage = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error reading local storage:', error);
    return null;
  }
};

export const SetLocalStorage = async (key: string, data: any): Promise<void> => {
  try {
    const stringValue = typeof data === 'string' ? data : JSON.stringify(data);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error('Error writing to local storage:', error);
  }
};

export const RemoveLocalStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from local storage:', error);
  }
};

export const ClearLocalStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
};
