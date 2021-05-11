$(document).ready(function() {

    $('#submit-button').click(function(e) {
        e.preventDefault();

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              db.collection("users").doc(user.uid).collection("postedRequests").doc(postedRequests.uid).set({
                address: $("#address-input").val(),
                items: $("#list-input").val(),
                photo: $("#photo-input").val(),
                date: $("date-input").val(),
                time: $("time-input").val(),
                postedDate: getDateTime.val()
              })

            } else {
              // No user is signed in.
              console.log("ERROR: No User Signed In");
            }
          }); 
    });

});

function getDateTime() {
    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    return datetime;
}