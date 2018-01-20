<?php

require_once '../database/DB.php';

class User
{
    public $id;
    public $external_id;
    public $email;
    public $zip_code_address;
    public $first_name;
    public $last_name;
    public $membership_type;
    public $last_online;
    public $hosting_page_complete;
    public $host_non_shedding_only;
    public $host_neutered_only;
    public $home_type;
    public $has_yard;
    public $has_kids;
    public $saved_users;
    public $during_work_days;
    public $dogs;
    public $dog_added;
    public $cats_in_home;
    public $can_host_sizes;
    public $account_verified;
    public $created_at;
    public $updated_at;


    public function save() {
        $db = DB::getInstance();
        /*$sql = "insert into users(external_id,
email, 
zip_code_address, 
first_name, 
last_name, 
membership_type,
last_online, 
hosting_page_complete,
host_non_shedding_only, 
host_neutered_only,

) values()";*/
        ddd($db->query('select * from users'));
    }



}