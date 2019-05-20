import React from 'react';
import { createStackNavigator, createAppContainer,  } from 'react-navigation';

import EventsList from '../components/EventsList';
import EventMap from '../components/EventMap';
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
    }
});

const AppContainer = createAppContainer(AppNavigator)

export default AppContainer;