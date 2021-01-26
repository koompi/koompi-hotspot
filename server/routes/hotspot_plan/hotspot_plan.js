const router = require("express").Router();
const pool = require("../../db");
const moment = require("moment");
const bcrypt = require("bcrypt");

const authorization = require("../../middleware/authorization");
const validHotspot = require("../../middleware/valid_hot_planInfo");

const Payment = require("../intergrate_Selendra/payment");

// Create Account User

router.post("/set-plan", authorization, async (req, res) => {
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

    var val = parseInt(value, 10);
    var sim = parseInt(simultaneous, 10);
    var optName;

    //   //  ======---===== For Expiration amount of day =====---======
    if (val === 30) {
      optName = "30";
    } else if (val === 365) {
      optName = "365";
    } else {
      return res.status(401).json({ message: "Please choose!" });
    }

    const setPlanAlready = await pool.query(
      "select * from radcheck WHERE acc_id = $1",
      [req.user]
    );
    if (setPlanAlready.rows.length !== 0) {
      return res.status(401).json({ message: "You had already set plan!" });
    }

    ////            check password
    const pass = await pool.query("select * from useraccount WHERE id = $1", [
      req.user,
    ]);
    // compare password
    const validPassword = await bcrypt.compare(password, pass.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Incorect Password!" });
    }
    var paid = await Payment.payment(req, asset, value, memo);
    
    if (paid[0] === 200) {
      // 2. enter the user inside database
      await pool.query(
        "insert into radcheck(username, attribute,op,value,acc_id) VALUES($1,$2,$3,MD5($4),$5)",
        [username, attributeMD5, op, password, req.user]
      );

      //  insert into table RAD_GROUP_CHECK
      const sim_Name = attributeSim + "_" + username + "_" + sim;
      await pool.query(
        "insert into radgroupcheck(groupname, attribute, op, value) VALUES($1, $2, $3, $4)",
        [sim_Name, attributeSim, op, sim]
      );

      const exp_Name = attributeExp + "_" + username + "_" + optName;
      //   Format Date
      var due = moment().add(val, "days").format("YYYY MMM DD");
      await pool.query(
        "insert into radgroupcheck(groupname, attribute, op, value) VALUES($1, $2, $3, $4)",
        [exp_Name, attributeExp, op, due]
      );

      //  insert into table RAD_USER_GROUP
      await pool.query(
        "insert into radusergroup(username, groupname, priority) VALUES($1, $2, $3) RETURNING *",
        [username, sim_Name, priority]
      );

      await pool.query(
        "insert into radusergroup(username, groupname, priority) VALUES($1, $2, $3) RETURNING *",
        [username, exp_Name, priority]
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

router.put("/reset-plan", validHotspot, async (req, res) => {
  try {
    //1. destructure the req.body(username,password)
    // for attributeMD5 & op it is default from database
    const { username, simultaneous, value } = req.body;
    const op = ":=";
    const attributeMD5 = "MD5-Password";
    const priority = "1";
    const attributeSim = "Simultaneous-Use";
    const attributeExp = "Expiration";
    var val = parseInt(value, 10);
    var sim = parseInt(simultaneous, 10);
    var optName;

    //   //  ======---===== For Expiration amount of day =====---======
    if (val === 30) {
      optName = "30";
    } else if (val === 365) {
      optName = "365";
    } else {
      res.status(401).json({ message: "Please choose!" });
    }

    // // if username isn't exist
    const user = await pool.query("select * from radcheck where username=$1", [
      username,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Account isn't exist!" });
    }
    // delete all histories form radacc, radgroupcheck, radusergroup
    await pool.query("DELETE FROM radacct WHERE username = $1", [username]);
    await pool.query("DELETE FROM radusergroup WHERE username = $1", [
      username,
    ]);
    await pool.query(
      "DELETE FROM radgroupcheck WHERE groupname like '%' || $1 ||'%'",
      [username]
    );

    //  insert into table RAD_GROUP_CHECK
    const sim_Name = attributeSim + "_" + username + "_" + sim;
    await pool.query(
      "insert into radgroupcheck(groupname, attribute, op, value) VALUES($1, $2, $3, $4) RETURNING *",
      [sim_Name, attributeSim, op, sim]
    );

    exp_Name = attributeExp + "_" + username + "_" + optName;

    //   Format Date
    var due = moment().add(val, "days").format("YYYY MMM DD");
    await pool.query(
      "insert into radgroupcheck(groupname, attribute, op, value) VALUES($1, $2, $3, $4) RETURNING *",
      [exp_Name, attributeExp, op, due]
    );

    //  insert into table RAD_USER_GROUP
    await pool.query(
      "insert into radusergroup(username, groupname, priority) VALUES($1, $2, $3) RETURNING *",
      [username, sim_Name, priority]
    );

    await pool.query(
      "insert into radusergroup(username, groupname, priority) VALUES($1, $2, $3) RETURNING *",
      [username, exp_Name, priority]
    );

    res.status(200).json({ message: "Reset plan successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.post("/free-plan", authorization, async (req, res) => {
  try {
    const { phone, password, simultaneous, value } = req.body; // value : 30 , 365  // username=phone number example 098939699
    const op = ":=";
    const attributeMD5 = "MD5-Password";
    const priority = "1";
    const attributeSim = "Simultaneous-Use";
    const attributeExp = "Expiration";

    let username = phone.slice(2, phone.length);

    username = "0" + username;

    var val = parseInt(value, 10);
    var sim = parseInt(simultaneous, 10);
    var optName;

    //   //  ======---===== For Expiration amount of day =====---======
    if (val === 30) {
      optName = "30";
    } else if (val === 365) {
      optName = "365";
    } else {
      return res.status(401).json({ message: "Please choose!" });
    }
    // if username already exist
    const user = await pool.query(
      "select * from radcheck WHERE username = $1",
      [username]
    );
    if (user.rows.length !== 0) {
      return res.status(401).json({ message: "Account already exist!" });
    }

    const setPlanAlready = await pool.query(
      "select * from radcheck WHERE acc_id = $1",
      [req.user]
    );
    if (setPlanAlready.rows.length !== 0) {
      return res.status(401).json({ message: "You already set plan!" });
    }

    const pass = await pool.query("select * from useraccount WHERE id = $1", [
      req.user,
    ]);

    // compare password
    const validPassword = await bcrypt.compare(password, pass.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Incorect Password!" });
    }

    res.status(401).json({ message: "successfull" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.get("/get-plan", authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "select username from radcheck WHERE acc_id = $1",
      [req.user]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Username is not exist!" });
    }
    const detail = await pool.query(
      "select * from radusergroup WHERE username = $1",
      [user.rows[0].username]
    );

    if (detail.rows.length === 0) {
      return res.status(401).json({ message: "No plan!" });
    }

    let a = detail.rows[0].groupname;
    let b = detail.rows[1].groupname;
    let n1 = a.lastIndexOf("_");
    let n2 = b.lastIndexOf("_");

    let bal = b.slice(n2 + 1, b.length);
    let balance = parseInt(bal, 10);
    if (balance === 30) {
      balance = "50";
    }
    if (balance === 365) {
      balance = "365";
    }
    res.status(200).json({
      username: user.rows[0].username,
      balance: balance,
      device: a.slice(n1 + 1, a.length),
      plan: b.slice(n2 + 1, b.length),
      time_left: detail.rows[1].value,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

module.exports = router;
