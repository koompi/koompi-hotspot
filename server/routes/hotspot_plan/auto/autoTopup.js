const axios = require("axios");
const moment = require("moment");
const pool = require("../../../db");
const Payment = require("../../../utils/payment");

// require("dotenv").config({ path: `../../../.env` });

const autoRenew = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM  radcheck WHERE status = false and auto = true"
    );

    let n = result.rows.length;
    if (n > 0) {
      for (i = 0; i < n; i++) {
        const info = await pool.query(
          "SELECT * FROM  radgroupcheck WHERE attribute = 'Expiration' and acc_id = $1",
          [result.rows[i].acc_id]
        );

        let str = info.rows[i].groupname;
        let plan = str.slice(str.lastIndexOf("Ex_") + 3, str.lastIndexOf("_"));
        const value = parseInt(plan, 10);

        /////////// check balance with payment /////////////////////////
        const paid = await Payment.payment(
          result.rows[i].acc_id,
          "SEL",
          value,
          "Renew plan."
        );

        if (paid[0] === 200) {
          const due = moment()
            .add(value, "days")
            .format("YYYY MMM DD");

          await pool.query(
            "UPDATE radgroupcheck SET value = $1 WHERE attribute = 'Expiration' AND acc_id = $2",
            [due, result.rows[i].acc_id]
          );
          await pool.query(
            "UPDATE radcheck SET status = true WHERE acc_id = $1",
            [result.rows[i].acc_id]
          );

          // this is for update status on database
        }
      }
    }
  } catch (error) {
    console.log("error on auto topup", error);
  }
};

// autoRenew();
module.exports = { autoRenew };
