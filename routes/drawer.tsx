import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useState } from 'react';

// Screens
import Home from '../screens/home';
import Map from '../screens/map';
import Settings from '../screens/settings';

// drawer navigation options
const Drawer = createDrawerNavigator();

type BankDiscount = {
  name: string,
  business: string,
  type: string,
  discount: number,
}

function RootDrawerNavigator() {
  const [dealList, setDealList] = useState<BankDiscount[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const HomeScreen = () => <Home dealList={dealList} setDealList={setDealList} location={location} setLocation={setLocation} address={address} setAddress={setAddress}/>
  const MapScreen = () => <Map dealList={dealList} setDealList={setDealList} location={location} setLocation={setLocation} address={address} setAddress={setAddress}/>
  const SettingsScreen = () => <Settings dealList={dealList} setDealList={setDealList} location={location} setLocation={setLocation} address={address} setAddress={setAddress}/>

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} options={{ headerTitle: 'Deals Here' }}/>
      <Drawer.Screen name="Map" component={MapScreen} options={{ headerTitle: 'Deals Here' }}/>
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ headerTitle: 'Deals Here' }}/>
    </Drawer.Navigator>
  );
}
export default RootDrawerNavigator;