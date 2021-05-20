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
                        let eachPost = `<div class="each-post" id="${req.id}" data-items="${req.data().numberOfItem}" data-city="${req.data().city}" data-date="${req.data().postedDate}"><div class="number-of-item">${req.data().numberOfItem} item(s)</div><div class="city"> ${req.data().city}</div><div class="date">Posted on ${req.data().postedDate}</div></div>`
                        $('#spinner').hide()
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

    $("#apply").click(function() {
        if (document.getElementById("all-select").value == "sortItemsDesc"){
            $("#content .each-post")
                .sort(function (a, b) {
                    return $(a).data("items") - $(b).data("items");
                })
                .appendTo("#content");
        }
        if (document.getElementById("all-select").value == "sortItemsAsc"){
            $("#content .each-post")
                .sort(function (a, b) {
                    return $(b).data("items") - $(a).data("items");
                })
                .appendTo("#content");
        }
        if (document.getElementById("all-select").value == "sortCityDesc"){
           
            jQuery.fn.sortDivs = function sortDivs() {
                $("> div", this[0]).sort(dec_sort).appendTo(this[0]);
                function dec_sort(a, b){ return ($(b).data("city")) < ($(a).data("city")) ? 1 : -1; }
            }
            $("#content").sortDivs();
        }
        if (document.getElementById("all-select").value == "sortDateDesc"){
            jQuery.fn.sortDivs = function sortDivs() {
                $("> div", this[0]).sort(dec_sort).appendTo(this[0]);
                function dec_sort(b, a){ return ($(b).data("date")) < ($(a).data("date")) ? 1 : -1; }
            }
            $("#content").sortDivs();
        }
        if (document.getElementById("all-select").value == "sortDateAsc"){
            jQuery.fn.sortDivs = function sortDivs() {
                $("> div", this[0]).sort(dec_sort).appendTo(this[0]);
                function dec_sort(a, b){ return ($(b).data("date")) < ($(a).data("date")) ? 1 : -1; }
            }
            $("#content").sortDivs();
        }
        
    });


});