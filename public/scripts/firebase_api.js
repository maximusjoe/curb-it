var firebaseConfig = {
    apiKey: "AIzaSyDlIgYn99FTaPE2i4Klg42_mY2ZIE6JRGo",
    authDomain: "team-35-ddc6a.firebaseapp.com",
    projectId: "team-35-ddc6a",
    storageBucket: "team-35-ddc6a.appspot.com",
    messagingSenderId: "929353867295",
    appId: "1:929353867295:web:3f87a4724dfca45a86752a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const messaging = firebase.messaging();
// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken({ vapidKey: 'BBrq9TBflOEHFWj82NU2CEZ3Msr0vjPvC_k6X2NxJ8TzigyQFzz1FqAqHY5K2eDFsJG9dNz4BVZ8B8NuzvECKac' }).then((currentToken) => {
    if (currentToken) {
        messaging.requestPermission()
        .then(function() {
            console.log('Have Permission');
            return messaging.getToken();
        })
        .catch(function(err) {
            console.log("Error Occurend.")
        })
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
    
messaging.onMessage(function(payload) {
    console.log('onMessage');
});
messaging.onTokenRefresh(function () {
    messaging.getToken()
        .then(function (newToken) {
            console.log("New Token : " + newToken);
        })
        .catch(function (err) {
            console.log('An error occurred while retrieving token. ', err);
        })
})

