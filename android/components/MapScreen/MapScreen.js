import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import cn from 'react-native-classnames'
import axios from 'axios';


/**
 * Komponent screen mapy wołamy z różnymi parametrami w zależności od funkcji jaką ma pełnić.
 * Możemy wyświetlać własną lokalizację, drogę z punktu A do punktu B , nanieść markery na mapę w
 * punktach podanych w parametrze param - parkings.
 * param - lista parkingów
 * myLocation - boolean
 * searchPanel - boolean czy ma być panel do wyszukiwania loakcji,
 * drawPanel - boolean pokazuje wybrany punkt na mapie przez wyświetlenie nazwy w inpucie. Zatwierdzamy guzikiem obok.
 * drawRoad - boolean czy ma zadziać się akcja wyznaczania drogi po akcji onPress na Markerze
 */

export default class MapScreen extends Component {
  static navigationOptions = {
    title: 'Map',
  };

  constructor(props) {
    super(props);
    this.state = {
      parkings: [],
      coords: [],
      gpsLat: 52.2,
      gpsLng: 21.2,
      name: "",
      inputValue: "",
    }
    this.navigation = this.props.navigation;
    this.parkings = this.navigation.getParam('param', []);

  }

  componentDidMount() {
    this.getCurrentPosition();
  }

  async getCurrentPosition() {
    navigator.geolocation.getCurrentPosition.bind(this)(
      (position) => {
        this.setState({
          gpsLat: position.coords.latitude,
          gpsLng: position.coords.longitude,
          error: null,
        });
      },

      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 5000,  distanceFilter: 20 },
    );
  }

  runGetDirections = ()=> {
    const {inputValue, gpsLat, gpsLng} = this.state;
    const startLoc = `${gpsLat},${gpsLng}`;
    const parking = this.parkings.find(x => x.name == inputValue);
    const destinationLoc = `${parking.gpsLat},${parking.gpsLng}`;
    this.getDirections(startLoc, destinationLoc);
    
  }

  async getDirections(startLoc, destinationLoc) {

    try {
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyBTBdvfJUhATPLp6dBl_eNmd5Dj8guOsw8`)
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }

      })

      this.setState({ coords: coords })
      return coords
    } catch (error) {
      alert(error)
      return error
    }

  }

  updateInputValue(coordinate) {
    const parking = this.parkings.find(x => x.gpsLat == coordinate.latitude
      && x.gpsLng == coordinate.longitude)
    if (parking) {
      this.setState({ inputValue: parking.name });
    }

  }

  render() {
    const { navigation } = this.props;
    const parkings = navigation.getParam('param', []);
    const myLocation = navigation.getParam('myLocation', false);
    const drawPanel = navigation.getParam('drawPanel', false);
    const { coords, gpsLat, gpsLng, inputValue } = this.state;

    return (
      <View style={styles.container}>
        {drawPanel && <View key="drawPanel" style={styles.drawPanel}>
          <TextInput editable={false} value={inputValue} />
          <Button title="Wyznacz" onPress={this.runGetDirections} />
        </View>}
        {<MapView style={cn(styles,'map',{mapWithPanel:drawPanel}, {mapWithoutPanel:!drawPanel} )}
          initialRegion={{
            latitude: 52.229,
            longitude: 21.011,
            latitudeDelta: 0.2,
            longitudeDelta: 0.15,
          }}>

          {parkings.map(elem => (
            <Marker key={elem.name}
              coordinate={{
                latitude: parseFloat(elem.gpsLat),
                longitude: parseFloat(elem.gpsLng)
              }}
              title={elem.name}
              onPress={() => {
                if (drawPanel)
                  this.updateInputValue({
                    latitude: parseFloat(elem.gpsLat),
                    longitude: parseFloat(elem.gpsLng)
                  })
              }}
            />
          ))}
          {
            myLocation && <Marker key="myLocation"
              coordinate={{
                latitude: gpsLat,
                longitude: gpsLng
              }}
              title="Twoja lokalizacja"
              pinColor="yellow"
            />
          }
          {coords.length > 0 && <MapView.Polyline
            coordinates={coords}
            strokeWidth={2}
            strokeColor="blue" />}
        </MapView>}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapWithPanel: {
    top: 40,
  },
  mapWithoutPanel:{
    top:0,
  },
  drawPanel: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 40,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
  }
});
