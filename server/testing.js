
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const myPhone = process.env.TWILIO_PHONE_NUMBER;

const client = require("twilio")(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    await client.messages
      .create({
        body: message,
        from: myPhone,
        to: to
      })
      .then(message => {
        console.log(message.sid);
      })
      .done();
  } catch (error) {
    console.error(error.message);
  }
};
sendSMS("+855314004102", "PULIN");
