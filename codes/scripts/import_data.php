<?php

require_once '../utils/utils.php';
require_once '../vendor/autoload.php';
use Elasticsearch\ClientBuilder;

$http_method = 'GET';
$url = 'https://louiesclub.com/version-test/api/1.1/obj/user';
$headers = [
    'Authorization' => 'Bearer a7917ffa84ccead6362358e460b8c41a',
    'Content-Type' => 'applicaton/json'
];

$cursor = 0;
$limit = 1;

$hosts = [
    'http://search-louiesclub-xy5kbg5cncx3snc5niiben3cdu.us-west-2.es.amazonaws.com:80'
];

$client = ClientBuilder::create()->setHosts($hosts)->build();


do {
    $cursor++;
    $params = [
        'cursor' => $cursor,
        'limit' => $limit
    ];
    $curl_response = json_decode(curl_get($url, $headers, $params), true);
    $users = $curl_response['response']['results'];

    if(empty($users)) break;

    $user = $users[0];

    $user['created_at'] = $user['Created Date'];
    unset($user['Created Date']);

    $user['updated_at'] = $user['Modified Date'];
    unset($user['Modified Date']);

    $user['zip_code_address_geographic_address']['location'] = [];
    $user['zip_code_address_geographic_address']['location']['lat'] = $user['zip_code_address_geographic_address']['lat'];
    $user['zip_code_address_geographic_address']['location']['lon'] = $user['zip_code_address_geographic_address']['lng'];
    unset($user['zip_code_address_geographic_address']['lat']);
    unset($user['zip_code_address_geographic_address']['lng']);

    unset($user['phone_verify_code_text_text']);
    unset($user['response_rate_number']);
    unset($user['response_reminder_emails_boolean']);
    unset($user['woofs_earned_number']);
    unset($user['refer_fb_liked_boolean']);
    unset($user['refer_fb_shared_boolean']);
    unset($user['notify_added_to_favs_boolean']);
    unset($user['flag_upgrade_offered_boolean']);

    $user['user_id'] = $user['_id'];
    unset($user['_id']);
    unset($user['_type']);
    //dddd($user);
    //dog
    foreach($user['dog_list_custom_dog'] as $i => $dog_id) {
        $http_method2 = 'GET';
        $url2 = "https://louiesclub.com/version-test/api/1.1/obj/dog/$dog_id";
        $headers2 = [
            'Authorization' => 'Bearer a7917ffa84ccead6362358e460b8c41a',
            'Content-Type' => 'applicaton/json'
        ];
        $curl_response2 = json_decode(curl_get($url2, $headers2, []), true);
        $dog = $curl_response2['response'];

        $dog['created_at'] = $dog['Created Date'];
        unset($dog['Created Date']);

        $dog['updated_at'] = $dog['Modified Date'];
        unset($dog['Modified Date']);

        unset($dog['review_list_custom_review']);

        $dog['zip_code_geographic_address']['location'] = [];
        $dog['zip_code_geographic_address']['location']['lat'] = $dog['zip_code_geographic_address']['lat'];
        $dog['zip_code_geographic_address']['location']['lon'] = $dog['zip_code_geographic_address']['lng'];
        unset($dog['zip_code_geographic_address']['lat']);
        unset($dog['zip_code_geographic_address']['lng']);

        unset($dog['response_rate_number']);

        $dog['dog_id'] = $dog['_id'];
        unset($dog['_id']);
        unset($dog['_type']);
        $user['dog_list_custom_dog'][$i] = $dog;
    }




    $document = [
        'index' => 'louiesclub_feb',
        'type' => 'user',
        'id' => $user['user_id'],
        'body' => $user
    ];

    $response = $client->index($document);

    ddd("*******************cursor:".$cursor);

} while (true);


