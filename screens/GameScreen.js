import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { ScreenOrientation } from 'expo';
import Game from '../components/Game';

import { WebView } from 'react-native-webview';

export default class GameScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    }

    this.onLayout = this.onLayout.bind(this);

  }

  onLayout(e) {
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    });
  }

  async landscape() {
    await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.LANDSCAPE)
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    });
  }

  async potrait() {
    await ScreenOrientation.unlockAsync();
  }

  componentDidMount(){
    this.landscape();
  }

  componentWillUnmount(){
    this.potrait();
  }

  render(){
    const { gameURL, imageURL } = this.props.navigation.state.params;
    console.log(gameURL, imageURL);
    return (
    <Game 
      onLayout={this.onLayout} 
      navigation={this.props.navigation} 
      gameURL={gameURL}
      imageURL={imageURL}
    />);
  }
}

GameScreen.navigationOptions = {
  title: 'Game',
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
