$(document).ready(function() {

    $("#acceptedRequest").click(function() {
        $("#requestAccept").show();
        $("#requestPosted").hide();
        $("#body").css({
            backgroundColor: "rgb(197, 243, 233)",
        });
    });

    $("#postedRequest").click(function() {
        $("#requestPosted").show();
        $("#requestAccept").hide();
        $("#body").css({
            backgroundColor: "rgb(47, 48, 48)",
        });
    });
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            db.collection("users").doc(user.uid)
                .get()
                .then(async(doc) => {
                    $('#username').html(`${doc.data().name}`)
                    $('#user_email').html(`${doc.data().email}`)
                    $('#user_address').html(`${doc.data().address}`)
                        // Posted Requests will appear here
                    const listPostedReqs = await db.collection('users').doc(user.uid).collection('postedRequests')
                        .get()
                        .then(docs => docs)
                        .catch(error => console.log(error))
                        // console.log(listPostedReqs.docs[0].data())
                    for (let i = 0; i < listPostedReqs.docs.length; i++) {
                        let post = listPostedReqs.docs[i].data()
                        let postid = listPostedReqs.docs[i].id
                        $('#requestPosted').append(`<div class="postBoxes" id="${postid}">
                            <div>
                            <div class="request-number">${post.numberOfItem} item(s)</div>
                            <div class="request-address">${post.address}</div>
                            <div class="schedule">Pickup on: ${post.pickupDate} @ ${post.pickupTime}</div>
                            </div>
                            <div>
                            <button class='edit-button'>Edit</button>
                            </div>
                            </div>`)
                        viewRequestInfo(postid, user.uid);
                        editRequest(user.uid, postid);
                    }

                    // Accepted Requests will appear here
                    const listAcceptedReqs = await db.collection('users').doc(user.uid).collection('acceptedRequests')
                        .get()
                        .then(docs => docs)
                        .catch(error => console.log(error))

                    // Get the list of the accepted requests including the post's ID and the poster's ID
                    for (let i = 0; i < listAcceptedReqs.docs.length; i++) {
                        const postID = listAcceptedReqs.docs[i].id
                        const posterID = listAcceptedReqs.docs[i].data().posterID
                            // Retrieve the posts from postedRequests
                        const post = await db.collection('users').doc(posterID).collection('postedRequests').doc(postID).get()
                            .then(result => result.data()).catch(error => console.log(error))
                        $('#spinner').hide()
                        $('#requestAccept').append(`<div class="acceptBoxes" >
                            <div id="${postID}">
                            <div class="request-number">${post.numberOfItem} items</div>
                            <div class="request-address">${post.address}</div>
                            <div class="schedule">Pickup on: ${post.pickupDate} @ ${post.pickupTime}</div>
                            </div>
                            <div class="decline-done">
                            <button id="${postID}${user.uid}" class='done-button'>Done</button>
                            <button id="${user.uid}${postID}" class='decline-button'>Decline</button>
                            </div>
                            </div>`)
                            // console.log('user ID: ', user.uid)
                            // console.log('postID: ', postID)
                            // console.log('posterID: ', posterID)
                        viewRequestInfo(postID, posterID)
                        declinePostListener(user.uid, postID, posterID)
                        finishPostListener(user.uid, postID, posterID)
                    }
                    $('#spinner').hide()
                })
        } else {
            // No user is signed in.
            window.location.href = 'index.html'
        }
    });

    function editRequest(uid, postID) {
        $(".edit-button").on('click', (e) => {
            window.location.href = `request-edit.html?id=${postID}&poster=${uid}`
        })
    }

    const viewRequestInfo = (postID, posterID) => {
        $(`#${postID}`).on('click', (event) => {
            window.location.href = `request-info.html?id=${postID}&poster=${posterID}`
        })
    }

    const declinePostListener = (uid, postID, posterUID) => {
        $(`#${uid}${postID}`).on('click', async(event) => {
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

    const finishPostListener = (uid, postID, posterUID) => {
        $(`#${postID}${uid}`).on('click', async(event) => {
            // Shoot notifications here!

            await db.collection('users').doc(uid).collection('acceptedRequests').doc(postID).delete()
                .then(() => {
                    console.log('Document successfully removed from the users accepted posts')
                }).catch(error => console.log(error))
            await db.collection('users').doc(posterUID).collection('postedRequests').doc(postID).delete()
                .then(() => {
                    console.log('Successfully delete from the posters posted requests')
                })
                .catch(error => console.log(error))
            window.location.href = 'profile.html'
        })
    }
});