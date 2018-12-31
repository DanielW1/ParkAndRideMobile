import React, {Component} from "react";
import {View, TextInput, StyleSheet, Text} from "react-native";

export default class CustomTextInput extends Component{
    constructor(){
        super();
        this.state={
            value:"",
        }
    }
    render(){
        const { value, onChangeText, secureTextEntry,label, onFocus} = this.props;
        return <View style={styles.textInput}>
            <Text>{label}</Text>
            <TextInput secureTextEntry={secureTextEntry} 
            onChangeText={(text)=>onChangeText(text)} 
            value={value}
            onFocus={onFocus}></TextInput>
        </View>
    }
}

const styles = StyleSheet.create({
    textInput:{
        borderBottomColor:"gray",
        borderBottomWidth:2,
        paddingTop:10,
    }
})