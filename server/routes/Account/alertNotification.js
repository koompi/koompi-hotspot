const router = require("express").Router();
const axios = require("axios");
const pool = require("../../db");
require("dotenv").config();
const authorization = require("../../middleware/authorization");
const OneSignal = require('onesignal-node');    


router.put("/add-playerid", authorization, async (req, res) => {
    try {
      //1. destructure the req.body (full_name,gender , email, password,bithdate,address)
  
      const { player_id } = req.body;
  
      //2. check if user exist (if user exist then throw error)
  
      const user = await pool.query(
        "SELECT * FROM useraccount WHERE id = $1",
        [req.user]
      );
      if (user.rows.length === 0) {
        return res.status(401).json({ message: "Account isn't exist yet!" });
      }
      const activate = await user.rows[0].activate;
  
      if (!activate) {
        return res
          .status(401)
          .json({ message: "Please activate your account first!" });
      } else {
        await pool.query(
          "UPDATE useraccount SET player_id=$1 WHERE id=$2",
          [player_id, req.user]
        );
  
        res.status(200).json({ message: "Completed Information Player ID." });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Server Error!" });
    }
  });

module.exports = router;