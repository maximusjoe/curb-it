$(document).ready(function() {

    //Extract poster id and post id from the url
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

                    //Parse in all the existed info of the request into the input value 
                    let address = doc.data().address;
                    console.log(address)
                    let city = doc.data().city;
                    itemArray = doc.data().list;
                    photo = doc.data().photo;
                    size = doc.data().size;

                    for (let i = 0; i < itemArray.length; i++) {
                        $("#add-button").after('<div id="' + i + '" class="each-item"><span class="item-name">' + itemArray[i] + '</span><button id="delete' + i + '" type="button" class="delete btn-close"></button></div>')
                    }

                    let option = $("#size-choice input")
                    for (let i = 0; i < option.length; i++) {
                        console.log(option[i].value)
                        if (option[i].value === size) {
                            $(option[i]).attr('checked', true)
                            break;
                        }
                    }

                    $("#address-input").attr('value', address);
                    $("#city-input").attr('value', city);

                    if (photo != "undefined") {
                        $("#photo-label").after(`<div id="photo-wrapper"><img id="preview"/></div>`)
                        $("#preview").attr('src', photo);
                    }
                    // (`<div><img src="${photo}" class="photo-preview"/></div>`);

                })
        }
    })



    var itemArray = new Array();

    var photoURL;
    var photoID = uniqueID();
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var imgRef = storageRef.child("images/" + photoID + ".jpg");
    var added = false; //the photo is not changed 

    var fileInput = document.getElementById("photo-input");

    fileInput.addEventListener('change', function(e) {

        var file = e.target.files[0];

        imgRef.put(file)

        .then(function() {
            console.log('Uploaded to Cloud Storage.');
            added = true;
            imgRef.getDownloadURL()
                .then((url) => {
                    photoURL = url;
                    console.log('url: ' + photoURL);
                    $("#preview").attr('src', photoURL);
                })

        })

    });


    $('#edit-button').click(function(e) {
        e.preventDefault();

        let address = $("#address-input").val();
        let city = $("#city-input").val();

        //if the photo changes, then download the new photo, else use the old one
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
                                size,
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

    //Add items to the item array
    function addItem() {
        $("#add-button").click(function(e) {
            e.preventDefault();

            let item_input = $("#list-input").val();
            itemArray.push(item_input);
            document.getElementById('list-input').value = ''

            console.log(item_input);
            console.log(itemArray);

            $("#add-button").after('<div id="' + (itemArray.length - 1) + '" class="each-item"><span class="item-name">' + item_input + '</span><button id="delete' + (itemArray.length - 1) + '" type="button" class="delete btn-close"></button></div>')

        })
    }
    addItem();

    //delete item from the item array 
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

    var size = "";

    function choosingSize() {
        $("#size-choice").on('click', 'input', function() {
            console.log($(this).attr('value'));
            size = $(this).attr('value');
        })

    }
    choosingSize();

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