$(document).ready(function() {
    $("#add-button").click(function(e) {
        e.preventDefault();

        let idCount = 0;

        let item_input = $("#list-input").val();
        itemArray.push(item_input);

        console.log(item_input);

        $("#list-input").before('<div id="' + itemArray.length + '" class="each-item"><span class="item-name">' + item_input + '</span><button id="delete' + itemArray.length + '" type="button" class="cross btn-close"></button></div>')

    })

    var itemArray = new Array();
    console.log(itemArray);

});