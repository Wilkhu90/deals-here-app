import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useState } from 'react';

// Screens
import Home from '../screens/home';
import Map from '../screens/map';
import Settings from '../screens/settings';

// drawer navigation options
const Drawer = createDrawerNavigator();

function RootDrawerNavigator() {

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} options={{ headerTitle: 'Deals Here' }}/>
      <Drawer.Screen name="Map" component={Map} options={{ headerTitle: 'Deals Here' }}/>
      <Drawer.Screen name="Settings" component={Settings} options={{ headerTitle: 'Deals Here' }}/>
    </Drawer.Navigator>
  );
}
export default RootDrawerNavigator;