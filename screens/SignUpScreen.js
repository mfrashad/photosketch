// SignUpScreen.js
import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native'
import firebase from '../utils/firebase';

import Layout from '../constants/Layout';

export default class SignUpScreen extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
    this.state = { 
      username: '',
      email: '',
      password: '',
      address: '',
      errorMessage: null
    };

  }

  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.ref.add({
          username: this.state.username,
          email: this.state.email,
          address: this.state.address,
        });
        this.props.navigation.navigate('Main');
      })
      .catch(error => this.setState({ errorMessage: error.message }))
    console.log('handleSignUp')
  }

  render() {
    return (<View style={styles.container}>
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
        <TouchableOpacity onPress={this.handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text 
          onPress={() => this.props.navigation.navigate('Login')}
          styles={{fontColor: 'gray'}}>
            Have an account? Sign In
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