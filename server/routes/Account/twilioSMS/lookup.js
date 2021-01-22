require("dotenv").config();
const router = require("express").Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// const LookupsClient = require("twilio").LookupsClient;
const client = require("twilio")(accountSid, authToken);

router.get("/testing", async (req, res) => {
  try {
    client.lookups
      .phoneNumbers("+85598939699")
      .fetch({ countryCode: "KH" })
      .then((phone_number) => res.send(phone_number.toJSON));
    // .then(async (phone_number) => {
    //   if (phone_number === undefined) {
    //     console.log(phone_number);
    //     return await res.status(401).send("incorrect number");
    //   }
    // if (error) {
    //   return res.send("error");
    // }
    //   res.send("ok");
    // });

    //   client.phoneNumbers("+15108675309").get(
    //     {
    //       type: "carrier",
    //     },
    //     (error, number) => {
    //       // If carrier.type is 'mobile' then the number can receive SMS
    //       console.log(number.carrier.type);
    //       console.log(number.carrier.name);
    //     }
    //   );
    // res.send("this is true");
  } catch (error) {
    console.error(error.message);
    res.send("this is not true");
    //   res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
