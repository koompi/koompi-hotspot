CREATE TABLE useraccount
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


-- some sql command 
-- UPDATE radgroupcheck SET groupname= REPLACE(groupname,'30','50') WHERE acc_id = '.......'

-- SELECT b.id,b.fullname, b.phone, b.gender, b.birthdate, b.address, b.role, b.activate, a.acc_id,a.calledstationid,a.acctterminatecause 
--      FROM useraccount AS b INNER JOIN radacct as a ON (b.id::text like a.acc_id AND  a.calledstationid ='saang-school' AND a.acctterminatecause IS NULL);
-- Or
--SELECT detail.id,detail.fullname, detail.phone, detail.gender, detail.birthdate, detail.address, detail.role, detail.activate, c.acc_id,c.calledstationid,c.acctterminatecause
--FROM  useraccount AS detail, radacct AS c
--WHERE detail.id::text=c.acc_id AND  c.calledstationid ='saang-school' AND c.acctterminatecause IS NULL;