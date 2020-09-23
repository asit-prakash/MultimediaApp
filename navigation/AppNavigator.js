import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../Screen/HomeScreen';
import CameraScreen from '../Screen/CameraScreen';
import BarCodeScanner from '../Screen/BarCodeScanner';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator headerMode={'none'}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="BarCode" component={BarCodeScanner} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
