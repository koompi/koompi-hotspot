CREATE TABLE users_email(
    user_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    gender VARCHAR (10) NOT  NULL ,
    user_email VARCHAR(100) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    birthdate VARCHAR(30) NOT NULL ,
    address VARCHAR (100) NOT NULL 
);

INSERT INTO users(user_name,user_email,user_password) 
    VALUES('kalin','kalin123@gmail.com','kit123');

