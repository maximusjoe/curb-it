const firebaseConfig = {
    apiKey: "AIzaSyA1k_NhbAGCzNFbtpphCxlB1VwP0m9_DL0",
    authDomain: "curb-it.firebaseapp.com",
    projectId: "curb-it",
    storageBucket: "curb-it.appspot.com",
    messagingSenderId: "562098738795",
    appId: "1:562098738795:web:15c947a623cc9499ff832e"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
