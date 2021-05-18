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

    // Check whether a user is logged in.
    firebase.auth().onAuthStateChanged(async (user) => {
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
            numberOfItems,
            postedDate,
            width
        } = data
        $('#requester').html(name)
        $('#city').html(city)

        for (let i = 0; i < itemsList.length; i++) {
            $('#item-list').append(`<li>${itemsList[i]}</li>`)
        }
        if (user) {
            // User is signed in.
            $('#accept-button').on('click', async (e) => {
                if (user.uid === poster_id) {
                    alert('You cannot accept your own post')
                } else {
                    await db.collection('users').doc(poster_id).collection('postedRequests')
                        .doc(post_id).update({
                            available: false,
                        })
                    window.location.href = `profile.html?uid=${user.uid}`
                }
            })
        } else {
            // No user is signed in.
            alert('You need to sign in first to volunteer')
            window.location.href = "login.html";
        }
    });

})