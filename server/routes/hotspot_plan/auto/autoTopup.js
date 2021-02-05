const moment = require("moment");
const pool = require("../../../db");

const aday_left = async () => {
  const now = moment().format("YYYY MMM DD");
  const lst_of_user_expire = await pool.query(
    "SELECT * FROM  radgroupcheck WHERE attribute = 'Expiration' and value >= $1",
    [now]
  );
  if (lst_of_user_expire.rowCount !== 0) {
    let n = lst_of_user_expire.rowCount;
    let i = 0;
    while (i < n) {
      console.log(lst_of_user_expire.rows[i]);
      i++;
    }
  }
  // console.log(now);
};

console.log(aday_left());

// var cron = require("node-cron");

// cron.schedule('0 0 * * *', () => {
//   console.log('running a task every day');
// });
