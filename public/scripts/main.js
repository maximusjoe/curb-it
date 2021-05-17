$(document).ready(function () {
    'use strict'
    function aFunc() {
        console.log('hi')
    }

    function allRequests() {
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("users")
                .get()
                .then(function (userCol) {
                    userCol.forEach(function (eachUser) {
                        // console.log("Username: " + eachUser.data().name);
                        userRequests(eachUser.id)
                    })
                })
        })
    }

    allRequests();

    window.aFunc= aFunc;

    function userRequests(userID) {
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("users").doc(userID).collection("postedRequests")
                .get() //READ asynch
                .then(function (reqCol) {
                    reqCol.forEach(function (req) { //read each document in the collection
                        // console.log("Request: " + req.id);
                        let eachPost = '<a onClick="aFunc();"><div class="each-post" id="' + req.id + '"><div class="number-of-item">' + req.data().numberOfItem + ' item(s)</div><div class="city">' + req.data().address + '</div><div class="date">Posted on ' + req.data().postedDate + '</div></div></a>'
                        if (req.data().available) {
                            $("#content").append(eachPost);
                        }
                    })
                })
        });
    }

    
    $("#filter-button").click(function () {
        $("#filterContainer").toggle(250);
    });

    
});