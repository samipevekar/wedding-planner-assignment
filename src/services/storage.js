
import AsyncStorage from '@react-native-async-storage/async-storage';

const GUESTS_STORAGE_KEY = '@wedding_guests';

// Save guests to AsyncStorage
export const saveGuestsToStorage = async (guests) => {
  try {
    const jsonValue = JSON.stringify(guests);
    await AsyncStorage.setItem(GUESTS_STORAGE_KEY, jsonValue);
    console.log('Guests saved successfully');
  } catch (e) {
    console.error('Error saving guests:', e);
    throw new Error('Failed to save guests to storage');
  }
};

// Load guests from AsyncStorage
export const loadGuestsFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(GUESTS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading guests:', e);
    throw new Error('Failed to load guests from storage');
  }
};

// Clear all guests from storage
export const clearGuestsFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(GUESTS_STORAGE_KEY);
    console.log('Guests cleared from storage');
  } catch (e) {
    console.error('Error clearing guests:', e);
    throw new Error('Failed to clear guests from storage');
  }
};