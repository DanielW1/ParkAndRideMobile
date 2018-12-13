import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import axios from 'axios';


export default class MapListScreen extends Component {
    static navigationOptions = {
        title: 'Parkingi',
      };

    constructor(props) {
        super(props);
        this.navigation = props.navigation;
    }

    keyExtractor = (item, index) => index

    renderItem = ({ item }) => (
       
        <ListItem
            title={item.name}
            leftIcon={{ name: 'av-timer' }}
            containerStyle={{ borderBottomWidth: 1, borderBottomColor:"black" }}
            onPress={() => this.navigation.navigate("ListItem",{parking:item})}
        />
    )


    render() {
        const { navigation } = this.props;
        const parkings = navigation.getParam('param', []);

        return (
            <View>
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={parkings}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }

    // render() {
    //         const {navigate} =this.props.navigation
    //     return (
    //         <View>
    //             <ScrollView>
    //                 {
    //                     this.state.parkings.map((elem, i) => (
    //                         <ListItem
    //                             key={i}
    //                             title={elem.name}
    //                             leftIcon={{ name: 'av-timer' }}
    //                             onPress={()=> navigate('ListItem', {parking:elem})}
    //                         />
    //                     ))
    //                 }
    //             </ScrollView>
    //         </View>
    //     )
    // }
}