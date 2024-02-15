import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('customer-data', jsonValue);
    } catch (e) {
      console.log(e);
    }
};

export const getStoredData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('customer-data');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e);
    }
};