This project was bootstrapped with [Postgresql](https://www.postgresql.org/).  

[![CircleCI](https://circleci.com/gh/koompi/koompi-hotspot.svg?style=shield)](https://circleci.com/gh/koompi/koompi.org)


## Available Scripts

In the project directory, you can run:

```
$ cd server
$ npm install express pg bcrypt cors dotenv body-parser aws-sdk
```

For JWT Json Web Token.

```
$ cd server
$ npm install jsonwebtoken
```


For date format.

```
cd server
$ npm install moment
```

## Run server machine

Connection Database.

```
$ cd server
$ cp db.js.example db.js
```

And then change your connection in `db.js`.

Your secret connection with AWS SES.

```
$ cd server
$ cp .env.example .env
```

And then change your connection in `.env`

Run server.


```
cd server
$ npm run server
```

**_Runs in local machine in port http://localhost:5000_**

#
