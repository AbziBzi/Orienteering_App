import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, ScrollView } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

export default class EventDetails extends Component {
    
    // Method that navigate to JoinEvent, when you can join or create team.
    onJoinEvent = () => {
        this.props.navigation.navigate('JoinEvent', this.props.navigation.state.params)
    }

    // If event is open but not in progress you can see only first point.
    // When it's closed you can see ale of them.
    setCheckpoints(status, checkpoints) {
        var check = [];
        if (status == "Open")
            check[0] = checkpoints[0];
        else {
            for (let i = 0; i < checkpoints.length; i++)
                check[i] = checkpoints[i];
        }
        return check
    }

    renderButton(status){
        if(status == "Open"){
        return(
            <Button color="green" title="Join Event" onPress={() => this.onJoinEvent()} />
        );
        }
        return null;
    }

    render() {
        const { status, description, checkpointCount, teamSize, created,
            starting, estimatedTimeMillis, estimatedDistanceMetres, checkpoints } = this.props.navigation.state.params;
        check = this.setCheckpoints(status, checkpoints);
        return (
            <View style={styles.container}>
                <View style={styles.map}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        mapType={"hybrid"}
                        style={{ ...StyleSheet.absoluteFillObject }}
                        initialRegion={{
                            latitude: checkpoints[0].latitude,
                            longitude: checkpoints[0].longitude,
                            longitudeDelta: LONGITUDE_DELTA,
                            latitudeDelta: LATITUDE_DELTA
                        }}>
                        {check.map(marker => (
                            <MapView.Marker
                                key={marker.id}
                                title={marker.name}
                                coordinate={{
                                    latitude: marker.latitude,
                                    longitude: marker.longitude
                                }} />
                        ))}
                    </MapView>
                </View>
                <ScrollView style={styles.descriptionContainer}>
                    <Text style={styles.description}>{description}</Text>
                </ScrollView>
                <View style={styles.detailsContainer}>
                    <View style={styles.details}>
                        <Text style={styles.detailsText}>Members in Team:</Text>
                        <Text>{teamSize}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.detailsText}>Number of Checkpoints:</Text>
                        <Text>{checkpointCount}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.detailsText}>Created at:</Text>
                        <Text>{(created !== undefined) ? created.split('T')[0].trim() : ''}</Text>
                    </View>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.details}>
                        <Text style={styles.detailsText}>Estimated Time:</Text>
                        <Text>{Number((estimatedTimeMillis / 3600000)).toFixed(0)} hours</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.detailsText}>Estimated Distance:</Text>
                        <Text>{Number((estimatedDistanceMetres / 1000)).toFixed(1)} kilometers</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.detailsText}>Starts on:</Text>
                        <Text>{(starting !== undefined) ? starting.split('T')[0] : ''}</Text>
                        <Text>{(starting !== undefined) ? starting.split('T')[1].split(':')[0] : ''}:{(starting !== undefined) ? starting.split('T')[1].split(':')[1] : ''}</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    {this.renderButton(status)}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 100 + '%',
        height: 100 + '%',
    },
    map: {
        width: 100 + '%',
        height: 60 + '%',
    },
    descriptionContainer: {
        borderColor: "rgb(233,233,233)",
        backgroundColor: "rgb(250,250,250)",
        borderWidth: 1,
        margin: 3,

    },
    description: {
        margin: 8,
        fontSize: 16,
    },
    detailsContainer: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        backgroundColor: "rgb(250,250,250)",
        borderColor: "rgb(233,233,233)",
        borderWidth: 1,
        margin: 5
    },
    details: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 5
    },
    detailsText: {
        borderBottomWidth: 2,
        borderBottomColor: "rgb(233,233,233)",
        marginBottom: 10,
        fontWeight: 'bold',
    },
    buttonContainer: {
        margin: 5,
        marginBottom: 20
    }
})