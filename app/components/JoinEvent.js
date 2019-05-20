import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';


var tempCheckValues = [];
export default class JoinEvent extends Component {
    constructor() {
        super()
        this.state = {
            checkBoxChecked: [],
            text: '',
            event: null,
            newTeamId: null,
            user: {
                id: "id1",
                email: "userapp@app.com",
                firstName: "user",
                lastName: "app"
            }
        }
    }

    // fetch event data from server
    async makeRemoteRequest(eventId) {
        try {
            let response = await fetch(
                `http://104.196.227.120/api/event/${eventId}`,
            );
            let responseJson = await response.json();
            this.setState({
                event: responseJson
            })
        } catch (error) {
            console.error(error);
        }
    }

    checkBoxChange(id, value) {
        // Set checkbox to false
        this.setState({
            checkBoxChecked: tempCheckValues
        })

        // Change checkbox values
        var tempCheckBoxChecked = this.state.checkBoxChecked;
        tempCheckBoxChecked[id] = !value;

        this.setState({
            checkBoxChecked: tempCheckBoxChecked
        })
    }


    onJoinTeam(teamId) {
        var tId = null
        if (teamId == null || teamId == undefined)
            tId = this.state.newTeamId;
        else
            tId = teamId;
        const user = this.state.user
        console.log(user)
        console.log(this.state.event.owner)
        const url = `http://104.196.227.120/api/event/team/member/${this.state.event.id}/${tId}`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)
                this.props.navigation.navigate('EventsList');
                Alert.alert("Congratulations! You have created new team and become it's first member!")
            })
            .catch((error) => {
                console.error(error);
            })
    }

    onCreateTeam = async (eventId) => {
        const newTeam = {
            name: this.state.text
        }
        // let name = this.state.text;
        const url = `http://104.196.227.120/api/event/team/${eventId}/`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTeam)
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    newTeamId: responseData.id
                })
                this.makeRemoteRequest(eventId)
                this.onJoinTeam();
            })
            .catch((error) => {
                console.error(error);
            })
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

    renderCheckboxes(params) {
        return params.teams.map((team) => {
            { tempCheckValues[team.id] = false }
            return (
                <View key={team.id} style={styles.checkBoxContainer}>
                    <CheckBox
                        checkedColor="green"
                        title={team.name}
                        checked={this.state.checkBoxChecked[team.id]}
                        onPress={() => this.checkBoxChange(team.id, this.state.checkBoxChecked[team.id])}
                    />
                </View>
            )
        })
    }

    render() {
        const { params } = this.props.navigation.state;
        if (this.state.event == null || this.state.event == undefined) {
            this.makeRemoteRequest(params.id)
            return (
                <View>
                    {this.renderFooter()}
                </View>
            )
        }
        else {
            return (
                <ScrollView style={styles.container}>
                    {/* <View style={styles.container2}>
                        <Text style={styles.text}>Pick team you wish to join</Text>
                        {this.renderCheckboxes(params)}
                        <View style={styles.buttonContainer}>
                            <Button
                                color="green"
                                title='SUBMIT'
                                onPress={() => this.onJoinTeam()} />
                        </View>
                    </View> */}
                    <View style={styles.container2}>
                        <Text style={styles.text}>If you would like to create new team just give us a team name!</Text>
                        <TextInput
                            style={styles.teamName}
                            placeholder="Type you team name here!"
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text} />
                        <View style={styles.buttonContainer}>
                            <Button
                                color="green"
                                title='SUBMIT'
                                onPress={() => this.onCreateTeam(params.id)}
                            />
                        </View>
                    </View>
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container2: {
        marginTop: 45
    },
    text: {
        fontSize: 20,
        margin: 10,
    },
    checkBoxContainer: {
        flexDirection: 'column'
    },
    teamName: {
        borderColor: "rgb(233,233,233)",
        backgroundColor: "rgb(250,250,250)",
        borderWidth: 1,
        margin: 10,
    },
    buttonContainer: {
        marginTop: 25,
        marginHorizontal: 50,
        marginBottom: 20,
    },
})
