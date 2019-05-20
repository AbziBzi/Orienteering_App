import React from 'react';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import EventsList from '../components/EventsList';
import EventMap from '../components/EventMap';
import MarkerCamera from '../components/MarkerCamera';
import EventDetails from '../components/EventDetails';

const TabNavigator = createBottomTabNavigator({
    EventDetails: {
        screen: EventDetails,
        navigationOptions: {
            tabBarLabel: 'EventDetails',
            tabBarIcon: ({ tintColor }) => <Icon name="home" size={35} color={tintColor} />,
            tabBarOptions: { activeTintColor: 'green', },
        },
    },
    EventsList: {
        screen: EventsList,
        navigationOptions: {
            tabBarLabel: 'EventsList',
            tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />,
            tabBarOptions: { activeTintColor: 'green', }
        }
    }
},
);

const TabContainer = createAppContainer(TabNavigator)

export default TabContainer;