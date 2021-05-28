$(document).ready(() => {
    'use strict'
    // URL parser for post id, poster id, and post acceptee
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

    // request id
    const post_id = GetURLParameter('id')
    // uuid of poster
    const poster_id = GetURLParameter('poster')
    // uuid of acceptee
    const uid = GetURLParameter('acceptee')

    // User must be logged to chat
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
                // If Submit with nothing then do nothing
                if (text === '') return
                document.getElementById('message').value = ''
                db.collection('users').doc(uid).collection('chatrooms').doc(poster_id + post_id + "").collection('messages').add({ // Uploads message data to Firestore
                    text, // Message content
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Time message was sent (hours:minutes)
                    senderUID: user.uid, // uuid of the user sending the message
                    senderName: user.displayName // name of the user
                })

                // Set receiver 
                let msg_receiver = ''
                if (user.uid === uid) {
                    msg_receiver = poster_id
                } else if (user.uid === poster_id) {
                    msg_receiver = uid
                }

                // Set the notifications collection of receiver
                const data = await db.collection('users').doc(msg_receiver).collection('notifications').add({
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    text: `${user.displayName} sent you a message`
                })
                // Update the notification collection of receiver so noti would pop up
                db.collection('users').doc(msg_receiver).collection('notifications').doc(data.id).update({
                    senderID: user.uid,
                    url: `real-time-messaging.html?id=${post_id}&poster=${poster_id}&acceptee=${uid}`
                })

                // Save messages
                db.collection('users').doc(poster_id).collection('chatrooms').doc(poster_id + post_id + "").collection('messages').add({
                    text,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    senderUID: user.uid,
                    senderName: user.displayName
                })
            })
            // Insert new messages to the page
            db.collection('users').doc(uid).collection('chatrooms').doc(poster_id + "" + post_id).collection('messages')
                .orderBy('createdAt')
                .onSnapshot(querySnapshot => {
                    $('#messages').empty()
                    querySnapshot.forEach(doc => {
                        const date = doc.data().createdAt.toDate()
                        // if the message is sent by the user, messages will appear on the right
                        // otherwise the message will appear on the left
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