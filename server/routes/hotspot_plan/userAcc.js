const router = require("express").Router();
const pool = require("../../db");

// Create Account User

router.post("/", async (req, res) => {
  try {
    //1. destructure the req.body(username,password)
    // for attribute & op it is default from database
    const { username, password } = req.body;
    const attributeMD5 = "MD5-Password";
    const op = ":=";

    const acc = await pool.query("select * from radcheck where username=$1", [
      username
    ]);
    if (acc.rows.length !== 0) {
      return res.status(401).send("Account already exist");
    } else {
      res.send(await pool.query("select * from radgroupcheck"));
    }
    // 2. enter the user inside database

    const newAcc = await pool.query(
      "insert into radcheck(username, attribute,op,value) VALUES($1,$2,$3,$4) RETURNING *",
      [username, attributeMD5, op, password]
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
