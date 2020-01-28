import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import firebase from '../utils/firebase';
import moment  from 'moment';
import Layout from '../constants/Layout';

const actions = [
  {
    text: "Create New Game",
    icon: (<Ionicons name="md-add" size={30} color="#141414" />),
    name: "imagePicker",
    color: '#FFF',
    position: 2
  },
  {
    text: "Sign Out",
    icon: (<Ionicons name="md-log-out" size={30} color="#141414" />),
    name: "signOut",
    color: '#FFF',
    position: 1,
  }
];


function Item({ title, game, image, description, createdAt, onPress, onDelete }) {
  createdAt = moment(createdAt.toDate())
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={onPress}>
        <Image style={styles.itemImage} source={{ uri: image }} />
      </TouchableOpacity>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 24}}>{title}</Text>
          <Text style={{fontSize: 14, color: "#818181"}}>Created {createdAt.fromNow()}</Text>
        </View>
        <Ionicons onPress={onDelete} name="md-trash" size={32} color="#141414" style={{marginTop: 5, marginHorizontal: 10}} />
      </View>
      {/* <Text style={{fontSize: 16}}>{description}</Text> */}
    </View>
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

  componentWillUnmount() {
    this.unsubscribe();
  }

  actionHandler = (name) => {
    switch(name){
      case "imagePicker":
        this.props.navigation.navigate('ImagePicker');
        break;
      case "signOut":
        firebase.auth().signOut().then(() => this.props.navigation.navigate('Login'))
        break;
    }
  }

  gameHandler = (game, image) => () => {
    console.log("handler", game);
    this.props.navigation.navigate('Game', { gameURL: game, imageURL: image })
  }

  deleteGame = (id) => () => {
    firebase.firestore().collection('games').doc(id).delete();
  }
  
  fetchGames = () => {
    this.unsubscribe = firebase.firestore().collection('games')
    .where("user", "==", this.state.currentUser.uid)
    .orderBy('createdAt', 'asc')
    .onSnapshot(snapshot => {
      if(snapshot.empty) {
        this.setState({isLoading: false})
      }
      snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
              console.log('exist')
              let game = change.doc.data();
              game['id'] = change.doc.id
              this.setState({games: [game, ...this.state.games], isLoading: false});
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

  _emptyList = () => (
    <View style={[styles.loadingContainer, {height: 400, paddingHorizontal: 20}]}>
      <Text style={{fontSize: 16, textAlign: 'center'}}>You do not have any games :(</Text>
      <Text style={{fontSize: 16, textAlign: 'center'}}>Create a new game using the action button on bottom right</Text>
    </View>
  )

  render() {
    return this.state.isLoading? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={100} color="#141414" />
      </View>
    ) : (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.games}
          ListEmptyComponent={this._emptyList}
          ListHeaderComponent={<Text style={styles.title}> My Games </Text>}
          renderItem={({ item }) => <Item {...item} onPress={this.gameHandler(item.game, item.image)} onDelete={this.deleteGame(item.id)} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.gameList}
        />
        <FloatingAction
          actions={actions}
          onPressItem={this.actionHandler}
          floatingIcon={(<Ionicons name="md-menu" size={30} color="#141414" />)}
          color="#FFF"
          shadowStyle={styles.fabShadow}
          fixNativeFeedbackRadius={true}
          animated
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
  gameList: {
    paddingBottom: 40,
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
