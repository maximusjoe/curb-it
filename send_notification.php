<?php
function sendNotification(){
    $url ="https://fcm.googleapis.com/fcm/send";

    $fields=array(
        "to"=>$_REQUEST['token'],
        "notification"=>array{
            "body"=>$_REQUEST['message'],
            "title"=>$_REQUEST['title'],
            "icon"=>$_REQUEST['icon'],
            "click_action"=>$_REQUEST=>"https://google.com"
        }
    )

    $headers=array(
        'Authorization: key=AAAA2GHOoB8:APA91bF8D4q56HHNZ5OSSWAz0JfdT3IpDAaoctfzr52uPe7gOaT3zPEC2iky4R3hxIuso2htI7FGlL0QdgEfSQraWWJCE9Vvwu8i-E7DQvmxPaDTg-eTWGqQ5TFiyRIdf6OH6hvLIuRU',
        'Content-Type:application/json'
    )

    $ch=curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopts($ch, CURLOPT_POSTFIELDS, json_encode($fields));
    $result=curl_exec($ch);
    print_r($result);
    curl_close($ch);
}
sendNotification();