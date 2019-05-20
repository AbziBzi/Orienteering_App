import React from 'react';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import EventsList from '../components/EventsList';
import EventMap from '../components/EventMap';
import MarkerCamera from '../components/MarkerCamera';
import EventDetails from '../components/EventDetails';
import JoinEvent from '../components/JoinEvent';
import TabContainer from './TabNavigator';



const AppNavigator = createStackNavigator({
    EventsList: {
        screen: EventsList,
        navigationOptions: {
            title: 'Events',
            headerStyle: {
                backgroundColor: 'green',
            },
            headerTitleStyle: {
                color: 'white',
                flex: 1,
                textAlign: 'center',
            },
        },
    },
    EventDetails:
    {
        screen: EventDetails,
        navigationOptions: ({ navigation }) => ({
            title: `${navigation.state.params.name.toUpperCase()}`,
            headerStyle: {
                backgroundColor: 'green',
            },
            headerTitleStyle: {
                color: 'white',
                flex: 1,
                textAlign: 'center',
                marginRight: 65,
            }
        }),
    },
    JoinEvent: {
        screen: JoinEvent,
        navigationOptions: ({ navigation }) => ({
            title: `${navigation.state.params.name.toUpperCase()}`,
            headerStyle: {
                backgroundColor: 'green',
            },
            headerTitleStyle: {
                color: 'white',
                flex: 1,
                textAlign: 'center',
                marginRight: 65,
            }
        }),
    },
    EventMap: {
        screen: EventMap,
        navigationOptions: ({ navigation }) => ({
            title: `${navigation.state.params.name.toUpperCase()}`,
            headerStyle: {
                backgroundColor: 'green',
            },
            headerTitleStyle: {
                color: 'white',
                flex: 1,
                textAlign: 'center',
                marginRight: 65,
            }
        }),
    },
    MarkerCamera: {
        screen: MarkerCamera,
        navigationOptions: ({ navigation }) => ({
            // title: `${navigation.state.params.name.toUpperCase()}`
        }),
    },
});

const AppContainer = createAppContainer(AppNavigator)

export default AppContainer;