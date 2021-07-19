require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_Authorization;

const qs = require("querystring");
const http = require("https");

const data = qs.stringify({
  Body: "This is the ship that made the Kessel",
  To: "+85598939699",
  From: `hot-fifi`
});

const options = {
  method: "POST",
  hostname: "api.twilio.com",
  port: null,
  path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": data.length,
    Authorization: authToken
  }
};

const req = http.request(options, function(res) {
  const chunks = [];

  res.on("data", function(chunk) {
    chunks.push(chunk);
  });

  res.on("end", function() {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(data);
req.end();
