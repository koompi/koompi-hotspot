const moment = require("moment");
const pool = require("../../../db");


const statusPlan = async () => {
  try {
    const now = moment().format("YYYY MMM DD");
    const result = await pool.query(
      "SELECT * FROM  radgroupcheck WHERE attribute = 'Expiration' and  Date(value) <= $1",
      [now]
    );
    
    let n = result.rows.length;
    if (n > 0) {
      for (i = 0; i < n; i++) {
        const checkExpired = await pool.query("SELECT * FROM radcheck WHERE acc_id = $1", [result.rows[i].acc_id]);

        // console.log(result.rows[i].acc_id);
        // console.log(checkExpired.rows[0].status);
        if(checkExpired.rows[0].status === true){
          console.log("This is True")
          console.log(result.rows[i].acc_id);
          await pool.query(
            "UPDATE radcheck SET status = false WHERE acc_id = $1",
            [result.rows[i].acc_id]
          );
        }
        else{
          console.log("This is False")
          console.log(result.rows[i].acc_id);
          await pool.query(
            "UPDATE radcheck SET status = false WHERE acc_id = $1",
            [result.rows[i].acc_id]
          );
        }
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = { statusPlan };
