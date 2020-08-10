#!/bin/bash

cd server

#install node module
npm install express pg bcrypt cors dotenv jsonwebtoken moment

#run backend
npm run server