import React, {Component} from "react";
import {View, TextInput, StyleSheet, Text} from "react-native";

//Dostępne propsy:
/*
value - text wyświetlany w input
onChangeText - funkcja wołana na zmianę zawartości input
secureTextEntry- stosowane dla haseł
label - labelka opisująca input,
onFocus - akcja na wywołanie komponentu, wkliknięcie
*/
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