import React, { Component } from "react";
import { StyleSheet, Text, TouchableHighlight, Image, View } from "react-native"

const iconAddress = {
    WALKING: <Image source={require("../../../src/image/walking.png")} style={{ width: 30, height: 30 }}></Image>,
    BUS: <Image source={require("../../../src/image/bus.png")} style={{ width: 30, height: 30 }}></Image>,
    SUBWAY: <Image source={require("../../../src/image/subway.png")} style={{ width: 30, height: 30 }}></Image>,
    TRAM: <Image source={require("../../../src/image/tram.png")} style={{ width: 30, height: 30 }}></Image>,
    HEAVY_RAIL: <Image source={require("../../../src/image/train.png")} style={{ width: 30, height: 30 }}></Image>,

}

export default class RoutesListItem extends Component {

    renderRouteList = () => {
        const { route } = this.props;
        const { steps } = route.legs[0];
        return steps.map((elem, index) => {
            if (elem.travel_mode === "WALKING") {
                return  <Text key={index + "travel_mode"}>{iconAddress.WALKING} ></Text>
                
            } else {
                return <Text key={index + "travel_mode"} >
                {iconAddress[elem.transit_details.line.vehicle.type]}{elem.transit_details.line.short_name}>
                </Text>
            }
        })
    }

    renderRouteTimeInfo = () => {
        const { route } = this.props;
        const { departure_time, arrival_time, duration } = route.legs[0];

        return `Odjazd: ${departure_time.text} Przyjazd:${arrival_time.text} Czas:${duration.text}`
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


        return <><TouchableHighlight underlayColor="white"
            onPress={this.runHandlerMethod} style={styles.RoutesListItem}>
            <>
                <View style={styles.RoutesListItemRow}>
                    <Text style={styles.row}>
                        {this.renderRouteList().map(elem => elem)}
                    </Text>
                </View>
                <Text>{this.renderRouteTimeInfo()}</Text>
            </>
        </TouchableHighlight>

        </>
    }
}

const styles = StyleSheet.create({
    RoutesListItemRow: {
        display: "flex",
        flexDirection: "column",
    },
    RoutesListItem: {
        borderWidth: 1,
        borderColor: "black",
        padding: 5,
        margin: 5,
    },
    row: {
        padding: 10,
    }
})
