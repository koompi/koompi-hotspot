const moment = require("moment");
var cron = require("node-cron");
const pool = require("../../../db");
const statusPlan = async () => {
  try {
    const now = moment().format("YYYY MMM DD");
    const result = await pool.query(
      "SELECT * FROM  radgroupcheck WHERE attribute = 'Expiration' and value <= $1",
      [now]
    );

    let n = result.rows.length;
    if (n > 0) {
      for (i = 0; i < n; i++) {
        await pool.query(
          "UPDATE radcheck SET status = false WHERE acc_id = $1",
          [result.rows[i].acc_id]
        );
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = { statusPlan };
