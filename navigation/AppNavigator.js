import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import UpdateScreen from '../screens/UpdateScreen';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Loading: LoadingScreen,
    Update: UpdateScreen,
    Auth: AuthStackNavigator,
    Main: MainTabNavigator,
  },{
    initialRouteName: 'Loading',
  })
);
