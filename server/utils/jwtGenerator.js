const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(id) {
  const payload = {
    user: id
  };

  return jwt.sign(payload, process.env.jwtSecret, {
    expiresIn: "365000days" //never expired
  });
}
function jwtGeneratorAdmin(id) {
  const payload = {
    user: id
  };

  return jwt.sign(payload, process.env.jwtSecret, {
    expiresIn: "12h"
  });
}

module.exports = { jwtGenerator, jwtGeneratorAdmin };
