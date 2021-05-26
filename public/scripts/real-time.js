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
    const uid = GetURLParameter('acceptee')


    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('hi')
            document.getElementById("message").addEventListener("keyup", (e) => {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    document.getElementById("submit-button").click();
                }
            })
            $('#submit-button').on('click', (e) => {
                e.preventDefault()
                const text = $('#message').val()
                document.getElementById('message').value = ''
                console.log(text)
                db.collection('users').doc(uid).collection('chatrooms').doc(poster_id + post_id + "").collection('messages').add({
                    text,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    uid
                })
                db.collection('users').doc(poster_id).collection('chatrooms').doc(poster_id + post_id + "").collection('messages').add({
                    text,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    uid
                })
            })
            db.collection('users').doc(uid).collection('chatrooms').doc(poster_id + "" + post_id ).collection('messages')
                .orderBy('createdAt')
                .onSnapshot(querySnapshot => {
                    $('#messages').empty()
                    querySnapshot.forEach(doc => {
                        console.log(doc.data().text)
                        const date = doc.data().createdAt.toDate()
                        if (doc.data.uid == user.uid) {
                            $('#messages').append(`<li style="text-align: right">${date.getHours()}:${date.getMinutes()} ${doc.data().text}</li>`)
                        } else {
                            $('#messages').append(`<li style="text-align: left">${doc.data().text} ${date.getHours()}:${date.getMinutes()}</li>`)
                        }
                    })
                })
        } else {
            // No user is signed in.
            alert('You need to sign in first to make a request')
            window.location.href = "index.html";
        }
    })
})