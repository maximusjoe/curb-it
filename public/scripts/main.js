$(document).ready(function() {
    'use strict'
    
    function allRequests() {
        firebase.auth().onAuthStateChanged(function(user) {
            db.collection("users")
                .get()
                .then(function(userCol) {
                    userCol.forEach(function(eachUser) {
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
                        let eachPost = `<div class="each-post" id="${req.id}"><div class="number-of-item">${req.data().name}: ${req.data().numberOfItem} item(s)</div><div class="city"> ${req.data().address}</div><div class="date">Posted on ${req.data().postedDate}</div></div>`
                        if (req.data().available) {
                            $("#content").append(eachPost);
                            redirectToInfo(req.id, req.data().uid);
                        }
                    })
                })
        });
    }


    $("#filter-button").click(function() {
        $("#filterContainer").toggle(250);
    });

    function redirectToInfo(id, uid) {
        document.getElementById(id)
            .addEventListener("click", function() {
                window.location.href = `request-info.html?id=${id}&poster=${uid}` // Redirect page when click
            });
    }


});