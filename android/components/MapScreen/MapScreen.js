import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableHighlight } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import CustomCallout from "./../CustomCallout";
import Polyline from '@mapbox/polyline';
import cn from 'react-native-classnames';
import GooglePlaceInput from "./../GooglePlaceInput";
import axios from 'axios';
import RoutesList from '../RoutesList/RoutesList';


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
      transitCoords: [],
      routes:[],
      distance: null,
      duration: null,
      gpsLat: 52.2,
      gpsLng: 21.2,
      name: "",
      inputValue: "",
      destinationPanel: false,
      travelDestination: {},
    }
    this.navigation = this.props.navigation;
    this.parkings = this.navigation.getParam('param', []);

  }

  componentDidMount() {
    this.getCurrentPosition();
  }
  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.watchID);
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

      (error) => {

        this.setState({ error: error.message })
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );

    this.watchID = navigator.geolocation.watchPosition.bind(this)((position) => {
      this.setState({
        gpsLat: position.coords.latitude,
        gpsLng: position.coords.longitude,
        error: null,
      }, this.runGetDirections);
    },
      (error) => { this.setState({ error: error.message }) },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000, distanceFilter: 5 })
  }

  runGetDirections = () => {
    const { inputValue, gpsLat, gpsLng, destinationPanel, travelDestination, duration } = this.state;
    const startLoc = `${gpsLat},${gpsLng}`;
    if (inputValue && gpsLat && gpsLng) {
      const parking = this.parkings.find(x => x.name == inputValue);
      const destinationLoc = `${parking.gpsLat},${parking.gpsLng}`;
      if (!destinationPanel) {
        this.getDirections(startLoc, destinationLoc);
      } else if (travelDestination.geometry) {
        const { lat, lng } = travelDestination.geometry.location;
        const travelDestinationLocationString = `${lat},${lng}`;
       /* const date = Date.now() + (duration != null ? parseInt(duration.value) * 1000 : 0);
        alert(date);*/
        let date = Math.ceil(Date.now()/1000);
        if (duration) { date += parseInt(duration.value)}
        this.getDirections(destinationLoc, travelDestinationLocationString,'transit', true, date)
      }
    }

  }

  async getDirections(startLoc, destinationLoc, travelMode = 'DRIVING',
  alternatives=false, departure_time = "now") {

    try {
      let resp = await axios(`https://maps.googleapis.com/maps/api/directions/json?`, {
        params: {
          origin: startLoc,
          destination: destinationLoc,
          mode: travelMode,
          alternatives:alternatives,
          departure_time:departure_time,
          key: "AIzaSyBTBdvfJUhATPLp6dBl_eNmd5Dj8guOsw8"
        }
      })
      
      const {routes} = resp.data;
      const { duration, distance } = routes[0].legs[0];
      let points = Polyline.decode(resp.data.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }

      })
      if (travelMode != 'transit')
        this.setState({ coords: coords, duration: duration, distance: distance })
      else
        this.setState({duration: duration, distance: distance, routes: routes })
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

  enableDestinationPanel = () => {
    this.setState(() => ({
      destinationPanel: !this.state.destinationPanel
    }))
  }

  googlePlaceInputHandler = (details) => {
    this.setState({ travelDestination: details });
  }

  routesListHandler = (route) => {
    let points = Polyline.decode(route.overview_polyline.points);
    let coords = points.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1]
      }
    })
      this.setState({ transitCoords: coords, destinationPanel:false})
  }

  render() {
    const { navigation } = this.props;
    const parkings = navigation.getParam('param', []);
    const myLocation = navigation.getParam('myLocation', false);
    const directionScreen = navigation.getParam('drawPanel', false);
    const { coords,transitCoords, gpsLat, gpsLng, inputValue, distance, duration, destinationPanel, routes } = this.state;

    return (
      <View style={styles.container}>
        {directionScreen && <View style={cn(styles, 'destinationPanel')}><View key="drawPanel" style={styles.drawPanel}>
          <TextInput editable={false} value={inputValue} />
          <Button title="Wyznacz" onPress={this.runGetDirections} />
        </View>
          {distance && <View style={cn(styles, 'distancePanel')}>
            <Text style={cn(styles, 'text')}>{"Odległość: " + distance.text}</Text>
            <Text style={cn(styles, 'text')}>{" Czas: " + duration.text}</Text>
          </View>}
          {destinationPanel && <View style={styles.drawPanel}>
            <GooglePlaceInput handler={this.googlePlaceInputHandler} />
          </View>}
          {destinationPanel && routes.length > 0 && <RoutesList handler={this.routesListHandler} routes={routes}/>}
        </View>}
        {!destinationPanel && <MapView style={cn(styles, 'map',
          { mapWithPanel: directionScreen && !distance },
          { mapWithoutPanel: !directionScreen },
          { mapWithPanelAndDistance: directionScreen && distance })}
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
                if (directionScreen)
                  this.updateInputValue({
                    latitude: parseFloat(elem.gpsLat),
                    longitude: parseFloat(elem.gpsLng)
                  })
              }}
            >
              {directionScreen && <Callout><CustomCallout item={elem} /></Callout>}
            </Marker>
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
          {transitCoords.length > 0 && <MapView.Polyline
            coordinates={transitCoords}
            strokeWidth={2}
            strokeColor="red" />}
        </MapView>}
        {inputValue !== "" && <TouchableHighlight style={cn(styles, 'promps')} onPress={this.enableDestinationPanel}><View >
          <Text style={cn(styles, 'whiteText')}>{destinationPanel ? "Cofnij" : "Cel"}</Text>
        </View></TouchableHighlight>}
        

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
  mapWithoutPanel: {
    top: 0,
  },
  mapWithPanelAndDistance: {
    top: 40,
  },
  drawPanel: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: "relative",
  },
  text: {
    color: "black",

  },
  distancePanel: {
    width: '100%',
    height: 20,
    display: "flex",
    flexDirection: "row",
    backgroundColor: 'rgba(255,255,255,0.5)'
  },

  promps: {
    height: 60,
    width: 60,
    backgroundColor: "blue",
    position: "absolute",
    bottom: 40,
    right: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
  },
  whiteText: {
    color: "white",
    fontSize: 20,
  },
  destinationPanel: {
    position: "absolute",
    top: 0,
    zIndex: 100,
    width: "100%",
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  tmp: {
    position: "relative",
    zIndex: 110,
    top: 60,
    width: "100%",
    backgroundColor: 'white',
  }
});
