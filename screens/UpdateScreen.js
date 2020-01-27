// Main.js
import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from '../utils/firebase';


export default class UpdateScreen extends React.Component {
  state = { currentUser: null }


  render() {
    const { currentUser } = this.state
    return (
      <View style={styles.container}>
        <Icon name='exclamation-circle' size={80} ></Icon>
        <Text style={styles.text}>
          Please update the app to the latest version!
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  text: {
    color: '#777',
    fontSize: 20,
    textAlign: 'center',
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 32,
  }
})