$(document).ready(() => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            $('#login-logout').text('Logout')
            $('#login-logout').on('click', (e) => {
                firebase.auth().signOut().then(() => {
                    // Sign-out successful.
                    console.log('Signed out Successfully')
                }).catch((error) => {
                    // An error happened.
                    console.log(error)
                });
            })
            console.log('You are logged in');
            console.log("Image Storage");
        } else {
            $('#login-logout').text('Sign-in')
            $('#login-logout').on('click', (e) => {
                window.location.href = 'index.html'
            })
            console.log('You are not logged in')
        }
    })
})