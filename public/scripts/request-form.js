$(document).ready(function () {
    $("#add-button").click(function (e) {
        e.preventDefault();

        let item_input = $("#list-input").val();
        itemArray.push(item_input);

        console.log(item_input);

        $("#add-button").after('<div id="' + itemArray.length + '" class="each-item"><span class="item-name">' + item_input + '</span><button id="delete' + itemArray.length + '" type="button" class="cross btn-close"></button></div>')

    })

    var itemArray = new Array();
    console.log(itemArray);
    var photoURL;
    var photoID = uniqueID();
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var imgRef = storageRef.child("images/" + photoID + ".jpg");



    var fileInput = document.getElementById("photo-input");
    fileInput.addEventListener('change', function (e) {

        var file = e.target.files[0];

        imgRef.put(file)
            .then(function () {
                console.log('Uploaded to Cloud Storage.');
            })

    });


    var numberRange = document.getElementById("number-input");
    var numberValue = document.getElementById("number-value");
    numberValue.innerHTML = numberRange.value;

    numberRange.oninput = function () {
        numberValue.innerHTML = this.value;
    }

    var widthRange = document.getElementById("width-input");
    var widthValue = document.getElementById("width-value");
    widthValue.innerHTML = widthRange.value;

    widthRange.oninput = function () {
        widthValue.innerHTML = this.value;
    }

    var heightRange = document.getElementById("height-input");
    var heightValue = document.getElementById("height-value");
    heightValue.innerHTML = heightRange.value;

    heightRange.oninput = function () {
        heightValue.innerHTML = this.value;
    }

    $('#submit-button').click(function (e) {
        e.preventDefault();

        let address = $("#address-input").val();
        let city = $("#city-input").val();
        let width = $("#width-input").val();
        let height = $("#width-input").val();
        let numberOfItem = $("#number-input").val();
        console.log(numberOfItem);
        console.log(width)
        console.log(height)

        imgRef.getDownloadURL()
            .then((url) => {
                photoURL = url;
            })


        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                db.collection("users").doc(user.uid)
                    .get()
                    .then(function (doc) {
                        const name = doc.data().name;
                        const email = doc.data().email
                        db.collection("users").doc(user.uid).collection("postedRequests").add({
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
                            postedDate: getDateTime(),
                            available: true
                        }).then(function (result) {
                            console.log('Upload Successful!')
                            redirectToSuccess(result.id)
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
        window.location.href = `postSuccess.html?id=${id}`;
    }

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
};