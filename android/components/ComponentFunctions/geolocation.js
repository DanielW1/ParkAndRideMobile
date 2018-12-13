export default function getMyCurrentPosition(){
navigator.geolocation.getCurrentPosition.bind(this)(
    (position) => {     
      this.setState({     
        gpsLat: position.coords.latitude,     
        gpsLng: position.coords.longitude,     
        error: null,     
      });  
    },

    (error) => this.setState({ error: error.message }),      
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },     
  );
}