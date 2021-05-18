function userInfos() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            db.collection("users").doc(user.uid)
                .get()
                .then(async (doc) => {
                    $('#username').html(`${doc.data().name}`)
                    // Posted Requests will appear here
                    const listPostedReqs = await db.collection('users').doc(user.uid).collection('postedRequests')
                        .get().then(docs => docs)
                        .catch(error => console.log(error))
                    console.log(listPostedReqs.docs[0].data())
                    for (let i = 0; i < listPostedReqs.docs.length; i++) {
                        let post = listPostedReqs.docs[i].data()
                        $('#requestPosted').append(`<div class="postBoxes">
                            <h4>${post.numberOfItem} Items
                            <button class='edit-button btn btn-outline-warning'>Edit</button>
                            </h4>
                            <p>${post.address}</p>
                            </div>`)
                    }
                })

            // Accepted Requests will appear here
        } else {
            // No user is signed in.
            window.location.href = 'login.html'
        }
    });
}

userInfos();