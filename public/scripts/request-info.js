$(document).ready(() => {
    'use strict'
    // https://www.learningjquery.com/2012/06/get-url-parameters-using-jquery
    function GetURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }

    const post_id = GetURLParameter('id')
    const poster_id = GetURLParameter('poster')
    var acceptee_id = null;

    //Add popup window animation
    $("#accept-button1").on('click', e => {
        e.preventDefault()
        $("#popup").fadeIn(250);
        $("#overlay").show();
    })

    $("#cancel-button").on('click', e => {
        e.preventDefault()
        $("#popup").fadeOut(250);
        $("#overlay").hide();
    })

    //Check whether a user is logged in .
    firebase.auth().onAuthStateChanged(async(user) => {
        const data = await db.collection('users').doc(poster_id).collection('postedRequests')
            .doc(post_id).get().then(doc => {
                if (doc.exists) {
                    return doc.data()
                } else {
                    console.log('No such document')
                }
            }).catch(error => {
                window.location.href = '404.html'
            })
            // Dereference data
        const {
            address,
            available,
            city,
            email,
            size,
            list: itemsList,
            name,
            photo,
            postedDate,
            pickupDate,
            pickupTime,
            acceptee
        } = data

        acceptee_id = acceptee;

        //Display the request info 
        $('#requester-wrapper').append(`<div id="requester">Request by: ${name}</div>`);
        $('#requester-wrapper').append(`<div id="date">Posted on: ${postedDate}</div>`);

        if ((pickupDate && pickupTime) && (pickupDate != "undefined")) {
            $('#requester-wrapper').append(`<div id="pickup">Pick-up Schedule: ${pickupDate} at ${pickupTime}</div>`);
        }
        //Only show the address if the post is belong to the user or accepted. 
        if (!available) {
            accepted();
            $("#location").append(`<div id="address"><label id="address-label">Address:</label> ${address}</div>`)
        }
        if (available && user.uid == poster_id) {
            pending(); //if the post belong to user --> disable the accept button and change to pending 
            $("#location").append(`<div id="address"><label id="address-label">Address:</label> ${address}</div>`)
        }
        $('#location').append(`<div id="city"><label id="city-label">City:</label> ${city}</div>`)
        $('#location').after(`<hr/>`)
        $('#list-wrapper').append(`<label id="size-label">Package Size: </label>`)
        $('#list-wrapper').append(`<ul id="size"><li>${size}</li></ul>`)
        $('#list-wrapper').append(`<label id="list-label">Item list:</label>`)
        $('#list-wrapper').append(`<ul id="item-list"></ul>`)
        for (let i = 0; i < itemsList.length; i++) {
            $('#item-list').append(`<li>${itemsList[i]}</li>`)
        }
        $('#list-wrapper').after(`<hr/>`)
        $("#photo-wrapper").append(`<label id="photo-label">Photo:</label><br>`);
        $("#photo-wrapper").append(`<img id="photo" src="${photo}"/>`)



        if (user) {
            // User is signed in.
            $('#accept-button2').on('click', async(e) => {
                if (user.uid === poster_id) {
                    alert('You cannot accept your own post')
                } else {
                    sendNotification(poster_id)
                    accepted(); //Disable, and change accept button after the request is accepted 
                    let pickupDate = $("#date-input").val();
                    let pickupTime = $("#time-input").val();
                    await db.collection('users').doc(poster_id)
                        .collection('postedRequests')
                        .doc(post_id)
                        .update({
                            available: false, //change post avaibility status so it wont be listed on the main page
                            pickupDate,
                            pickupTime,
                            acceptee: user.uid
                        })
                    await db.collection('users').doc(user.uid)
                        .collection('acceptedRequests')
                        .doc(post_id)
                        .set({
                            posterID: poster_id,
                            postID: post_id,
                        })

                }
            })
            openChat(poster_id, post_id, acceptee_id);
            $('#spinner').hide();
        } else {
            // No user is signed in.
            alert('You need to sign in first to volunteer')
            window.location.href = "index.html";
        }
    });

    const sendNotification = async(poster_id) => {
        // Add to poster id collection
        const data = await db.collection('users')
            .doc(poster_id)
            .collection('notifications').add({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                text: 'A volunteer has accepted your post, expect them to drop by soon!'
            })
            // Update the data so that it would be of type 'modified' in db changes
        db.collection('users')
            .doc(poster_id).collection('notifications')
            .doc(data.id).update({
                posterID: poster_id
            })
    }

    //Disable, and change accept button after the request is accepted 
    function accepted() {
        $("#popup").fadeOut(250);
        $("#overlay").hide();
        $("#accept-button1").text("Accepted")
            .attr("disabled", true)
            .css({
                cursor: "not-allowed",
                backgroundColor: "rgba(31, 32, 32, 0)",
                color: "rgba(0, 87, 39, 0.774)",
            })
    }
    //Disable, and change accept button if the request is not accepted yet,
    //only trigger in the your own post. 
    function pending() {
        $("#popup").fadeOut(250);
        $("#overlay").hide();
        $("#accept-button1").text("Pending")
            .attr("disabled", true)
            .css({
                cursor: "not-allowed",
                backgroundColor: "rgba(31, 32, 32, 0)",
                color: "rgba(107, 1, 45, 0.788)"
            })
    }

    const openChat = (posterUID, postID, accepteeID) => {
        if (acceptee_id == null) {
            $(`#chat-button1`).on('click', (event) => {
                alert("The request has not been accepted");
            })
        } else {
            $(`#chat-button1`).on('click', (event) => {
                window.location.href = `real-time-messaging.html?id=${postID}&poster=${posterUID}&acceptee=${accepteeID}`
            })
        }
    }

});