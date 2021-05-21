$(document).ready(() => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {

        } else {
                // No user is signed in.
                alert('You need to sign in first to make a request')
                window.location.href = "index.html";
        }
    })
})