import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import axios from 'axios';




export default class MapScreen extends Component {
  static navigationOptions = {
    title: 'Map',
  };

  constructor(props) {
    super(props);
    this.state = {
      parkings: [],
      coords: [],
      gpsLat: 0.0,
      gpsLng: 0.0,
      name: "",
      inputValue: "",
    }
    this.navigation = this.props.navigation;
    this.parkings = this.navigation.getParam('param', []);
  }

  componentDidMount() {

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
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
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
    const mapPanel = navigation.getParam('mapPanel', false);
    const { coords, gpsLat, gpsLng, inputValue } = this.state;
    this.getCurrentPosition();

    return (
      <View style={styles.container}>
        <View key="searchPanel" style={styles.searchPanel}>
          <TextInput editable={false} value={inputValue} />
          <Button title="Wyznacz" />
        </View>
        {<MapView style={styles.map}
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
              onPress={(coordinate) => this.updateInputValue({
                latitude: parseFloat(elem.gpsLat),
                longitude: parseFloat(elem.gpsLng)
              })}
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
    top: 40,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapWithPanel: {
    top: 40,
  },
  searchPanel: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 40,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'row',
  }
});
