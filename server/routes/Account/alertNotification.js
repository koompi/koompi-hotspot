const router = require("express").Router();
const axios = require("axios");
const pool = require("../../db");
require("dotenv").config();
const authorization = require("../../middleware/authorization");
const OneSignal = require('onesignal-node');    


// create a new Client for a single app
var myClient = new OneSignal.Client({
    userAuthKey: `${process.env.API_USER_AUTH_KEY_ONESIGNAL}`,
    // note that "app" must have "appAuthKey" and "appId" keys
    app: { appAuthKey: `${process.env.API_KEY_ONESIGNAL}`, appId: `${process.env.API_ID_ONESIGNAL}` }
});

router.post("/alert-notification", authorization, async (req, res) => {
    try {
        const { turnNotication } = req.body;
        const addPlayerId = await pool.query(
            "SELECT * FROM alertnotification"
        );
  
        if (turnNotication == true) {
            OneSignal.push(function() {
                OneSignal.getExternalUserId().then(function(externalUserId){
                  console.log("externalUserId: ", externalUserId);
                });
              });
            // OneSignal.isPushNotificationsEnabled(function(isEnabled) {
            //     if (isEnabled) {
            //         // user has subscribed
            //         OneSignal.getUserId( function(userId) {
            //             console.log('player_id of the subscribed user is : ' + userId);
            //             // Make a POST call to your server with the user ID        
            //         });
            //     }
            //   });
            // if(addPlayerId.rows[0] == null){
            //     pool.query(
            //         "INSERT INTO alertnotification ( user_id, player_id, turn_notification) VALUES($1,$2,$3)",
            //         [req.user, "", ""]
            //     );
            // }
        } else {
            pool.query(
                "INSERT INTO alertnotification ( user_id, player_id, turn_notification) VALUES($1,$2,$3)",
                [req.user, "", ""]
            );
        }
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error!" });
    }
});

module.exports = router;