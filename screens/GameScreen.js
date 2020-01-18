import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import { WebView } from 'react-native-webview';

export default function GameScreen() {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: 'http://www.mfrashad.com/phaser-platform-game/' }} style={{ marginTop: 20 }} />
    </View>
  );
}

GameScreen.navigationOptions = {
  title: 'Links',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
