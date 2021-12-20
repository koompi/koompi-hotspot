const moment = require("moment");
const pool = require("../../../db");


// OneSignal Notification
var sendNotification = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": `Basic ${process.env.API_KEY_ONESIGNAL}`
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  var https = require('https');
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};


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
        const playerId = await pool.query("SELECT * FROM useraccount WHERE id = $1", [result.rows[i].acc_id]);

        let expiredPlanMessage = { 
          app_id: process.env.API_ID_ONESIGNAL,
          headings: {"en": "Fi-Fi plan expired"},
          contents: {"en": "Please renew your plan to continue using Fi-Fi"},
          include_player_ids: [playerId.rows[0].player_id]
        };

        // console.log(result.rows[i].acc_id);
        // console.log(checkExpired.rows[0].status);
        if(checkExpired.rows[0].status === true){
          console.log("This is True")
          console.log(result.rows[i].acc_id);
          await pool.query(
            "UPDATE radcheck SET status = false WHERE acc_id = $1",
            [result.rows[i].acc_id]
          );
          sendNotification(expiredPlanMessage);
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
