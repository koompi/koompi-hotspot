const router = require("express").Router();
const pool = require("../../db");
const moment = require("moment");
const dateFormat = require("dateformat");



router.put("/", async (req, res) => {
  try {
    //1. destructure the req.body(username,password)
    // for attributeMD5 & op it is default from database
    const { username, password, simultaneous, value } = req.body;
    const op = ":=";
    const attributeMD5 = "MD5-Password";
    const priority = "1";
    const attributeSim = "Simultaneous-Use";
    const attribute = ["Access-Period", "Expiration"];
    const optionAccess_Period = [
      "Access-Period-1h",
      "Access-Period-6h",
      "Access-Period-12h",
      "Access-Period-24h",
    ];
    var val = parseInt(value, 10);
    var sim = parseInt(simultaneous, 10);
    var attri;
    var optName;

    if (val === 1) {
      //   //  ======---===== For Access Period Hour =====---======
      attri = attribute[0];
      optName = optionAccess_Period[0];
    } else if (val === 6) {
      attri = attribute[0];
      optName = optionAccess_Period[1];
    } else if (val === 12) {
      attri = attribute[0];
      optName = optionAccess_Period[2];
    } else if (val === 24) {
      attri = attribute[0];
      optName = optionAccess_Period[3];
    } else if (val === 7) {
      //   //  ======---===== For Expiration amount of day =====---======
      attri = attribute[1];
      optName = "7days";
    } else if (val === 14) {
      attri = attribute[1];
      optName = "14days";
    } else if (val === 30) {
      attri = attribute[1];
      optName = "30days";
    } else {
      res.send("Please choose!");
    }

    // // if username isn't exist
    const acc = await pool.query("select * from radcheck where username=$1", [
      username,
    ]);
    if (acc.rows.length === 0) {
      return res.status(401).send("Account isn't exist");
    }
    // delete all histories form radacc, radgroupcheck, radusergroup
    const a = await pool.query("DELETE FROM radacct WHERE username = $1", [
      username,
    ]);
    const b = await pool.query("DELETE FROM radusergroup WHERE username = $1", [
      username,
    ]);
    const c = await pool.query(
      "DELETE FROM radgroupcheck WHERE groupname like '%' || $1 ||'%'",
      [username]
    );

    //  insert into table RAD_GROUP_CHECK
    const sim_Name = attributeSim + "_" + username + "_" + sim;
    const rad = await pool.query(
      "insert into radgroupcheck(groupname, attribute, op, value) VALUES($1, $2, $3, $4) RETURNING *",
      [sim_Name, attributeSim, op, sim]
    );

    var exp_or_period_Name;

    if (attri === attribute[1]) {
      exp_or_period_Name = attri + "_" + username + "_" + optName;

      //   Format Date
      var due = moment().add(val, "days").format("YYYY MMM DD");

      const rad = await pool.query(
        "insert into radgroupcheck(groupname, attribute, op, value) VALUES($1, $2, $3, $4) RETURNING *",
        [exp_or_period_Name, attri, op, due]
      );
    } else {
      exp_or_period_Name = optName + "_" + username;
    }

    //  insert into table RAD_USER_GROUP

    const raduser = await pool.query(
      "insert into radusergroup(username, groupname, priority) VALUES($1, $2, $3) RETURNING *",
      [username, sim_Name, priority]
    );

    const radusergroup = await pool.query(
      "insert into radusergroup(username, groupname, priority) VALUES($1, $2, $3) RETURNING *",
      [username, exp_or_period_Name, priority]
    );

    res.send("Reset plan successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
