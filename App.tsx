import React, { useEffect, useState } from 'react';
import RootDrawerNavigator from './routes/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Notification } from 'expo-notifications';
import * as Notifications from 'expo-notifications';
import { PermissionStatus } from 'expo-modules-core';

const LOCATION_TASK_NAME = 'background-location-task';

const getLocationPermissions = async() => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return;
  } else if(status === 'granted') {
    try {
      let backPerm = await Location.requestBackgroundPermissionsAsync();
      console.log("0 -> ", backPerm);
      if(backPerm.status === 'granted' ) {
        console.log("Here123")
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          deferredUpdatesDistance: 10
        });
      }
    } catch(error) {
      console.log(error);
    }
  }
}

export default function App() {

  const [notificationPermissions, setNotificationPermissions] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  );

  useEffect(() => {
    if (notificationPermissions !== PermissionStatus.GRANTED) {
      return;
    }
    const listener = Notifications.addNotificationReceivedListener(handleNotification);
    return () => listener.remove();
  }, [notificationPermissions]);

  

  const handleNotification = (notification: Notification) => {
    const { title } = notification.request.content;
    console.warn(title);
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationPermissions(status);
    return status;
  };

  useEffect(() => {
    console.log("App Loaded");
    (async() => {
      await getLocationPermissions();
      await requestNotificationPermissions();
    })();
  }, [])

  return (
    <NavigationContainer>
      <RootDrawerNavigator />
    </NavigationContainer>
      
  );
}