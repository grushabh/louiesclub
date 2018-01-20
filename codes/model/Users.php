<?php

require_once '../utils/utils.php';

class Users
{



    public static function importAllUsers() {


    }

    public static function importUsers($cursor, $limit = 100) {
        $http_method = 'GET';
        $url = 'https://louiesclub.com/version-test/api/1.1/obj/user';
        $headers = [
            'Authorization' => 'Bearer a7917ffa84ccead6362358e460b8c41a',
            'Content-Type' => 'applicaton/json'
        ];
        $params = [
            'cursor' => $cursor,
            'limit' => $limit
        ];

        $response = json_decode(curl_get($url, $headers, $params), true);
        if(empty($response['results'])) {
            return false;
        } else {
            foreach($response['results'] as $result) {
                $user = new User();
                $user->external_id = $result['id'];
                $user->account_verified = $result['account_verified_text__text'];
                $user->can_host_sizes = $result['can_host_sizes_list_text'];
                $user->cats_in_home = $result['cats_in_home1_boolean'];
                $user->created_at = $result['Created Date'];
                $user->dog_added = $result['dog_added__boolean'];
                $user->dogs = implode(',', $result['dog_list_custom_dog']);
                $user->during_work_days = implode(',', $result['during_work_days_new_list_text']);
                $user->email = $result['authentication']['email']['email'];
                $user->first_name = $result['name_text'];
                $user->last_name = $result['last_name_text'];
                $user->has_kids = $result['has_kids_boolean'];
                $user->has_yard = $result['has_yard_boolean'];
                $user->home_type = $result['home_type_text'];
                $user->host_neutered_only = $result['host_neutered_only__boolean'];
                $user->host_non_shedding_only = $result['host_non_shedding_only__boolean'];
                $user->hosting_page_complete = $result['hosting_page_complete__boolean'];
                $user->last_online = $result['last_online_date'];
                $user->membership_type = $result['membership_type_text'];
                $user->saved_users = isset($result['favourites_list_user']) ? $result['favourites_list_user'] : [];
                $user->updated_at = $result['Modified Date'];
            }


            return true;
        }
    }
}