function userInfos() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            console.log(user.uid);
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    var userName = doc.data().name;
                    console.log(userName);
										//using jquery
                    $("#username").text(userName);
										//using vanilla javascript
                    //document.getElementById("username").innerText = n;

                    // testing for other than name
                    var emails = doc.data().email;
                    $("#email").text(emails);



                })
        } else {
            // No user is signed in.
        }
    });
}

userInfos();