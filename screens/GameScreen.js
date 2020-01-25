import React from 'react';
import { ScrollView, StyleSheet, View, Tex } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { ScreenOrientation } from 'expo';
import Game from '../components/Game';

import { WebView } from 'react-native-webview';

export default class GameScreen extends React.Component {

  async landscape() {
    await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.LANDSCAPE)
  }

  async potrait() {
    await ScreenOrientation.unlockAsync();
  }

  componentDidMount(){
    //this.landscape();
  }

  componentWillUnmount(){
    //this.potrait();
  }

  render(){
    return <Game/>;
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
