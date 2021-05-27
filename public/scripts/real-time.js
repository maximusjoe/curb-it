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
                if (e.key === 'Enter') {
                    e.preventDefault();
                    document.getElementById("submit-button").click();
                }
            })
            $('#submit-button').on('click', async (e) => {
                e.preventDefault()
                const text = $('#message').val()
                document.getElementById('message').value = ''
                const data = await db.collection('users').doc(uid).collection('chatrooms').doc(poster_id + post_id + "").collection('messages').add({
                    text,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    senderUID: user.uid,
                    senderName: user.displayName
                })



                await db.collection('users').doc(poster_id).collection('chatrooms').doc(poster_id + post_id + "").collection('messages').add({
                    text,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    senderUID: user.uid,
                    senderName: user.displayName
                })
            })
            db.collection('users').doc(uid).collection('chatrooms').doc(poster_id + "" + post_id).collection('messages')
                .orderBy('createdAt')
                .onSnapshot(querySnapshot => {
                    $('#messages').empty()
                    querySnapshot.forEach(doc => {
                        console.log(doc.data().text)
                        const date = doc.data().createdAt.toDate()
                        if (doc.data().senderUID == user.uid) {
                            $('#messages').append(`<div class="each-textbox" style="text-align: right">
                            <div class="name"><span class="time">${date.getHours()}:${date.getMinutes()}</span> - You</div>
                            <div class="text-content">
                            <div class="text">${doc.data().text}</div>
                            </div>
                            </div>`)
                        } else {
                            $('#messages').append(`<div class="each-textbox" style="text-align: left">
                            <div class="name">${doc.data().senderName} - <span class="time">${date.getHours()}:${date.getMinutes()}</span></div>
                            <div class="text-content">
                            <div class="text">${doc.data().text}</div>
                            </div>
                            </div>`)
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