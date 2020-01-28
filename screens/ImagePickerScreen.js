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
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import { Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import firebase from '../utils/firebase'

export default class ImagePickerScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <View style={styles.container}>
          <Ionicons style={styles.googleLogo} name="md-cloud-upload" size={120} color="#141414" />
          <Text
            style={styles.exampleText}>
            Upload your game sketches
          </Text>
          <Text style={{marginBottom: 10, marginHorizontal: 10, textAlign: 'center'}}>Follow the following color code for your sketch:</Text>
          <Text>Black: Starting Point</Text>
          <Text>Green: Ending Point</Text>
          <Text>Red: Static Enemy</Text>
          <Text>Blue: Platform/Wall</Text>
          <Text>Yellow: Coin/Point</Text>
        </View>
        <View style={styles.buttonsContainer} >
          <TouchableOpacity
            onPress={this._pickImage}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Pick an image from gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this._takePhoto}>
            <Text style={styles.buttonText}>Take a Photo</Text>
          </TouchableOpacity>
        </View>

        
      </View>
    );
  }

  _share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.image,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert('Copied image URL to clipboard');
  };

  _takePhoto = async () => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  _handleImagePicked = async pickerResult => {
    if (!pickerResult.cancelled) {
      this.props.navigation.navigate('GameForm', { image: pickerResult.uri })
    }
  };
}

ImagePickerScreen.navigationOptions = {
  headerTitle: 'Pick a Game Sketch'
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
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
  exampleText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: 'center',
  },
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  maybeRenderContainer: {
    borderRadius: 3,
    elevation: 2,
    marginTop: 30,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowRadius: 5,
    width: 250,
  },
  maybeRenderImageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: 'hidden',
  },
  maybeRenderImage: {
    height: 250,
    width: 250,
  },
  maybeRenderImageText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  }
});