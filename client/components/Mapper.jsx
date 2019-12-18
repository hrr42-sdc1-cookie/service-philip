import React, { Component } from 'react';
import axios from 'axios';
import { GoogleApiWrapper, Map as GoogleMap, Marker } from 'google-maps-react';
import apiKey from '../config/googlemaps';


const params = (new URL(document.location)).searchParams;
const restId = parseInt(params.get('restaurantid'), 10) || 92;

class Map extends Component {
  constructor(props) {
    super(props);
    //  restaurant number will be passed into props from overview
    //  along with street address
    this.restId = restId || 92;
    this.restAddress = '1313 Mockingbird Lane';
    const initialCoords = {
      latitude: 37.739,
      longitude: -122.431,
    };
    this.state = { coords: initialCoords };
    this.getCoordinates.bind(this);
    this.getCoordinates(this.restId);
  }

  getCoordinates(restaurantid) {
    axios.get(`http://localhost:3002/mapper/${restaurantid}`)
      .then(res => {
        const { coords } = this.state;
        if (res.data[0] !== undefined && res.data[0] !== {}) {
          coords.latitude = res.data[0].latitude;
          coords.longitude = res.data[0].longitude;
        }
        coords.gotData = true;
        this.setState({ coords });
      });
  }

  render() {
    //  prevent call to gmaps before we have gotten our coordinates
    const { coords } = this.state;
    const { google } = this.props;
    if (!coords.gotData) {
      return <div />;
    }

    const mapStyle = {
      marginTop: '20px',
      marginBottom: '20px',
      marginLeft: 'auto',
      marginRight: 'auto',
      left: '-15px',
      width: '320px',
      height: '220px',
      border: '2px solid lightgrey',
    };

    return (
      <div id="mapper-container">
        <GoogleMap
          google={google}
          style={mapStyle}
          initialCenter={{ lat: coords.latitude, lng: coords.longitude }}
        >
          <Marker position={{ lat: coords.latitude, lng: coords.longitude }} />
        </GoogleMap>
      </div>
    );
  }
}

const MapWrapper = GoogleApiWrapper({ apiKey })(Map);

const Mapper = () => <div><MapWrapper /></div>;

export default Mapper;
