

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

CREATE TABLE dogs (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  external_id VARCHAR(255) NOT NULL,
  creator VARCHAR(255) NOT NULL,
  zip_code_address VARCHAR(1023),
  timid INT,
  size TEXT,
  shy_w_dogs INT,
  potty_trained VARCHAR(255),
  owner_id VARCHAR(255),
  owner_email VARCHAR(255) NOT NULL,
  non_shedding BOOLEAN,
  neutered BOOLEAN,
  name VARCHAR(255),
  gets_along_with_kids BOOLEAN,
  gets_along_with_dogs BOOLEAN,
  gets_along_with_cats BOOLEAN,
  gender VARCHAR(255),
  during_work_days VARCHAR(1023),
  calm_w_dogs INT,
  breeds VARCHAR(255),
  birth_date DATETIME,
  anxious_w_alone INT,
  lazy INT,
  created_at DATETIME,
  updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (`external_id`)
);





