<?php

require_once '../utils/utils.php';
require_once 'User.php';
require_once 'Dog.php';

$http_method = 'GET';
$url = 'https://louiesclub.com/version-test/api/1.1/obj/user';
$headers = [
    'Authorization' => 'Bearer a7917ffa84ccead6362358e460b8c41a',
    'Content-Type' => 'applicaton/json'
];
$params = [
    'limit' => 1
];

ddd(curl_get($url, $headers, $params));

$user = new User();
$user->id = 1;

var_dump($user->id);
var_dump($user->external_id);

