const moment = require("moment");
const pool = require("../../../db");

const autoRenew = async () => {
  try {
    const now = moment().format("YYYY MMM DD");
    const result = await pool.query(
      "SELECT * FROM  radcheck WHERE status = false and auto = false"
    );

    let n = result.rows.length;
    if (n > 0) {
      // for (i = 0; i < n; i++) {
      //   await pool.query(
      //     "UPDATE radcheck SET status = false WHERE acc_id = $1",
      //     [result.rows[i].acc_id]
      //   );
      // }
    }
  } catch (error) {
    console.log("error", error);
  }
};

autoRenew();
// module.exports = { autoRenew };
