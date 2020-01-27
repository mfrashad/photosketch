import * as firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADeJx0go7uZRnaASyRlak_0Z9uBWijAWU",
  authDomain: "photosketch-d7c04.firebaseapp.com",
  databaseURL: "https://photosketch-d7c04.firebaseio.com",
  projectId: "photosketch-d7c04",
  storageBucket: "photosketch-d7c04.appspot.com",
  messagingSenderId: "511972229703",
  appId: "1:511972229703:web:33905bb875f45a89cea762",
  measurementId: "G-HPL7GSJ84G"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
