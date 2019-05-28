import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, Alert } from "react-native";
import { ListItem } from "react-native-elements";

export default class EventsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      page: 0,
      error: null,
      refreshing: false
    }
  }

  // Method that is called after all the elements are rendered.
  // This method calls other method
  componentDidMount() {
    this.makeRemoteRequest();
  }

  // Method that fetch events data from API
  makeRemoteRequest = () => {
    const { page } = this.state;
    const url = `http://104.196.227.120/api/event/page/${page}/12`;
    this.setState({ loading: true });
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 0 ? res.events : [...this.state.data, ...res.events],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  // Method that handles refresh. This method restarts page to first one.
  handleRefresh = () => {
    this.setState(
      {
        page: 0,
        refreshing: true,
        loading: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  // After some data is load, and user scroll down, 
  // more data is loaded. This method adds one to variable page
  // and calls makeRemoteRequest() to fetch more data
  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
        loading: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  // Method that simply renders animated loading image
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

  // If event status is Open or Closed method navigate to EventDetails screen
  // otherwise - when status is InProgress it navigate to EventMap
  onNavigate = (item) => {
    console.log(item.teams);
    if (item.status == "Open" || item.status == "Closed") {
      this.props.navigation.navigate('EventDetails', { ...item });
    }
    else if (item.teams == undefined || item.teams == null || item.teams.length == 0) {
      Alert.alert("You are not in any team!");
    }
    else
      this.props.navigation.navigate('EventMap', { ...item });
  }

  // Simply change text color of propertie status
  _renderRightTitleStyle = (status) => {
    if (status == "Open")
      return { color: "green" }
    else if (status == "In progress")
      return { color: "orange" }
    else
      return { color: "red" }
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      bottomDivider={true}
      title={item.name}
      leftIcon={{ color: "green", size: 40, name: "map" }}
      subtitleProps={{ numberOfLines: 2 }}
      subtitle={item.description}
      rightTitleStyle={this._renderRightTitleStyle(item.status)}
      rightTitle={item.status}
      rightSubtitle={"Checkpoints: " + item.checkpointCount}
      onPress={() => this.onNavigate(item)}
    />
  )

  render() {
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.data}
        renderItem={this.renderItem}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={0.001}
      />
    )
  }
}