import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import firebase from '../utils/firebase';

const actions = [
  {
    text: "Create New Game",
    icon: (<Ionicons name="md-add" size={30} color="#141414" />),
    name: "imagePicker",
    position: 1
  }
];


function Item({ title, game, image, description, onPress }) {
  console.log(image);
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
      <Image style={styles.itemImage} source={{ uri: image }} />
      <Text style={styles.itemTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

export default class HomeScreen extends React.Component {

  state = {
    currentUser: null,
    isLoading: true,
    games: [],
  }

  

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser }, () => this.fetchGames());
  }

  gameHandler = (game, image) => () => {
    console.log("handler", game);
    this.props.navigation.navigate('Game', { gameURL: game, imageURL: image })
  }
  
  fetchGames = () => {
    this.unsubscribe = firebase.firestore().collection('games')
    .where("user", "==", this.state.currentUser.uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      if(snapshot.empty) {
        this.setState({isLoading: false})
      }
      snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
              console.log('exist')
              let game = change.doc.data();
              game['id'] = change.doc.id
              this.setState({games: [...this.state.games, game], isLoading: false});
          }
          if (change.type === "modified") {
              //console.log("Modified city: ", change.doc.data());
          }
          if (change.type === "removed") {
              //console.log("Removed city: ", change.doc.data());
          }
      });
    })
  }

  render() {
    return this.state.isLoading? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={100} color="#141414" />
      </View>
    ) : (
      <SafeAreaView style={styles.container}>
        
        <FlatList
          data={this.state.games}
          ListHeaderComponent={<Text style={styles.title}> My Games </Text>}
          renderItem={({ item }) => <Item {...item} onPress={this.gameHandler(item.game, item.image)} />}
          keyExtractor={item => item.id}
        />
        <FloatingAction
          actions={actions}
          onPressItem={(name) => this.props.navigation.navigate('ImagePicker')}
          overrideWithAction={true}
          color="#FFF"
          shadowStyle={styles.fabShadow}
          fixNativeFeedbackRadius={true}
        />
      </SafeAreaView>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer:{
    marginHorizontal: 30,
    marginBottom: 30,
    justifyContent: 'center',
    flexDirection: 'column',

  },
  item: {
    backgroundColor: 'red',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 30,
    marginBottom: 10,
  },
  itemImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    textAlign: "center",
    fontSize: 32,
    marginVertical: 20
  },
  fabShadow: {
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowColor: '#000',
    shadowRadius: 3,
    elevation: 5,
  }
});
