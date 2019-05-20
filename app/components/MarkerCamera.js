import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Alert, ToastAndroid, PermissionsAndroid, CameraRoll } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class MarkerCamera extends Component {
    constructor() {
        super()
        this.state = {
            filePath: ''
        }
    }

    takePicture = async function (params) {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);
            this.setState({
                filePath: data.uri
            },
                this.sendPicture(data, params))
        }
    };

    sendPicture = (data1, params) => {
        const path = 'file:///data/user/0/com.testt/cache/Camera/example.jpg'
        const url = `http://104.196.227.120/api/file/photo/${params.params.id}/${params.params.teams[0].id}/${params.marker}`;

        let file = new FormData();
        file.append('file',{
            uri: path
        });
        console.log(file)

        fetch(url, {
            method: "post",
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: file,
        }).then((response) => response.json())
        .then((responseData) => {
            console.log(responseData);
        })
        .catch((error) => {
            console.error(error);
        })
    }

    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.front}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    onGoogleVisionBarcodesDetected={({ barcodes }) => {
                        console.log(barcodes);
                    }}
                />
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.takePicture.bind(this, params)} style={styles.capture}>
                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});