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
    const attributeExp = "Simultaneous-Use";
    var val = parseInt(value, 10);
    var sim = parseInt(simultaneous, 10);
    var optName;

    //   //  ======---===== For Expiration amount of day =====---======
    if (val === 30) {
      optName = "30days";
    } else if (val === 365) {
      optName = "1year";
    } else {
      res.send("Please choose!");
    }

    // // if username isn't exist
    const user = await pool.query("select * from radcheck where username=$1", [
      username,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).send("Account isn't exist");
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
      [exp_Name, attri, op, due]
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

    res.send("Reset plan successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
