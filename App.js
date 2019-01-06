/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import ActionScreen from "./android/components/ActionScreen";
import MapScreen from "./android/components/MapScreen";
import ParkingsListScreen from "./android/components/ParkingsListScreen";
import ListItemScreen from './android/components/ListItemScreen';
import LoginPanel from "./android/components/LoginPanel"
import RegisterPanel from './android/components/RegisterPanel/RegisterPanel';
import AccountScreen from './android/components/AccountScreen/AccountScreen';
import ParkScreen from './android/components/ParkScreen/ParkScreen';


const Navigator = createStackNavigator({
  Home:{screen:LoginPanel},
  LoggedIn: {screen: ActionScreen},
  RegisterSreen:{screen:RegisterPanel},
  Map: {screen: MapScreen},
  ParkingList:{screen:ParkingsListScreen},
  ListItem:{screen:ListItemScreen},
  Account:{screen:AccountScreen},
  ParkScreen:{screen:ParkScreen},
});

const App = createAppContainer(Navigator);

export default App ;

