const moment = require("moment");
const pool = require("../../../db");
const statusPlan = async () => {
  try {
    const now = moment().format("YYYY MMM DD");
    const result = await pool.query(
      "SELECT * FROM  radgroupcheck WHERE attribute = 'Expiration' and  Date(value) <= $1",
      [now]
    );

    const playerId = await pool.query("SELECT * FROM useraccount WHERE id = $1", [result.rows[0].acc_id]);

    // OneSignal Message
    let expiredPlanMessage = { 
      app_id: process.env.API_ID_ONESIGNAL,
      headings: {"en": "Auto Renew Fi-Fi Plan" + " " + amnt + " " + "days"},
      contents: {"en": amount + " " + asset + " " + "has been paid from your wallet"},
      include_player_ids: [playerId.rows[0].player_id]
    };
    
    let n = result.rows.length;
    if (n > 0) {
      for (i = 0; i < n; i++) {
        await pool.query(
          "UPDATE radcheck SET status = false WHERE acc_id = $1",
          [result.rows[i].acc_id]
        );
        sendNotification(expiredPlanMessage);
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = { statusPlan };
