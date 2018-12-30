import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MyButton from "./../MyButton";
import axios from 'axios';
import GooglePlaceInput from '../GooglePlaceInput';



export default class ActionScreen extends Component {
    static navigationOptions = {
        title: 'Map',
    };

    constructor(props) {
        super(props);
        this.state = {
            parkings: [],
            gpsLat: "52.27",
            gpsLng: "21.15",
            name: "",
            bestParkings: [],
            coords: [],
        }

    }

    componentDidMount() {
        axios.get('https://parkandrideapp.azurewebsites.net/Parking/mobilelist').then(res => {
            const parkings = res.data;
            this.setState({ parkings });
        });



        navigator.geolocation.getCurrentPosition.bind(this)(
            (position) => {
                console.log(position);
                this.setState({
                    gpsLat: position.coords.latitude,
                    gpsLng: position.coords.longitude,
                    error: null,
                }, this.getBestRoad);
            },

            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000 },
        );


    }

    getBestRoad = () => {
        axios.get(`https://parkandrideapp.azurewebsites.net/Parking/mobilebestRoad?gpsLat=${this.state.gpsLat}&gpsLng=${this.state.gpsLng}`).then(res => {
            const bestParkings = res.data;
            this.setState({ bestParkings });
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        const { parkings, bestParkings, coords } = this.state;

        const buttonMapList = {
            content: "Zobacz na mapie", type: true,
            screen: "Map", navigate: navigate, param: parkings
        };
        const buttonList = {
            content: "Lista parkingów", type: true,
            screen: "ParkingList", navigate: navigate, param: parkings
        }
        const buttonLocation = {
            content: "Lokalizacja", type: true,
            screen: "Map", navigate: navigate, param: [], myLocation: true,
        }
        const buttonBestRoad = {
            content: "Najlepszy dojazd", type: true,
            screen: "Map", navigate: navigate, param: bestParkings, myLocation: true,
            drawPanel: true
        }
        const buttonLoguot = {
            content: "Wyloguj", type: true,
            screen: "MapList", navigate: navigate
        }

        return <View style={styles.Container}>

            {/* <View style={styles.GooglePlaceInputView}>
                <GooglePlaceInput />
            </View> */}
            <MyButton metadata={buttonMapList} />
            <MyButton metadata={buttonList} />
            <MyButton metadata={buttonLocation} />
            <MyButton metadata={buttonBestRoad} />
            <MyButton metadata={buttonLoguot} />

        </View>
    }
}

const styles = StyleSheet.create({
    Container: {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    GooglePlaceInputView: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        position: 'absolute',
        top: 0,
        zIndex:100,
        width:'100%'
    }
})