// const router = require("express").Router();

// const accountSid = "ACb47fc250e00c33e95a1b307fe12424ee";
// const authToken = "56f827781ecad16ac920f4c01861a679";
// const client = require("twilio")(accountSid, authToken);
// // const client = require("twilio")

// // exports.sendsms = async (ctx,res,req) => {
// router.get("/sendsms", async (res, req) => {
//   try {
//     client.messages
//       .create({
//         body: "12282",
//         from: "+12056512413", // from bong saing
//         to: "+855314004102",
//       })
//       .then((message) => {
//         console.log(message.sid);
//       })

//       .done();
//     console.log("message done");

//     //     ctx.status = 200;
//     //     ctx.body = { message: SUCCE : Sent to ${ctx.request.body.phonenumber} };
//     //     return;
//     //   } catch (e) {
//     //     ctx.status = 200;
//     //     ctx.body = { message: ERROR ${e.message} };
//     //     return;
//   } catch {
//     console.log("error");
//   }
// });

// module.exports = router;

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const myPhone = process.env.TWILIO_PHONE_NUMBER;

const client = require("twilio")(accountSid, authToken);

const sendSMS = async (message, to) => {
  try {
    client.messages
      .create({
        body: message,
        from: myPhone,
        to: to,
      })
      .then((message) => {
        console.log(message.sid);
      })
      .done();
    console.log("done");
  } catch (error) {
    console.log("eror");
  }
};

module.exports = { sendSMS };
