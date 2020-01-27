import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';

import firebase from '../utils/firebase'

export default class GameFormScreen extends Component {
  state = {
    currentUser: null,
    image: null,
    imageURL: null,
    gameURL: null,
    uploading: false,
    title: "",
    description: "",
  };

  render() {
    let {
      image
    } = this.props.navigation.state.params;

    return (
      <KeyboardAvoidingView 
        style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}}
        behavior="position" enabled   >
      <ScrollView>
        <View style={styles.container}>
          <StatusBar barStyle="default" />
          <View style={styles.container}>
              <Image source={{ uri: image }} style={styles.image} />
          </View>
          <View style={styles.inputsContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Title"
              onChangeText={title => this.setState({ title })}
              value={this.state.title}
            />
            <TextInput
              style={[styles.textInput, styles.descInput]}
              autoCapitalize="none"
              placeholder="Description"
              multiline={true}
              numberOfLines={2}
              onChangeText={description => this.setState({ description })}
              value={this.state.description}
            />
            {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>}
          </View>
          <View style={styles.buttonsContainer} >
            <TouchableOpacity style={styles.button} onPress={this.createGame}>
              {
                this.state.uploading ? 
                (<ActivityIndicator color="#fff"/>) : 
                (
                  <Text style={styles.buttonText}>
                    Create Game
                  </Text>
                )
              }
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      );
    }
  };

  uploadImageToCloud = async (uri) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      console.log('Uploading')
      const sessionId = new Date().getTime()
      const imageRef = await firebase.storage().ref('sketches').child(`${sessionId}`)
      const response = await fetch(uploadUri);
      const blob = await response.blob();
      const snapshot = await imageRef.put(blob);
      return imageRef.getDownloadURL()
  }

  createGame = async () => {
    const { image } = this.props.navigation.state.params;
    let uploadResponse, uploadResult, imageURL, gameURL;

    try {
      this.setState({uploading: true});

      uploadResponse = await uploadImageAsync(image);
      uploadResult = await uploadResponse.json();
      gameURL = uploadResult.link_to_file

      imageURL = await this.uploadImageToCloud(image)
      console.log(imageURL);

      await firebase.firestore().collection('games').add({
        createdAt: new Date(),
        image: imageURL,
        title: this.state.title,
        description: this.state.description,
        game: gameURL,
        user: this.state.currentUser.uid
      })
      console.log("Saved to firebase");
      this.props.navigation.navigate('Game', { gameURL, imageURL })
    } catch (e) {
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({
        uploading: false
      });
    }

    return 
  }
}

async function uploadImageAsync(uri) {
  let apiUrl = 'http://photosketch.pythonanywhere.com/upload_image';

  // Note:
  // Uncomment this if you want to experiment with local server
  //
  // if (Constants.isDevice) {
  //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
  // } else {
  //   apiUrl = `http://localhost:3000/upload`
  // }

  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('file', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  return fetch(apiUrl, options);
}

GameFormScreen.navigationOptions = {
  headerTitle: 'Create a Game'
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 280,
    height: 200,
    marginVertical: 30,
    marginHorizontal: 40,
    borderRadius: 10,
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
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF'
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  inputsContainer: {
    width: '100%',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    fontSize: 15,
    height: 50,
    paddingHorizontal: 25,
    width: 300,
    borderRadius: 25,
    borderColor: '#141414',
    borderWidth: 1,
    marginBottom: 16
  },
  descInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 20,
  },
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  }
});