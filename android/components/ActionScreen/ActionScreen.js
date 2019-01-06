import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
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
            loading: true,
        }
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    componentDidMount() {
        const user = this.props.navigation.getParam('user', {});
        this.setState({ user: user });

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
            { enableHighAccuracy: true, timeout: 5000 },
        );

        this.watchID = navigator.geolocation.watchPosition.bind(this)((position) => {
            this.setState({
                gpsLat: position.coords.latitude,
                gpsLng: position.coords.longitude,
                error: null,
            }, this.getBestRoad);
        },
            (error) => { this.setState({ error: error.message }) },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000, distanceFilter: 5 })


    }

    getBestRoad = () => {
        axios.get(`https://parkandrideapp.azurewebsites.net/Parking/mobilebestRoad?gpsLat=${this.state.gpsLat}&gpsLng=${this.state.gpsLng}`).then(res => {
            const bestParkings = res.data;
            this.setState({ bestParkings, loading: false });
        });
    }

    render() {
        const { navigation } = this.props;
        const navigate = navigation.getParam('navigate', () => { });
        const { parkings, bestParkings, coords, loading, user } = this.state;

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
            drawPanel: true, user:user,
        }
        const buttonAccount = {
            content: "Konto",
            screen: "Account", navigate: navigate, param: user, myLocation: false,
        }
        const buttonLoguot = {
            content: "Wyloguj", type: true,
            screen: "MapList", navigate: navigate
        }

        return <><View style={styles.Container}>
            <MyButton metadata={buttonMapList} />
            <MyButton metadata={buttonList} />
            <MyButton metadata={buttonLocation} />
            <MyButton metadata={buttonBestRoad} />
            <MyButton metadata={buttonAccount} />
            <MyButton metadata={buttonLoguot} />

        </View>
             { loading && <View style={styles.loading}>
                <ActivityIndicator size="large" color="#3385ff"></ActivityIndicator>
            </View>}
        </>
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
        backgroundColor: "#3385ff",
    },
    GooglePlaceInputView: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        position: 'absolute',
        top: 0,
        zIndex: 100,
        width: '100%'
    },
    loading: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "white",
    }
})