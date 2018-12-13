import React, { Component } from 'react';
import { View, Text, Button} from 'react-native';
import { ListItem } from 'react-native-elements';

export default class ListItemScreen extends Component{
    
    render(){
        const {navigation}= this.props;
        const parking = navigation.getParam('parking',{})

        return(<View>
            <Text>{`Nazwa: ${parking.name}`}</Text>
            <Text>{`Lokalizacja: ${parking.place} ${parking.street} ${parking.number}`}</Text>

            <Text>{`Liczba wolnych miejsc: ${parking.numberOfPlaces}`}</Text>
            <Button title="Pokaż na mapie" onPress={()=> navigation.navigate("Map",{param:[parking]})}/>
        </View>)
    }
}