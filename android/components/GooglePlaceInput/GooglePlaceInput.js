
import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class GooglePlaceInput extends Component {
    render() {

        return (
        /*
Source: https://github.com/FaridSafi/react-native-google-places-autocomplete
*/
            <GooglePlacesAutocomplete
                placeholder='Search'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                listViewDisplayed={false }   // true/false/undefined
                fetchDetails={true}
                //renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    this.props.handler(details);
                }}

                getDefaultValue={() => ''}

                query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyBTBdvfJUhATPLp6dBl_eNmd5Dj8guOsw8',
                    language: 'pl', // language of the results
                    types: 'address' // default: 'geocode'
                }}

                styles={{
                    textInputContainer: {
                        width: '100%',
                        height:40,
                    },
                    description: {
                        fontWeight: 'bold'
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb'
                    }
                }}

                currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                //currentLocationLabel="Current location"
                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}
                GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance',
                    types: 'food'
                }}


                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                
                //debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                //handler = {()=>{}}
            />
        );
    }
}