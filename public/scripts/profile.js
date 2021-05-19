$(document).ready(function() {
    $("#requestPosted").hide();
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

    function userInfos() {

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                db.collection("users").doc(user.uid)
                    .get()
                    .then(async(doc) => {
                        $('#username').html(`${doc.data().name}`)
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
                            <div class="schedule">Shedule: </div>
                            </div>
                            <div>
                            <button class='edit-button'>Edit</button>
                            </div>
                            </div>`)
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

                            $('#requestAccept').append(`<div class="acceptBoxes" id="${postID}">
                            <div>
                            <div class="request-number">${post.numberOfItem} items</div>
                            <div class="request-address">${post.address}</div>
                            <div class="schedule">Shedule: </div>
                            </div>
                            <div class="decline-done">
                            <button class='done-button'>Done</button>
                            <button class='decline-button'>Decline</button>
                            </div>
                            </div>`)
                        }
                    })


            } else {
                // No user is signed in.
                window.location.href = 'index.html'
            }
        });
    }

    userInfos();


});