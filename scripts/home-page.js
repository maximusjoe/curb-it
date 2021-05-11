jQuery(function () {
    'use strict'
    $('#make-request-button').on('click', (e) => {
        $('#make-request-post').toggle(0);
    })

    const arrayOfItems = [
        'HELLO', 'HI', 'THREE', 'FOUR', 'FIVE', 'MOCK DATA','RANDOM'
    ];

    const htmlNewsFeed;
    for (let i = 0; i < arrayOfItems.length; i++) {
        
    }

    $('.newsfeed').html(
        '<p></p>'
    )
})