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
            height,
            list: itemsList,
            name,
            numberOfItem,
            photo,
            postedDate,
            pickupDate,
            pickupTime,
            width
        } = data

        $('#requester-wrapper').append(`<div id="requester">Request by: ${name}</div>`);
        $('#requester-wrapper').append(`<div id="date">Posted on: ${postedDate}</div>`);
        if (pickupDate && pickupTime) {
            $('#requester-wrapper').append(`<div id="pickup">Pick-up Schedule: ${pickupDate} at ${pickupTime}</div>`);
        }
        if (!available) {
            accepted();
            $("#location").append(`<div id="address">Address: ${address}</div>`)
        }
        if (available && user.uid == poster_id) {
            pending();
            $("#location").append(`<div id="address">Address: ${address}</div>`)
        }
        $('#location').append(`<div id="city">City: ${city}</div>`)

        $('#list-wrapper').append(`<label id="list-label">Item list:</label>`)
        $('#list-wrapper').append(`<ul id="item-list"></ul>`)
        for (let i = 0; i < itemsList.length; i++) {
            $('#item-list').append(`<li>${itemsList[i]}</li>`)
        }
        $('#list-wrapper').append(`<div id="number">Number of items: ${numberOfItem}</div>`)
        $('#list-wrapper').append(`<div id="dimension">Package dimension: ${width} x ${height}</div>`)
        $("#photo-wrapper").append(`<label id="photo-label">Photo:</label>`);
        $("#photo-wrapper").append(`<img id="photo" src="${photo}"/>`)
        console.log(photo)


        if (user) {
            // User is signed in.
            $('#accept-button2').on('click', async(e) => {
                if (user.uid === poster_id) {
                    alert('You cannot accept your own post')
                } else {
                    let pickupDate = $("#date-input").val();
                    let pickupTime = $("#time-input").val();
                    await db.collection('users').doc(poster_id)
                        .collection('postedRequests')
                        .doc(post_id)
                        .update({
                            available: false,
                            pickupDate,
                            pickupTime
                        })
                    await db.collection('users').doc(user.uid)
                        .collection('acceptedRequests')
                        .doc(post_id)
                        .set({
                            posterID: poster_id,
                            postID: post_id
                        })
                    accepted();
                }
            })
        } else {
            // No user is signed in.
            alert('You need to sign in first to volunteer')
            window.location.href = "index.html";
        }
    });

    function accepted() {
        $("#popup").fadeOut(250);
        $("#overlay").hide();
        $("#accept-button1").text("Accepted")
            .attr("disabled", true)
            .css({
                backgroundColor: "rgba(31, 32, 32, 0)",
                color: "rgb(0, 95, 71)",
                height: "2.5rem",
                width: "100%",
                maxWidth: "100px",
                borderRadius: "5px",
            })
    }

    function pending() {
        $("#popup").fadeOut(250);
        $("#overlay").hide();
        $("#accept-button1").text("Pending")
            .attr("disabled", true)
            .css({
                backgroundColor: "rgba(31, 32, 32, 0)",
                color: "rgb(143, 4, 62)",
                height: "2.5rem",
                width: "100%",
                maxWidth: "100px",
                borderRadius: "5px",
            })
    }

});