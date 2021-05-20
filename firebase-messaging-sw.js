importScripts("https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js");

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

// const messaging = firebase.messaging();
// messaging.setBackgroundMessageHandler(function(payload) {
//     const title = 'Hello World';
//     const options = {
//         body: payload.data.status
//     }
//     return self.registration.showNotification(title, options);
// })