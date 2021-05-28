$(document).ready(function () {

    // adds item types to an array on button click
    function addItem() {

        // listener for button click
        $("#add-button").click(function (e) {
            e.preventDefault();

            let item_input = $("#list-input").val();
            itemArray.push(item_input);
            document.getElementById('list-input').value = ''

            console.log(item_input);
            console.log(itemArray);

            // Displays array of items
            $("#add-button").after('<div id="' + (itemArray.length - 1) + '" class="each-item"><span class="item-name">' + item_input + '</span><button id="delete' + (itemArray.length - 1) + '" type="button" class="delete btn-close"></button></div>')

        })
    }
    addItem();

    // Removes item from array when the x is clicked
    function deleteItem() {

        // listener for button click
        $("#item-list").on('click', 'div.each-item', function () {
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

    // Array of item types
    var itemArray = new Array();

    // Size of request can be "Small", "Medium", or "Large"
    var size = "";

    // sets size to selected value on the form.
    function choosingSize() {
        $("#size-choice").on('click', 'input', function () {
            console.log($(this).attr('value'));
            size = $(this).attr('value');
        })

    }
    choosingSize();

    // URL to photo in Firebase Storage.
    var photoURL;
    // Unique identifier to set image name when saving to Firebase Storage.
    var photoID = uniqueID();
    // Firebase Storage refrences.
    var storage = firebase.storage();
    var storageRef = storage.ref();
    // Where image is being stored in Firebase Storage
    var imgRef = storageRef.child("images/" + photoID + ".jpg");


    // Uploads photo when a change is detected on file input
    var fileInput = document.getElementById("photo-input");
    fileInput.addEventListener('change', function (e) {

        // Grabs first file selected 
        var file = e.target.files[0];
        if (e.target.files.length > 1) return alert('You only need to upload 1 image.')

        // Uploads to Firebase Storage
        imgRef.put(file)
            .then(function () {
                console.log('Uploaded to Cloud Storage.');
                imgRef.getDownloadURL()
                    .then((url) => {
                        photoURL = url;
                        
                    })
            })

    });

    // Automatically fills address field with users default if present
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    let defaultAddress = doc.data().address;
                    let defaultCity = doc.data().city;

                    $("#address-input").attr('value', defaultAddress);
                    $("#city-input").attr('value', defaultCity);
                })
        }
    })

    // Submits form and uploads data to Firestore
    $('#submit-button').click(function (e) {
        e.preventDefault();

        let address = $("#address-input").val();
        let city = $("#city-input").val();

        // Gets url of selected image in Firebase Storage
        imgRef.getDownloadURL()
            .then((url) => {
                photoURL = url;
                console.log("got it!!")
            })

        // Only allows user to submit form if logged in.
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // Uploads form data into Firestore.
                db.collection("users").doc(user.uid)
                    .get()
                    .then(function (doc) {
                        const name = doc.data().name;
                        const email = doc.data().email
                        db.collection("users").doc(user.uid).collection("postedRequests").add({
                            name, // Name of user submitting request
                            email, // email of user subbmitting request
                            uid: user.uid, // user's UUID
                            address, // Address entered
                            city, // city entered
                            list: itemArray, // list of item types
                            size, // Size of pickup
                            photo: photoURL, // URL of image in Firebase Storage
                            postedDate: getDateTime(), // Time request was posted
                            available: true // whether or not request appears on main.html. Default is True.
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

    // if request uploads to database redirects user to a success message.
    function redirectToSuccess(id) {
        window.location.href = `postSuccess.html?id=${id}`;
    }

});

// Unique id generator for image name
function uniqueID() {
    return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
}

// gets current date for when the request was posted.
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