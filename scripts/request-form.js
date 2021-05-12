
$(document).ready(function() {

    $('#submit-button').click(function(e) {
        e.preventDefault();

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {  
                var dateControl = document.querySelector('input[type="date"]');
                var timeControl = document.querySelector('input[type="time"]');
                
                console.log($("#address-input").val().toString());
                console.log($("#list-input").val().toString());
                console.log($("#photo-input").val().toString());
                console.log(dateControl.value);
                console.log(timeControl.value);
                console.log(getDateTime().toString());

                db.collection("users").doc(user.uid).collection("postedRequests").get().then(function(querySnapshot) {  
                    var postID = querySnapshot.size + 1;
                    console.log(postID); 
                     db.collection("users").doc(user.uid).collection("postedRequests").doc(postID.toString()).set({
                         address: $("#address-input").val().toString(),
                         items: $("#list-input").val().toString(),
                         photo: $("#photo-input").val().toString(),
                         date: dateControl.value,
                         time: timeControl.value,
                         postedDate: getDateTime()
                       });
                    });

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