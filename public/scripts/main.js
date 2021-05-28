$(document).ready(function() {
    'use strict'


    //Display all the users' requests
    function allRequests() {
        firebase.auth().onAuthStateChanged(function(user) {
            db.collection("users")
                .get()
                .then(function(userCol) { //Get the user collection
                    userCol.forEach(function(eachUser) { //Each doc of the users collection
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
                .then(function(reqCol) { //Get posted request collection of one user
                    reqCol.forEach(function(req) { //read each document in the collection
                        let eachPost = `<div class="each-post" id="${req.id}" data-size="${req.data().size}" data-city="${req.data().city}" data-date="${req.data().postedDate}"><div class="number-of-item">Size ${req.data().size}</div><div class="city"> ${req.data().city}</div><div class="date">Posted on ${req.data().postedDate}</div></div>`
                        $('#spinner').hide()

                        if (req.data().available) { // Only display posts that are available for acceptance
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


    function defaultSort() {

    }

    $("#apply").click(function() {
        if (document.getElementById("all-select").value == "sortSizeDesc") {
            $("#content .each-post")
                .sort(function(a, b) {
                    console.log($(b).data("size").substring(4))
                    console.log($(b).data("size").substring(4) - $(a).data("size").substring(4))
                    return $(b).data("size").substring(4) - $(a).data("size").substring(4);
                })
                .appendTo("#content");
        }
        if (document.getElementById("all-select").value == "sortSizeAsc") {
            $("#content .each-post")
                .sort(function(a, b) {
                    console.log($(b).data("size").substring(4))
                    console.log($(a).data("size").substring(4) - $(b).data("size").substring(4))
                    return $(a).data("size").substring(4) - $(b).data("size").substring(4);
                })
                .appendTo("#content");
        }
        if (document.getElementById("all-select").value == "sortCityDesc") {

            jQuery.fn.sortDivs = function sortDivs() {
                $("> div", this[0]).sort(dec_sort).appendTo(this[0]);

                function dec_sort(b, a) {
                    return ($(b).data("city")) < ($(a).data("city")) ? 1 : -1;
                }
            }
            $("#content").sortDivs();
        }
        if (document.getElementById("all-select").value == "sortCityAsc") {

            jQuery.fn.sortDivs = function sortDivs() {
                $("> div", this[0]).sort(dec_sort).appendTo(this[0]);

                function dec_sort(a, b) {
                    return ($(b).data("city")) < ($(a).data("city")) ? 1 : -1;
                }
            }
            $("#content").sortDivs();
        }
        if (document.getElementById("all-select").value == "sortDateDesc") {
            jQuery.fn.sortDivs = function sortDivs() {
                $("> div", this[0]).sort(dec_sort).appendTo(this[0]);

                function dec_sort(b, a) {
                    return ($(b).data("date")) < ($(a).data("date")) ? 1 : -1;
                }
            }
            $("#content").sortDivs();
        }
        if (document.getElementById("all-select").value == "sortDateAsc") {
            jQuery.fn.sortDivs = function sortDivs() {
                $("> div", this[0]).sort(dec_sort).appendTo(this[0]);

                function dec_sort(a, b) {
                    return ($(b).data("date")) < ($(a).data("date")) ? 1 : -1;
                }
            }
            $("#content").sortDivs();
        }

    });

});