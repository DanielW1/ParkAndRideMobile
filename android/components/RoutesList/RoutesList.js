import React,{Component} from "react";
import {View, StyleSheet} from "react-native"
import RoutesListItem from "../RoutesListItem/RoutesListItem";

export default class RoutesList extends Component{

    render(){
        const{routes, handler} = this.props;
       
        return <View style={styles.RoutesListContainer}>{
            routes.map((elem) => <RoutesListItem handler={handler} route={elem}/>)
        }</View>
    }
}

const styles = StyleSheet.create({
    RoutesListContainer:{
      borderRadius:10,
      borderWidth:2,
      borderColor:"gray",
    }
})