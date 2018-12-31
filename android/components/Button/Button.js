import React, {Component} from  "react";
import {TouchableHighlight, Text, StyleSheet} from "react-native";


//size [medium, small, large]
//
export default class Button extends Component{
        

    render(){
        const {onPress, text, size="medium" } = this.props;
        return <TouchableHighlight underlayColor="#00BFFF" onPress={onPress} style={[styles[size], styles.Button]}>
            <Text style={styles.color}>{text}</Text>
        </TouchableHighlight>
    }
}
const styles = StyleSheet.create({
    large:{
        width:"100%",
        height:80,
    },
    small:{
        width: "100%",
        height: 40,
    },
    medium:{
        width: "100%",
        height: 50,
    },
    Button:{
        backgroundColor:"white",
        borderColor:"#00BFFF",
        borderWidth:5,
        margin:10,
        padding:10,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        marginLeft:"auto",
        marginRight:"auto",
        borderRadius:10,
        
    },
    color:{
        color: "#00BFFF",
    }
})