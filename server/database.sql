CREATE TABLE users_email
(
    id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    name VARCHAR(100) ,
    gender VARCHAR (10)  ,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    birthdate VARCHAR(30)  ,
    address VARCHAR (100) ,
    code VARCHAR(6),
    verify boolean DEFAULT FALSE
);

INSERT INTO users
    (user_name,user_email,user_password)
VALUES('kalin', 'kalin123@gmail.com', 'kit123');

