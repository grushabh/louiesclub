<?php

require_once '../utils/utils.php';

class DB {
    private static $db_instance;
    private static $conns;
    private static $db_types = array('account', 'store', 'job');
    private $conn = null;
    private $dbhost = '';
    private $dbname = '';
    private $dbuser = '';
    private $dbpass = '';
    private $insert_id = 0;
    private $affected_rows = 0;

    /*
     *
     *   Static Methods section
     */

    public static function getInstance($dbhost = 'louiesclub.cov1mgoio0x6.us-west-2.rds.amazonaws.com',
                                       $dbname = 'louiesclub',
                                       $dbuser='root',
                                       $dbpass='rootroot') {
        if (!isset(self::$db_instance)) {
            self::$db_instance = new DB($dbhost, $dbname, $dbuser, $dbpass);
        }
        return self::$db_instance;
    }

    private static function get_conn($dbhost, $dbuser, $dbpass) {
        if(!isset(self::$conns)) {
            if(!self::$conns = mysqli_connect($dbhost, $dbuser, $dbpass, 'louiesclub')) {
                dddd('Connection Error: '.mysqli_errno(self::$conns));
            }
        }
        return self::$conns;
    }

    public static function show_create_table($db_type, $table_name) {
        if(!in_array($db_type, self::$db_types)) {
            return '';
        }
        $sql_str = file_get_contents(__DIR__."/../configs/$db_type.sql");
        $sqls = explode(';', $sql_str);
        foreach($sqls as $sql) {
            if(strpos($sql, "`$table_name`")) {
                return $sql.';';
            }
        }
    }

    /*
     * Instance Methods section
     *
     */

    private function  __construct($dbhost, $dbname, $dbuser, $dbpass) {
        $this->dbhost = $dbhost;
        $this->dbname = $dbname;
        $this->dbuser = $dbuser;
        $this->dbpass = $dbpass;
        $this->conn = DB::get_conn($dbhost, $dbuser, $dbpass);
    }

    public function getDBName() {
        return $this->dbname;
    }

    public function query($sql) {
        $res = mysqli_query($this->conn, $sql);
        $this->insert_id = mysqli_insert_id($this->conn);
        $this->affected_rows = mysqli_affected_rows($this->conn);
        if(!$res) {
            ddd("sql query return false : ".$sql);
        }
        return $res;
    }

    public function transact($sqls) {
        if(is_array($sqls)) {
            $start_sql = "start transaction";
            if(mysqli_query($this->conn, $start_sql)) {
                return false;
            }
            foreach($sqls as $sql) {
                if(!mysqli_query($this->conn, $sql)) {
                    return false;
                }
            }
            $commit_sql = "commit";
            if(mysqli_query($this->conn, $commit_sql)) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    public function escape($str)
    {
        return mysqli_real_escape_string($this->conn, $str);
    }

    public function get_insert_id()
    {
        return $this->insert_id;
    }

    public function get_affected_rows() {
        return $this->affected_rows;
    }

    public function fetch_array($res)
    {
        return mysqli_fetch_array($res);
    }

    public function fetch_assoc($res) {
        return mysqli_fetch_assoc($res);
    }

    public function backup() {

        ddd("Start backing up db {$this->dbname} at {$this->dbhost}");

        $date = get_date();
        $timestamp = get_timestamp();
        global $fileuploader_config, $amazonconfig;
        $s3_bucket = $fileuploader_config->store_bucket;
        $backup_folder = $amazonconfig->s3->databasebackup_folder;
        $dst_path = '/'.$s3_bucket.$backup_folder.'/'.$date.'/';
        $user_option = '-u'.$this->dbuser;
        if(!empty($this->dbpass)) {
            $pass_option = '-p'.$this->dbpass;
        } else {
            $pass_option = '';
        }
        $host_option = '-h'.$this->dbhost;

        $command = "mysqldump $user_option $pass_option $host_option {$this->dbname}|gzip |aws put $dst_path{$this->dbname}-{$this->dbhost}-$timestamp.gz";

        ddd(INFO, "backup command: $command");

        exec($command, $output);

        ddd("response: ".json_encode($output));
    }
}