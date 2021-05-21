$(document).ready(function() {

    function GetURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }

    const post_id = GetURLParameter('id')
    const poster_id = GetURLParameter('poster')
    var photo;

    console.log(post_id);
    console.log(poster_id);

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            db.collection("users").doc(user.uid)
                .collection("postedRequests").doc(post_id)
                .get()
                .then(function(doc) {
                    let address = doc.data().address;
                    console.log(address)
                    let city = doc.data().city;
                    itemArray = doc.data().list;
                    let number = doc.data().numberOfItem;
                    let width = doc.data().width;
                    let height = doc.data().height;
                    photo = doc.data().photo;

                    for (let i = 0; i < itemArray.length; i++) {
                        $("#add-button").after('<div id="' + i + '" class="each-item"><span class="item-name">' + itemArray[i] + '</span><button id="delete' + i + '" type="button" class="delete btn-close"></button></div>')
                    }

                    $("#address-input").attr('value', address);
                    $("#city-input").attr('value', city);
                    $("#number-value").text(number);
                    $("#number-input").attr('value', number);

                    if (photo != "undefined") {
                        $("#preview").attr('src', photo);
                    }
                    // (`<div><img src="${photo}" class="photo-preview"/></div>`);
                    $("#width-value").text(width);
                    $("#width-input").attr('value', width);
                    $("#height-value").text(height);
                    $("#height-input").attr('value', height);
                })
        }
    })



    var itemArray = new Array();

    var photoURL;
    var photoID = uniqueID();
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var imgRef = storageRef.child("images/" + photoID + ".jpg");
    var added = false;

    var fileInput = document.getElementById("photo-input");

    fileInput.addEventListener('change', function(e) {

        var file = e.target.files[0];

        imgRef.put(file)

        .then(function() {
            console.log('Uploaded to Cloud Storage.');
            added = true;
            // imgRef.getDownloadURL()
            //     .then((url) => {
            //         photoURL = url;
            //         $("#preview").attr('src', url);
            //         console.log('Downloaded.');
            //         added = true;
            //     })
        })

    });


    $('#edit-button').click(function(e) {
        e.preventDefault();

        let address = $("#address-input").val();
        let city = $("#city-input").val();
        let width = $("#width-input").val();
        let height = $("#width-input").val();
        let numberOfItem = $("#number-input").val();
        // console.log(numberOfItem);
        // console.log(width)
        // console.log(height)



        if (added) {
            imgRef.getDownloadURL()
                .then((url) => {
                    photoURL = url;
                    console.log('url: ' + photoURL);
                })
        } else {
            photoURL = photo;
        }

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                db.collection("users").doc(user.uid)
                    .get()
                    .then(function(doc) {
                        const name = doc.data().name;
                        const email = doc.data().email
                        db.collection("users").doc(user.uid)
                            .collection("postedRequests").doc(post_id).update({
                                name,
                                email,
                                uid: user.uid,
                                address,
                                city,
                                list: itemArray,
                                width,
                                height,
                                numberOfItem,
                                photo: photoURL,
                                available: true
                            }).then(function(result) {
                                console.log('Upload Successful!')
                                redirectToSuccess(user.uid);
                            }).catch(error => console.log(error))

                    })

            } else {
                // No user is signed in.
                alert('You need to sign in first to make a request')
                window.location.href = "index.html";
            }
        });
    });

    function redirectToSuccess(id) {
        window.location.href = `profile.html?id=${id}`;
    }

    function numberSlider() {
        var numberRange = document.getElementById("number-input");
        var numberValue = document.getElementById("number-value");
        numberValue.innerHTML = numberRange.value;

        numberRange.oninput = function() {
            numberValue.innerHTML = this.value;
        }

        var widthRange = document.getElementById("width-input");
        var widthValue = document.getElementById("width-value");
        widthValue.innerHTML = widthRange.value;

        widthRange.oninput = function() {
            widthValue.innerHTML = this.value;
        }

        var heightRange = document.getElementById("height-input");
        var heightValue = document.getElementById("height-value");
        heightValue.innerHTML = heightRange.value;

        heightRange.oninput = function() {
            heightValue.innerHTML = this.value;
        }
    }
    numberSlider();

    function addItem() {
        $("#add-button").click(function(e) {
            e.preventDefault();

            let item_input = $("#list-input").val();
            itemArray.push(item_input);

            console.log(item_input);
            console.log(itemArray);

            $("#add-button").after('<div id="' + (itemArray.length - 1) + '" class="each-item"><span class="item-name">' + item_input + '</span><button id="delete' + (itemArray.length - 1) + '" type="button" class="delete btn-close"></button></div>')

        })
    }
    addItem();

    function deleteItem() {
        $("#item-list").on('click', 'div.each-item', function() {
            console.log($(this).find('button').attr('class'));

            let button = $(this).find('button');
            let div = $(button).parent();
            console.log($(button).parent().text())

            for (let i = 0; i < itemArray.length; i++) {
                let item = $(button).parent().text()
                if (item === itemArray[i]) {
                    $(div).remove();
                    itemArray.splice(i, 1);
                    console.log(itemArray);
                }
            }
        })

    }
    deleteItem();

});

function uniqueID() {
    return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
}

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