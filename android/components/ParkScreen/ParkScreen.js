import React, {Component} from "react";
import {View, Text, StyleSheet, Alert} from "react-native";
import Button from "../Button";
import { formatDataNow } from "../ComponentFunctions/time";
import axios from "axios";


export default class ParkScreen extends Component{

  async  onPressParkHandler() {
        const { navigation } = this.props;
        const { parking, user } = navigation.state.params;

       await axios({
            method: 'post',
            url: 'https://parkandrideapp.azurewebsites.net/card/post',
            headers: { 'Content-Type': 'application/json' },
            data: {
                parkingId: parking.parkingId,
                userId: user.UserId,
                dataFrom:formatDataNow(),
            }

        }).then((resp) => {
            Alert.alert("Zarejestrowano postój", "Aby zakończyć postój przejdź do konta");
        }).catch(err => {
            Alert.alert("Nieudana rejestracja postoju\n ", err.request._response);
        });
    }

    render(){
        const {navigation} = this.props;
        const { parking, user } = navigation.state.params;

        return <View style={styles.ParkScreen}>
            <Text style={styles.size}>Nazwa: {parking.name}</Text>
            <Text style={styles.size}>Miejsce: {parking.place}</Text>
            <Text style={styles.size}>Ulica: {parking.street}</Text>
            <Button onPress={()=>this.onPressParkHandler()} text="Parkuję" size="medium"/>
        </View>
    }
}

const styles= StyleSheet.create({
    ParkScreen:{
        display:"flex",
        flexDirection:"column",
        flex:1,
        alignItems:"center",
    },
    size:{
        fontSize:20,
        fontWeight:'bold',
    }
})