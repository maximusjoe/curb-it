$(document).ready(() => {

    const isTony = (uid) => {
        console.log(uid)
        return uid === 'flOMf57QzNPi8DMPiYnNhH22hfp2'
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const uid = user.uid
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
                db.collection('messages').add({
                    text,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    uid
                })
            })
            db.collection('messages')
                .orderBy('createdAt')
                .onSnapshot(querySnapshot => {
                    $('#messages').empty()
                    querySnapshot.forEach(doc => {
                        const isRealTony = isTony(doc.data().uid)
                        console.log(doc.data().text)
                        const date = doc.data().createdAt.toDate()
                        if (isRealTony) {
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