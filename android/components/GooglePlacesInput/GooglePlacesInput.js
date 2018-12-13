import RNGooglePlaces from 'react-native-google-places';
import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, TextInput} from 'react-native'

export default class GooglePlacesInput extends Component {
    openSearchModal() {
      RNGooglePlaces.openAutocompleteModal()
      .then((place) => {
          console.log(place);
          // place represents user's selection from the
          // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
    }
  
    render() {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.openSearchModal()}
            placeholder="Search"
          >
          </TouchableOpacity>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
      container:{
          width:'100%',
      },
      button:{
          borderBottomWidth:2,
          borderBottomColor:'black',
          
      }
  })