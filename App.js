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
import MapListScreen from "./android/components/MapListScreen";
import ListItemScreen from './android/components/ListItemScreen';


const Navigator = createStackNavigator({
  Home: {screen: ActionScreen},
  Map: {screen: MapScreen},
  ParkingList:{screen:MapListScreen},
  ListItem:{screen:ListItemScreen}
});

const App = createAppContainer(Navigator);

export default App ;

