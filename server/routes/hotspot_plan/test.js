const router = require("express").Router();
const pool = require("../../db");
const moment = require("moment");
const dateFormat = require("dateformat");

router.post("/", async (req, res) => {
  try {
    const value = await pool.query(
      "select groupname from radusergroup where username like 'dara'"
    );
    if (value.rowCount > 2 || value.rowCount < 1) {
      res.send("Unknown username!");
    }

    var sim = value.rows[0].groupname;
    var acc_exp = value.rows[1].groupname;

    // simulataneuos
    if (sim.indexOf("1") > -1) {
      sim = 1;
    }
    if (sim.indexOf("2") > -1) {
      sim = 2;
    }
    if (sim.indexOf("3") > -1) {
      sim = 3;
    }
    // access period
    if (acc_exp.indexOf("1") > -1) {
      acc_exp = 1;
    }
    if (acc_exp.indexOf("6") > -1) {
      acc_exp = 6;
    }
    if (acc_exp.indexOf("12") > -1) {
      acc_exp = 12;
    }
    if (acc_exp.indexOf("24") > -1) {
      acc_exp = 24;
    }

    // expiration
    if (acc_exp.indexOf("7") > -1) {
      acc_exp = 7;
    }
    if (acc_exp.indexOf("14") > -1) {
      acc_exp = 14;
    }
    if (acc_exp.indexOf("30") > -1) {
      acc_exp = 30;
    }
    const jsonFile = {
      username: username,
      password: pass,
      simultaneous: sim,
      value: acc_exp,
    };
    res.json(jsonFile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
