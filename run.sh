#!/bin/bash

cd server

#install node module
npm install express pg bcrypt cors dotenv jsonwebtoken

#run backend
npm run server