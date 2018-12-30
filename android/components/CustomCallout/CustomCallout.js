import React,{Component} from "react"
import {Text,View, StyleSheet} from "react-native"
import cn from 'react-native-classnames'

export default class CustomCallout extends Component{

    render(){
        const {item} = this.props;
        return <View>
        <Text>{item.name}</Text>
        <Text style={cn(styles,{redColor:item.numberOfFreePlaces < 10},
        {greenColor:item.numberOfFreePlaces > 9}, )}>{"Liczba wolnych miejsc: "+item.numberOfFreePlaces}</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    redColor:{
        color:"red"
    },
    greenColor:{
        color:"green"
    }
})