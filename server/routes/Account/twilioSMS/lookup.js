const pool = require("../../../db.js");
require("dotenv").config();
const router = require("express").Router();
const auth = require("../../../middleware/authorization");

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const LookupsClient = require("twilio").LookupsClient;
// const client = require("twilio")(accountSid, authToken);

// router.get("/testing", async (req, res) => {
//   try {
//     client.lookups
//       .phoneNumbers("+85598939699")
//       .fetch({ countryCode: "KH" })
//       .then((phone_number) => console.log(phone_number));
//     //   client.phoneNumbers("+15108675309").get(
//     //     {
//     //       type: "carrier",
//     //     },
//     //     (error, number) => {
//     //       // If carrier.type is 'mobile' then the number can receive SMS
//     //       console.log(number.carrier.type);
//     //       console.log(number.carrier.name);
//     //     }
//     //   );
//     // res.send("this is true");
//   } catch (error) {
//     console.error(error.message);
//     res.send("this is not true");
//     //   res.status(500).json({ message: "Server Error" });
//   }
// });

router.get("/testing", auth, async (req, res) => {
  const discount = await checkDiscount(req);
  var amount = 0;
  var amnt = 60;
  if (discount[1] !== 0) {
    amount = (amnt * discount[1]) / 100;
  } else {
    amount = 0;
  }

  res.send({ amnt: amnt, discount: amount, remainValue: `${amnt - amount}` });
});

const checkDiscount = async req => {
  try {
    const a = await pool.query("SELECT role  FROM useraccount where id=$1", [
      req.user
    ]);
    if (a.rows[0].role === "Teacher") {
      var b = await pool.query(
        "select d.*,s.* from discount_teachers as d INNER JOIN setdiscount as s ON (d.acc_id=$1 AND d.approved IS TRUE AND s.role = 'Teacher')",
        [req.user]
      );
      if (b.rowCount === 0) {
        return ["teacher", 0];
      }
      return ["teacher", b.rows[0].discount];
    } else if (a.rows[0].role === "Normal") {
      const c = await pool.query(
        "SELECT *  FROM setdiscount where role='Normal'"
      );
      if (b.rowCount === 0) {
        return ["normal", 0];
      }
      return ["normal", c.rows[0].discount];
    } else return ["null", 0];
  } catch (error) {
    console.log("Error on method checkDiscount on payment.js", error);
    return ["error function", 0];
  }
};
module.exports = router;
