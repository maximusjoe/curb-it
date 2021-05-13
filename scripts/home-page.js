jQuery(function () {
    'use strict'

    db.collection("publicRequests").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    });

    const arrayOfItems = [{
        ID: '123456789',
        address: "111-helpme",
        city: "poco",
        items: [
            'jar',
            'bottle',
            'can',
            'battery'
        ],
        numOfItems: 8,
        photo: 'idkyet',
        width: 112,
        height: 20,
        postedDate: '12/05/2021@12:20:21'
    }];
    for (let i = 0; i < arrayOfItems.length; i++) {
        $('#newsfeed-container').append(`<a href="#" class="list-group-item list-group-item-action" aria-current="true">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${arrayOfItems[i].ID}</h5>
            <small>3 days ago</small>
          </div>
          <p class="mb-1">${arrayOfItems[i].address}.</p>
          <small>${arrayOfItems[i].items}.</small>
        </a>`)
    }

})