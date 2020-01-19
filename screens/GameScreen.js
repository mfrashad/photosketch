import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { ScreenOrientation } from 'expo';

import { WebView } from 'react-native-webview';

export default class GameScreen extends React.Component {

  async landscape() {
    await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.LANDSCAPE)
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
    console.log(`http://www.mfrashad.com/phaser-platform-game/?map=${this.props.navigation.state.params.uploadResult.link_to_file}`.replace(/['"]+/g, ""))
  return <WebView source={{ uri: `https://www.mfrashad.com/phaser-platform-game/?map=${this.props.navigation.state.params.uploadResult.link_to_file}`.replace(/['"]+/g, "") }} style={{ marginTop: -100 }} />;
  }
}

GameScreen.navigationOptions = {
  title: 'Game',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
