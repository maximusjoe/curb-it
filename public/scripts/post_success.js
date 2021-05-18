$(document).ready(() => {

    // https://www.learningjquery.com/2012/06/get-url-parameters-using-jquery
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

    firebase.auth().onAuthStateChanged(async(user) => {
        if (user) {
            console.log(user.uid)
            $('#request-info-button').on('click', (e) => {
                window.location.href = `request-info.html?id=${post_id}&poster=${user.uid}` // Redirect page when click
            })
        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    })
})