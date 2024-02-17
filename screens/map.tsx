import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { globalStyles } from '../styles/global';

export default function Map({ dealList, setDealList, location, setLocation, address, setAddress }: any) {
  return (
    <View style={globalStyles.container}>
      <Text>Map Screen</Text>
    </View>
  );
}