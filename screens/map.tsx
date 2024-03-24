import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { globalStyles } from '../styles/global';
import { DealsHereContext } from '../components/context';
import MapView, { Marker } from 'react-native-maps';

export default function Map() {
  const { dealList, location } = useContext(DealsHereContext);

  return (
    <View style={globalStyles.container}>
      <MapView style={styles.map} 
        initialRegion={{ latitude:location.latitude, longitude: location.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421, }}
        region={{ latitude:location.latitude, longitude: location.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421, }}
      >
        <Marker
          coordinate={{latitude:location.latitude, longitude: location.longitude}}
          title={"Current Location"}
        />
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '150%',
  },
});