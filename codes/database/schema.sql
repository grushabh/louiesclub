

CREATE TABLE users (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  external_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  zip_code_address VARCHAR(1023),
  first_name VARCHAR (255),
  last_name VARCHAR (255),
  membership_type VARCHAR (255),
  last_online DATETIME,
  hosting_page_complete BOOLEAN,
  host_non_shedding_only BOOLEAN,
  host_neutered_only BOOLEAN,
  home_type VARCHAR(255),
  has_yard BOOLEAN,
  has_kids BOOLEAN,
  saved_users TEXT,
  during_work_days VARCHAR(1023),
  dogs TEXT,
  dog_added BOOLEAN,
  cats_in_home BOOLEAN,
  can_host_sizes TEXT,
  account_verified BOOLEAN,
  created_at DATETIME,
  updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (`external_id`)
);






