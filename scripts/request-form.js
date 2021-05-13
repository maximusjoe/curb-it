$(document).ready(function() {
    $("#add-button").click(function(e) {
        e.preventDefault();

        let idCount = 0;

        let item_input = $("#list-input").val();
        itemArray.push(item_input);

        console.log(item_input);

        $("#add-button").after('<div id="' + itemArray.length + '" class="each-item"><span class="item-name">' + item_input + '</span><button id="delete' + itemArray.length + '" type="button" class="cross btn-close"></button></div>')

    })

    var itemArray = new Array();
    console.log(itemArray);

    $('#submit-button').click(function(e) {
        e.preventDefault();

        let address = $("#address-input").val();
        let city = $("#city-input").val();
        let width = $("#width-input").val();
        let height = $("#width-input").val();
        let numberOfItem = $("#number-input").val();
        console.log(numberOfItem);


        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                db.collection("users").doc(user.uid)
                    .get()
                    .then(function(doc) {
                        var n = doc.data().name;

                        db.collection("users").doc(user.uid).collection("postedRequests").add({
                            name: n,
                            address: address,
                            city: city,
                            //photo: $("#photo-input").val(),
                            list: itemArray,
                            width: width,
                            height: height,
                            numberOfItem: numberOfItem,
                            postedDate: getDateTime()
                        });

                        db.collection("publicRequests").add({
                            name: n,
                            address: address,
                            city: city,
                            //photo: $("#photo-input").val(),
                            list: itemArray,
                            width: width,
                            height: height,
                            numberOfItem: numberOfItem,
                            postedDate: getDateTime()
                        });


                    })

            } else {
                // No user is signed in.
                console.log("No User Signed In");
                window.location.href = "login.html";
            }
        });
    });

});

function getDateTime() {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/" +
        (currentdate.getMonth() + 1) + "/" +
        currentdate.getFullYear() + " @ " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds();
    return datetime;
}