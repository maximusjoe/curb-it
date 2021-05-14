jQuery(function () {
    // publicRequests
    db.collection("publicRequests").where("available", "==", true)
        .onSnapshot((querySnapshot) => {
            var postsArray = [];
            querySnapshot.forEach((doc) => {
                postsArray.push(doc.data());
            });
            $('#newsfeed-container').empty()
            for (let i = 0; i < postsArray.length; i++) {
                if (postsArray[i].available === true) {
                    $('#newsfeed-container')
                        .append(`<a href="#" class="list-group-item list-group-item-action" aria-current="true">
                        <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${postsArray[i].ID}</h5>
                        <small>3 days ago</small></div><p class="mb-1">${postsArray[i].address}.</p><small>${postsArray[i].items}.</small></a>`)
                }
            }
        });
})