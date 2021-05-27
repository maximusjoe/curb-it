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
            document.getElementById("message").addEventListener("keyup", (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    document.getElementById("submit-button").click();
                }
            })
            $('#submit-button').on('click', async (e) => {
                e.preventDefault()
                const text = $('#message').val()
                if (text === '') return
                document.getElementById('message').value = ''
                db.collection('users').doc(uid).collection('chatrooms').doc(poster_id + post_id + "").collection('messages').add({
                    text,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    senderUID: user.uid,
                    senderName: user.displayName
                })

                let msg_receiver = ''
                if (user.uid === uid) {
                    msg_receiver = poster_id
                } else if (user.uid === poster_id) {
                    msg_receiver = uid
                }

                const data = await db.collection('users').doc(msg_receiver).collection('notifications').add({
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    text: `${user.displayName} sent you a message`
                })
                db.collection('users').doc(msg_receiver).collection('notifications').doc(data.id).update({
                    senderID: user.uid,
                    url: `real-time-messaging.html?id=${post_id}&poster=${poster_id}&acceptee=${uid}`
                })

                db.collection('users').doc(poster_id).collection('chatrooms').doc(poster_id + post_id + "").collection('messages').add({
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
                        const date = doc.data().createdAt.toDate()
                        if (doc.data().senderUID == user.uid) {
                            $('#messages').append(`<div class="each-textbox right-textbox">
                            <div class="name"><span class="time">${date.getHours()}:${date.getMinutes()}</span> - You</div>
                            <div class="text-content">
                            <div class="text">${doc.data().text}</div>
                            </div>
                            </div>`)
                        } else {
                            $('#messages').append(`<div class="each-textbox left-textbox">
                            <div class="name">${doc.data().senderName} - <span class="time">${date.getHours()}:${date.getMinutes()}</span></div>
                            <div class="text-content">
                            <div class="text">${doc.data().text}</div>
                            </div>
                            </div>`)
                        }
                    })
                    window.scrollTo(0, document.body.scrollHeight)
                })
        } else {
            // No user is signed in.
            alert('You need to sign in first to make a request')
            window.location.href = "index.html";
        }
    })
})