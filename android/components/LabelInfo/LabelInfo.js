import React, {Component} from "react"
import {View, Text, StyleSheet} from "react-native"
//type [complete lub error]
export default class LabelInfo extends Component{

    render(){
        const {label, type} = this.props;
        return <View style={[styles.LabelInfo, styles[type]]}>
            <Text>{label}</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    LabelInfo:{
        width:"100%",
        padding:15,
        margin:10,
        display:"flex",
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:5,

    },
    error:{
        borderColor:"red",
        color:"red"
    },
    complete:{
        borderColor:"green",
        color:"green",
    }
})