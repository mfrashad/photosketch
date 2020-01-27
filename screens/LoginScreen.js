// LoginScreen.js
import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import firebase from '../utils/firebase';

import Layout from '../constants/Layout';


export default class LoginScreen extends React.Component {
  state = { email: '', password: '', errorMessage: null }
  handleLogin = () => {
    // TODO: Firebase stuff...
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => this.setState({ errorMessage: error.message }))
    console.log('handleLogin')
  }

  handleGoogleLogin = async () => {
    const { type, accessToken, user } = await Google.logInAsync({
      androidClientId: `511972229703-33j15238kl5rc4j4rjermgv46meu27m4.apps.googleusercontent.com`,
    });
    
    switch (type) {
      case 'success': {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = new firebase.auth.GoogleAuthProvider.credential(accessToken);
        this.props.navigation.navigate('Main')
      }
      case 'cancel': {
        this.setState({ errorMessage: "Cancelled" })
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/images/photosketch-logo.png')} style={styles.logo}></Image>
        <View style={styles.inputsContainer}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            secureTextEntry
            style={styles.textInput}
            autoCapitalize="none"
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={this.handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={this.handleGoogleLogin} style={[styles.button, styles.outlineButton]} >
            <Ionicons style={styles.googleLogo} name="logo-google" size={20} color="#141414" />
            <Text style={styles.outlineButtonText}>Sign In with Google</Text>
          </TouchableOpacity> */}
          <Text 
            onPress={() => this.props.navigation.navigate('SignUp')}
            styles={{fontColor: 'gray'}}>
              Don't have an account? Sign up
          </Text>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 200,
    resizeMode: 'contain',
    height: 200,
  },
  buttonsContainer: {
    width: Layout.window.width,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 50,
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#141414',
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#141414'
  },
  outlineButtonText: {
    fontSize: 15,
    color: '#141414'
  },
  buttonText: {
    fontSize: 15,
    color: '#FFFFFF'
  },
  googleLogo: {
    left: -15
  },
  inputsContainer: {
    width: Layout.window.width,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    fontSize: 15,
    height: 50,
    paddingHorizontal: 25,
    width: 300,
    borderRadius: 50,
    borderColor: '#141414',
    borderWidth: 1,
    marginBottom: 16
  }
})