import React, { Component } from 'react';
import { StyleSheet, View ,Text} from 'react-native';
import MyButton from "./../MyButton";
import axios from 'axios';
import GooglePlacesInput from '../GooglePlacesInput';



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
            bestParkings:[],
            coords:[],
        }

    }

    componentDidMount() {
        axios.get('https://parkandrideapp.azurewebsites.net/Parking/mobilelist').then(res => {
          const parkings = res.data;
          this.setState({ parkings });
        });

       
       /*return fetch('https://parkandrideapp.azurewebsites.net/Parking/mobilebestroad', {
            method: "POST",
            headers:new Headers ({
                'Accept': "application/json",
                'Content-Type': "application/json",
            }),
            body: JSON.stringify({
                gpsLat: 52.00,
                gpsLng: 21.00,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                const parkings = responseJson;
                 this.setState({parkings})
                    
            }).catch((error)=>{
                console.log(error);
            })*/
        // axios.post('https://parkandrideapp.azurewebsites.net/Parking/mobilebestroad', {
        //     gpsLat: 52.00,
        //     gpsLng: 21.00,
        //   })
        //   .then((response) => {
        //     const parkings = response.data;
        //     this.setState({parkings})
        //   })
        //    .catch((error) => {
        //      this.setState({error})
        //   });

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
            screen: "Map", navigate: navigate,param:[], myLocation:true, 
        }
        const buttonBestRoad = {
            content: "Najlepszy dojazd", type: true,
            screen: "Map", navigate: navigate, param: bestParkings,myLocation:true,
        }
        const buttonLoguot = {
            content: "Wyloguj", type: true,
            screen: "MapList", navigate: navigate
        }

        return <View style={styles.Container}>
            {/* <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
            /> */}
            <GooglePlacesInput/>
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
    }
})