import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { globalStyles } from '../styles/global';
import { DealsHereContext } from '../components/context';

export default function Settings() {
  const { dealList, location } = useContext(DealsHereContext);

  return (
    <View style={globalStyles.container}>
      <Text>{ location && location.latitude ? "Location Latitude: " + location.latitude : null}</Text>
      <Text>{location && location.longitude ? "Location Longitude: " + location.longitude : null}</Text>
      <Text>Developed By: Sumeet W.</Text>
    </View>
  );
}