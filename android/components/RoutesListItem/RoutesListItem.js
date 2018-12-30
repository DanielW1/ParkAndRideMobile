import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableHighlight} from "react-native"

export default class RoutesListItem extends Component {

    calculateRoads = () => {
        const { route } = this.props;
        const { steps } = route.legs[0];

        let result = steps.reduce((agrr, current, index) => {
            return agrr += (current.travel_mode + ">")
        }, "");
        return result;
    }

    runHandlerMethod =()=>{
        this.props.handler(this.props.route);
    }


    render() {


        return <TouchableHighlight onPress={this.runHandlerMethod} style={styles.RoutesListItem}>
            <Text>{this.calculateRoads()}</Text>
        </TouchableHighlight>
    }
}

const styles = StyleSheet.create({
    RoutesListItem:{
        borderBottomWidth:1,
        borderBottomColor:"black",
        height:40,
    }
})
