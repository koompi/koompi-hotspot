require("dotenv").config();

const qs = require("querystring");
const http = require("https");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_Authorization;

const sendSMS = async (to, message) => {
  try {
    const data = qs.stringify({
      Body: message,
      To: to,
      From: "KOOMPI-FiFi"
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
  } catch (error) {
    console.log("Error at sendSMS method : ", error);
  }
};
module.exports = { sendSMS };
