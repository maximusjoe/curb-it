$(document).ready(function() {

    $("#acceptedRequest").click(function() {
        $("#requestAccept").show();
        $("#requestPosted").hide();
        $("#body").css({
            backgroundColor: "rgb(197, 243, 233)",
        });
        $("#profile_outline").css({
            color: "rgb(47, 48, 48)",
        });
    });

    $("#postedRequest").click(function() {
        $("#requestPosted").show();
        $("#requestAccept").hide();
        $("#body").css({
            backgroundColor: "rgb(47, 48, 48)",
        });
        $("#profile_outline").css({
            color: "lightgray",
        });
    });
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            db.collection("users").doc(user.uid)
                .get()
                .then(async(doc) => {
                    $('#username').html(`${doc.data().name}`);
                    $('#user_email').html(`${doc.data().email}`);
                    let userCity = doc.data().city;
                    let userAddress = doc.data().address;
                    if (userCity) {
                        $('#user_city').html(`${doc.data().city}`);
                    } else {
                        $('#user_city').text('Edit profile to add city');
                    }
                    if (userAddress) {
                        $('#user_address').html(`${doc.data().address}`);
                    } else {
                        $('#user_address').text('Edit profile to add address');
                    }

                    // Posted Requests will appear here
                    const listPostedReqs = await db.collection('users').doc(user.uid).collection('postedRequests')
                        .get()
                        .then(docs => docs)
                        .catch(error => console.log(error))
                        // console.log(listPostedReqs.docs[0].data())
                    for (let i = 0; i < listPostedReqs.docs.length; i++) {
                        let post = listPostedReqs.docs[i].data()
                        let postid = listPostedReqs.docs[i].id
                        $('#requestPosted').append(`<div class="postBoxes" >
                            <div class="view-post-container" id="${postid}">
                            <div class="request-number">Size ${post.size}</div>
                            <div class="request-address">${post.address}</div>
                            <div class="schedule">Pickup on: ${post.pickupDate} @ ${post.pickupTime}</div>
                            </div>
                            <div>
                            <button class='edit-button' id="edit${postid}">Edit</button>
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
                        $('#requestAccept').append(`<div class="acceptBoxes" id="box${postID}" >
                            <div class="accept-container" id="${postID}">
                            <div class="request-number">${post.numberOfItem} items</div>
                            <div class="request-address">${post.address}</div>
                            <div class="schedule">Pickup on: ${post.pickupDate} @ ${post.pickupTime}</div>
                            </div>
                            <div class="decline-done">
                            <button id="${postID}${user.uid}" class='done-button'>Done</button>
                            <button id="${user.uid}${postID}" class='decline-button'>Cancel</button>
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

    const editRequest = (uid, postID) => {
        $(`#edit${postID}`).on('click', async(event) => {
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
                    available: true,
                    acceptee: null,
                    pickupDate: "undefined",
                    pickupTime: "undefined"
                }).then(() => {
                    console.log('Successfully added back to newsfeed')
                })
                .catch(error => console.log(error))
                //window.location.href = 'profile.html'
            decline(postID);
        })
    }

    const finishPostListener = (uid, postID, posterUID) => {
        $(`#${postID}${uid}`).on('click', async(event) => {
            // Shoot notifications here!
            sendNotification(posterUID)

            await db.collection('users').doc(uid).collection('acceptedRequests').doc(postID).delete()
                .then(() => {
                    console.log('Document successfully removed from the users accepted posts')
                }).catch(error => console.log(error))
            await db.collection('users').doc(posterUID).collection('postedRequests').doc(postID).delete()
                .then(() => {
                    console.log('Successfully delete from the posters posted requests')
                })
                .catch(error => console.log(error))
            done(postID);

        })
    }

    const sendNotification = async (poster_id) => {
        // Add to poster id collection
        const data = await db.collection('users')
        .doc(poster_id).collection('notifications')
        .add({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            text: 'A volunteer has picked up your request!'
        })
        // Update the data so that it would be of type 'modified' in db changes
        db.collection('users').doc(poster_id)
        .collection('notifications').doc(data.id)
        .update({
            posterID: poster_id
        })
    }
    function done(postID) {
        $("#done-success").fadeIn(300);
        $("#overlay").show();
        $(`#box${postID}`).remove();
        console.log("remove request")
        $("#done-close").on('click', function(e) {
            e.preventDefault();
            $("#done-success").fadeOut(250);
            $("#overlay").hide();
        })

    };

    function decline(postid) {
        $("#decline-success").fadeIn(300);
        $("#overlay").show();
        $(`#box${postid}`).remove();
        console.log("decline request")
        $("#decline-close").on('click', function(e) {
            e.preventDefault();
            $("#decline-success").fadeOut(250);
            $("#overlay").hide();
        })
    };
});