import React, { Component } from 'react';
import { StyleSheet, View, Alert, Button, Text, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import ImagePicker from 'react-native-image-picker';
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = 0.05;

export default class EventMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      photo: null,
      event: null,
      error: null,
      location: null,
    }
  }

  componentDidMount() {
    this.findCoordinates();
  }

  // Getting user coordinates
  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ location: position });
      },
      error => { },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  };

  // Fetching event data
  async makeRemoteRequest(eventId) {
    try {
      let response = await fetch(
        `http://104.196.227.120/api/event/${eventId}`,
      );
      let responseJson = await response.json();
      this.setState({
        event: responseJson
      })
      this.renderMarkers(responseJson, responseJson.checkpoints, responseJson.teams)
    } catch (error) {
      console.error(error);
    }
  }

  // Checking distance between marker and user
  // If user is too far, he will not able to check checkpoint
  getDistance(marker, location) {
    for (let count = 0; count < 10 && location == null; count++) {
      this.findCoordinates();
    }
    if (location == null)
      Alert.alert("Location not found!")
    else {
      delta = 0.02;
      markerLat = marker.latitude;
      markerLon = marker.longitude;
      userLat = location.coords.latitude;
      userLon = location.coords.longitude;

      var lat = Math.abs(markerLat - userLat);
      var lon = Math.abs(markerLon - userLon);

      if (lat < delta && lon < delta)
        return true
      return false
    }
    return null
  }

  // Image-Picker that leting use default phone camera to make photo
  handleChoosePhoto = (params, marker) => {
    this.findCoordinates();
    bool = this.getDistance(marker, this.state.location)
    console.log(bool)
    const options = {
      quality: 0.5,
      noData: true,
    };
    if (bool && !this.state.event.teams[0].checkedCheckpoints.includes(marker.id)) {
      ImagePicker.launchCamera(options, response => {
        if (response.uri) {
          this.setState({
            photo: response,
          },
            () => this.sendPicture(params, marker));
        }
      });
    }
    else if (bool === false) {
      Alert.alert("You are too far away!")
    }
    else if (this.state.event.teams[0].checkedCheckpoints.includes(marker.id))
      Alert.alert("You have checkd this marker!")
  };

  // Sending picture to server
  sendPicture = (params, marker) => {
    const url = `http://104.196.227.120/api/file/photo/${params.id}/${params.teams[0].id}/${marker.id}`;

    const uri = this.state.photo.uri;
    const type = this.state.photo.type;
    let file = new FormData();
    file.append('file', {
      name: `eventId_${params.id}_teamId${params.teams[0].id}_photo`,
      type: type,
      uri: uri
    });

    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: file
    }).then((response) => response.json())
      .then((responseData) => {
        if (this.state.event.teams[0].checkedCheckpoints.length +1 == this.state.event.checkpointCount) {
          Alert.alert("Congratulations! Your team have checked all points!")
        }
        else
          Alert.alert("You have succesfull checked " + marker.id + " checkpoint");
        this.makeRemoteRequest(params.id)
      })
      .catch((error) => {
        console.error(error);
      })
  }
  // Sets markers color. If markes is checked then color - yellow
  // If marker not yet checked- color: default/red
  setMarkerColor(marker, teams) {
    if (teams.length == 0)
      return 'red'
    else {
      for (var i = 0; i < teams[0].checkedCheckpoints.length; i++) {
        if (marker.id == teams[0].checkedCheckpoints[i])
          return 'yellow'
      }
    }
  }

  // Renders all markers- checkpoints
  renderMarkers(params, checkpoints, teams) {
    return (
      checkpoints.map(marker => (
        <MapView.Marker
          key={`${marker.id}${Date.now()}`}
          identifier={marker.id}
          title={marker.name}
          pinColor={this.setMarkerColor(marker, teams)}
          onCalloutPress={() => this.handleChoosePhoto(params, marker)}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude
          }}
        />
      ))
    )
  }

  // renders "loading" animated image
  renderFooter = () => {
    if (this.state.loading == false)
      return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    const { params } = this.props.navigation.state;

    if (this.state.event == null || this.state.event == undefined) {
      this.makeRemoteRequest(params.id);
      return (
        <View>
          {this.renderFooter()}
        </View>
      );
    }
    else {
      return (
        <View style={styles.mapContainer}>
          <MapView
            ref="map"
            provider={PROVIDER_GOOGLE}
            mapType={"hybrid"}
            style={{ ...StyleSheet.absoluteFillObject }}
            showsCompass={true}
            showsMyLocationButton={true}
            showsUserLocation={true}
            initialRegion={{
              latitude: this.state.event.checkpoints[0].latitude,
              longitude: this.state.event.checkpoints[0].longitude,
              longitudeDelta: LONGITUDE_DELTA,
              latitudeDelta: LATITUDE_DELTA
            }}
          >
            {this.renderMarkers(this.state.event, this.state.event.checkpoints, this.state.event.teams)}
          </MapView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    marginBottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
    margin: 20,
  },
});