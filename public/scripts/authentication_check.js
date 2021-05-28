$(document).ready(() => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            $('#login-logout').text('Logout')
            // Notifications
            db.collection("users").doc(user.uid).collection('notifications')
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            // console.log('added')
                            // console.log("New : ", change.doc.data());
                        }
                        if (change.type === "modified") {
                            const data = change.doc.data()
                            // console.log("Modified Successful", change.doc.data());
                            $('#toast-container').append(`<div style="cursor:pointer;" id="myToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <img src="./img/favicon.ico" class="rounded me-2" alt="...">
                  <strong class="me-auto">Curb-It</strong>
                  <small class="text-muted">2 seconds ago</small>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                 ${data.text}
                </div>
              </div>`)
                            $('.toast').toast('show')
                            var myToastEl = document.getElementById('myToast')
                            myToastEl.addEventListener('hidden.bs.toast', function () {
                                document.getElementById('toast-container').lastChild.remove()
                            })
                            myToastEl.addEventListener('click', (e) => {
                                window.location.href = data.url
                            })

                        }
                    })
                })


            $('#login-logout').on('click', (e) => {
                firebase.auth().signOut().then(() => {
                    // Sign-out successful.
                    console.log('Signed out Successfully')
                    window.location.href = 'index.html'
                }).catch((error) => {
                    // An error happened.
                    console.log(error)
                });
            })
            console.log('You are logged in')
        } else {
            $('#login-logout').text('Sign-in')
            $('#login-logout').on('click', (e) => {
                window.location.href = 'index.html'
            })
            console.log('You are not logged in')
        }
    })
})