import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Game',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Game',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Game',
  },
];

function Item({ title }) {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{title}</Text>
      <View style={styles.itemImage}></View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}> My Games </Text>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  itemContainer:{
    marginHorizontal: 30,
    marginBottom: 30

  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  itemTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  itemImage: {
    height: 150,
    borderRadius: 10,
    backgroundColor: "#ADADAD"
  },

  title: {
    textAlign: "center",
    fontSize: 32,
    marginVertical: 20
  },
});
