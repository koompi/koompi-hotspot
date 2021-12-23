const router = require("express").Router();
const pool = require("../../db");
const moment = require("moment");
const bcrypt = require("bcrypt");

const authorization = require("../../middleware/authorization");
const validHotspot = require("../../middleware/valid_hot_planInfo");

// const confirmPass = require("../intergrate_Selendra/payment");
const Payment = require("../../utils/payment");

// Create Account User

router.post("/set-plan", authorization, validHotspot, async (req, res) => {
  try {
    //1. destructure the req.body(username,password)
    // for attributeMD5 & op it is default from database
    const { phone, password, simultaneous, value, asset, memo } = req.body; // value : 30 , 365  // username=phone number example 098939699
    const op = ":=";
    const attributeMD5 = "MD5-Password";
    const priority = "1";
    const attributeSim = "Simultaneous-Use";
    const attributeExp = "Expiration";

    let username = phone.slice(4, phone.length);
    username = "0" + username;

    var val = parseFloat(value, 10);
    var sim = parseFloat(simultaneous, 10);

    //   //  ======---===== For Expiration amount of day =====---======
    if (val !== 30 && val !== 365) {
      return res.status(400).json({ message: "Please choose!" });
    }

    const setPlanAlready = await pool.query(
      "select * from radcheck WHERE acc_id = $1",
      [req.user]
    );
    if (setPlanAlready.rows.length !== 0) {
      return res.status(400).json({ message: "You had already set plan!" });
    }

    // ////            check password
    const confirm = await Payment.confirm_pass(req, password);
    if (!confirm) {
      return res.status(401).json({ message: "Incorrect Password!" });
    }

    ///////////// check balance with payment /////////////////////////
    const paid = await Payment.payment(req, asset, value, memo);

    if (paid[0] === 200) {
      // 2. enter the user inside database
      await pool.query(
        "insert into radcheck( username, attribute, op, value, acc_id, status, auto) VALUES($1, $2, $3, MD5($4), $5, $6, $7)",
        [username, attributeMD5, op, password, req.user, 1, 1]
      );

      //  insert into table RAD_GROUP_CHECK

      //  Example Group Name: Sim_2_Ex_30_098939699
      const groupname = "Sim_" + simultaneous + "_Ex_" + value + "_" + username;

      await pool.query(
        "insert into radgroupcheck(groupname, attribute, op, value, acc_id) VALUES($1, $2, $3, $4,$5)",
        [groupname, attributeSim, op, sim, req.user]
      );
      //   Format Date
      var due = moment()
        .add(val, "days")
        .format("YYYY MMM DD");
      await pool.query(
        "insert into radgroupcheck(groupname, attribute, op, value, acc_id) VALUES($1, $2, $3, $4, $5)",
        [groupname, attributeExp, op, due, req.user]
      );

      //  insert into table RAD_USER_GROUP

      await pool.query(
        "insert into radusergroup(username, groupname, priority,acc_id) VALUES($1, $2, $3, $4)",
        [username, groupname, priority, req.user]
      );

      res.status(200).json({ message: "Set plan successfully." });
    } else {
      res.status(paid[0]).json({ message: paid[1] });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.put("/change-plan", authorization, async (req, res) => {
  try {
    //1. destructure the req.body(username,password)
    // for attributeMD5 & op it is default from database
    const { password, value } = req.body; // value : 30 , 365  // username=phone number example 098939699

    ////            check password
    const confirm = await Payment.confirm_pass(req, password);
    if (!confirm) {
      return res.status(401).json({ message: "Incorrect Password!" });
    }

    var val = parseFloat(value, 10);

    //  ======---===== For Expiration amount of day =====---======
    if (val !== 30 && val !== 365) {
      return res.status(400).json({ message: "Please choose!" });
    }

    const user = await pool.query(
      "SELECT username FROM  radcheck WHERE  acc_id = $1",
      [req.user]
    );
    const info = await pool.query(
      "SELECT * FROM  radgroupcheck WHERE attribute = 'Expiration' and acc_id = $1",
      [req.user]
    );

    let groupnameOld = info.rows[0].groupname;
    let gname = groupnameOld.lastIndexOf("Ex_");
    let groupnameNew = groupnameOld.substr(0, gname + 3);
    groupnameNew = groupnameNew + value + "_" + user.rows[0].username;

    ///////////////// check balance with payment /////////////////////////
    const paid = await Payment.payment(req, "SEL", val, `Changed Subscribe Fi-Fi Plan To ${value} Days`);

    if (paid[0] === 200) {
      const due = moment()
        .add(val, "days")
        .format("YYYY MMM DD");

      await pool.query(
        "UPDATE radgroupcheck SET value = $1,groupname = $2 WHERE attribute = 'Expiration' AND acc_id = $3",
        [due, groupnameNew, req.user]
      );
      await pool.query(
        "UPDATE radgroupcheck SET groupname = $1 WHERE attribute = 'Simultaneous-Use' AND acc_id = $2",
        [groupnameNew, req.user]
      );
      await pool.query(
        "UPDATE radusergroup SET groupname = $1 WHERE acc_id = $2",
        [groupnameNew, req.user]
      );
      await pool.query("UPDATE radcheck SET status = true WHERE acc_id = $1", [
        req.user
      ]);
      res.status(200).json({ message: "Change plan done" });
      console.log(`User ${req.user} change plan to ${value} `);
    } else {
      res.status(paid[0]).json({ message: paid[1] });
    }
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.put("/delete-plan", authorization, async (req, res) => {
  try {
    const { password } = req.body;

    // // if username isn't exist
    const user = await pool.query("select * from radcheck where acc_id = $1", [
      req.user
    ]);
    const username = user.rows[0].username;

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Account isn't exist!" });
    }

    ////            check password
    const confirm = await Payment.confirm_pass(req, password);
    if (!confirm) {
      return res.status(401).json({ message: "Incorrect Password!" });
    } else {
      // delete all histories form radacc, radgroupcheck, radusergroup
      await pool.query("DELETE FROM radcheck where acc_id = $1", [req.user]);
      await pool.query("DELETE FROM radacct WHERE username = $1", [username]);
      await pool.query("DELETE FROM radusergroup WHERE acc_id = $1", [
        req.user
      ]);
      await pool.query("DELETE FROM radgroupcheck WHERE acc_id = $2", [
        req.user
      ]);

      res.status(200).json({ message: "Cancel plan done." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.get("/get-plan", authorization, async (req, res) => {
  try {
    const user = await pool.query("select * from radcheck WHERE acc_id = $1", [
      req.user
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Username is not exist!" });
    }
    const sim = await pool.query(
      "select * from radgroupcheck WHERE attribute = 'Simultaneous-Use' AND acc_id = $1",
      [req.user]
    );
    const detail = await pool.query(
      "select * from radgroupcheck WHERE attribute = 'Expiration' AND acc_id = $1",
      [req.user]
    );
    if (detail.rows.length === 0) {
      return res.status(401).json({ message: "No plan!" });
    }

    let str = detail.rows[0].groupname;
    let plan = str.slice(str.lastIndexOf("Ex_") + 3, str.lastIndexOf("_"));

    let balance = parseFloat(plan, 10);
    if (balance === 30) {
      balance = "50";
    }
    if (balance === 365) {
      balance = "500";
    }

    res.status(200).json({
      username: user.rows[0].username,
      balance: Number.parseFloat(balance).toFixed(3),
      device: sim.rows[0].value,
      plan: plan,
      time_left: detail.rows[0].value,
      status: user.rows[0].status,
      automatically: user.rows[0].auto
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

module.exports = router;
