const router = require("express").Router();
const pool = require("../../db");
const moment = require("moment");
const dateFormat = require("dateformat");

// Create Account User

router.post("/", async (req, res) => {
  try {
    //1. destructure the req.body(username,password)
    // for attributeMD5 & op it is default from database
    const { username, password, simultaneous, value } = req.body;

    const attributeSim = "Simultaneous-Use";
    const attribute = ["Access-Period", "Expiration"];
    const optionAccess_Period = [
      "Access-Period-1h",
      "Access-Period-6h",
      "Access-Period-12h",
      "Access-Period-24h"
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

    // if username isn't exist
    const acc = await pool.query("select * from radcheck where username=$1", [
      username
    ]);
    const pass = await pool.query(
      "select value from radcheck where username=$1",
      [username]
    );
    if (acc.rows.length === 0) {
      return res.status(401).send("Account isn't exist");
    }
    // 2. update password in table radcheck
    const updatePass = await pool.query(
      "update radcheck set value=MD5($2) where username=$1",
      [username, password]
    );

    // //  insert into table RAD_GROUP_CHECK
    const sim_Name = attributeSim + "_" + username + "_" + sim;
    // const rad = await pool.query(
    //   "update radgroupcheck set groupname = $2 , value = $3 WHERE  groupname=$1",
    //   [username, sim_Name, sim]
    // );

    var exp_or_period_Name;

    if (attri === attribute[1]) {
      exp_or_period_Name = attri + "_" + username + "_" + optName;

      //   Format Date
      var due = moment()
        .add(val, "days")
        .format("YYYY MMM DD");

      // const rad = await pool.query(
      //   "update radgroupcheck set groupname=$2 where username=$1",
      //   [exp_or_period_Name, attri, op, due]
      // );
    } else {
      exp_or_period_Name = optName + "_" + username;
    }

    // //  insert into table RAD_USER_GROUP

    // const ex = "`" + attributeSim + "_" + username + "_%`";
    // const simul = await pool.query(
    //   "update radusergroup set groupname=$2 where groupname like $1 returning id ",
    //   [ex, sim_Name]
    // );
    // // search simulat
    // const per_Or_exp = await pool.query(
    //   "update radusergroup set groupname=$2 where username =$1",
    //   [username, exp_or_period_Name]
    // );
    // console.log(simul);
    // const simul = await pool.query(
    //   " update radusergroup set groupname = 'Hello world' where groupname like'Simultaneous-Use_vuthy_3' returning id"
    // );
    res.send(pass.rows[0].value);
    // res.send("Update password");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
