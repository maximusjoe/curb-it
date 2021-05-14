$(document).ready(function() {

    function allRequests() {
        firebase.auth().onAuthStateChanged(function(user) {
            db.collection("users")
                .get()
                .then(function(userCol) {
                    userCol.forEach(function(eachUser) {
                        console.log("Username: " + eachUser.data().name);
                        userRequests(eachUser.id)
                    })
                })
        })
    }

    allRequests();

    function userRequests(userID) {
        firebase.auth().onAuthStateChanged(function(user) {
            db.collection("users").doc(userID).collection("postedRequests")
                .get() //READ asynch
                .then(function(reqCol) {
                    reqCol.forEach(function(req) { //read each document in the collection
                        console.log("Reuqest: " + req.id);
                        let str = '<div>' + req.data().address + '</div>';
                        $("#content").append(str);
                    })
                })
        });
    }



});