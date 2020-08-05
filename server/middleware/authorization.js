const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // FORMAT OF TOKEN
    // Authorization: Bearer <access_token>
    // Verify Token
    const bearerHeader = req.headers["authorization"];
    //  const jwtToken = req.header("token");
    if (typeof bearerHeader !== "undefined") {
      //Split at the space
      const bearer = bearerHeader.split(" ");
      //Get token from array
      const bearerToken = bearer[1];
      //Set the token
      req.token = bearerToken;
    }

    // DID NOT FORMAT TO BEARER TOKEN

    // if (!jwtToken) {
    //     return res.json.status(403).json("Not Authorize");
    // }

    const payload = jwt.verify(req.token, process.env.jwtSecret);
    req.user = payload.user;
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).json("Not Authorize");
  }
};
