$(() => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection('users').doc(user.uid).collection('notifications').get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    $('.list-group').append(`<li class="list-group-item">${doc.data().text}     ${doc.data().createdAt.toDate()}</li>`)
                })
            })
        } else {
            window.location.href = 'index.html'
        }
    })
})