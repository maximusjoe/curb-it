firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        $('#requestAccept').append(`<div class="d-flex justify-content-center">
            <div id="spinner" class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>`)
        db.collection("users").doc(user.uid)
            .get()
            .then(async (doc) => {
                $('#username').html(`${doc.data().name}`)
                // Posted Requests will appear here
                const listPostedReqs = await db.collection('users').doc(user.uid).collection('postedRequests')
                    .get().then(docs => docs)
                    .catch(error => console.log(error))
                // console.log(listPostedReqs.docs[0].data())
                for (let i = 0; i < listPostedReqs.docs.length; i++) {
                    let post = listPostedReqs.docs[i].data()
                    $('#requestPosted').append(`<div class="postBoxes">
                            <h4>${post.numberOfItem} Items
                            <button class='edit-button btn btn-outline-warning'>Edit</button>
                            </h4>
                            <p>${post.address}</p>
                            </div>`)
                }

                // Accepted Requests will appear here
                const listAcceptedReqs = await db.collection('users').doc(user.uid).collection('acceptedRequests')
                    .get().then(docs => docs)
                    .catch(error => console.log(error))
                $('#requestAccept').children().last().remove()
                // Get the list of the accepted requests including the post's ID and the poster's ID
                for (let i = 0; i < listAcceptedReqs.docs.length; i++) {
                    const postID = listAcceptedReqs.docs[i].id
                    const posterID = listAcceptedReqs.docs[i].data().posterID
                    // Retrieve the posts from postedRequests
                    const post = await db.collection('users').doc(posterID).collection('postedRequests').doc(postID).get()
                        .then(result => result.data())
                        .catch(error => console.log(error))
                    $('#requestAccept').append(`<div class="acceptBoxes">
                            <h4>${post.numberOfItem} items
                            <button class='decline-button btn btn-outline-secondary'>Decline</button>
                            <button class='finish-button btn btn-outline-secondary'>Done</button>
                            </h4>
                             <p>${post.address}</p>
                            </div>`)
                    declinePostListener(user.uid, postID, posterID)
                    finishPostListener()
                }
            })


    } else {
        // No user is signed in.
        window.location.href = 'index.html'
    }
});

const declinePostListener = (uid, postID, posterUID) => {
    $('.decline-button').on('click', async (event) => {
        await db.collection('users').doc(uid).collection('acceptedRequests').doc(postID).delete()
            .then(() => {
                console.log('Document successfully removed from the users accepted posts')
            }).catch(error => console.log(error))

        await db.collection('users').doc(posterUID).collection('postedRequests').doc(postID).update({
                available: true
            }).then(() => {
                console.log('Successfully added back to newsfeed')
            })
            .catch(error => console.log(error))
        window.location.href = 'profile.html'
    })
}

const finishPostListener = () => {
    $('.finish-button').on('click', (event) => {
        // Shoot notifications here!
    })
}