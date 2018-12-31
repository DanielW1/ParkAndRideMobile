import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native"

export default class RoutesListItem extends Component {

    calculateRoads = () => {
        const { route } = this.props;
        const { steps, departure_time } = route.legs[0];
        let result = steps.reduce((agrr, current, index) => {
            return agrr += ((current.travel_mode === "WALKING" ?
                current.travel_mode : current.transit_details.line.vehicle.type) +
                (current.travel_mode != 'WALKING' ? ` ${current.transit_details.line.short_name}` : "") + " > ")
        }, "");
        return result.substring(0,result.length-2)+" "+ departure_time.text;
    }

    calculateDuratiuon = () => {
        const { route } = this.props;
        const { duration } = route.legs[0];
        return duration.text;
    }

    runHandlerMethod = () => {
        this.props.handler(this.props.route);
    }


    render() {


        return <TouchableHighlight onPress={this.runHandlerMethod} style={styles.RoutesListItem}>
            <>
                <Text>{this.calculateRoads()}</Text>
                <Text>{this.calculateDuratiuon()}</Text>
            </>
        </TouchableHighlight>
    }
}

const styles = StyleSheet.create({
    RoutesListItem: {
        borderBottomWidth: 1,
        borderBottomColor: "black",
        height: 40,
        display: "flex",
        flexDirection: "row",
    }
})
