$(() => {
    // Load and add all notifications in the database to the page
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection('users').doc(user.uid).collection('notifications').get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        $('.list-group').append(`<div class="each-noti">
                        <div class="noti-text">${doc.data().text}</div>
                        <div class="noti-time"> ${doc.data().createdAt.toDate()}</div>
                        </div>`)
                    })
                })
        } else {
            window.location.href = 'index.html'
        }
    })
})