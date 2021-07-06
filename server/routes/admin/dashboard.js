const router = require("express").Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    // req.user has the payload
    // res.json(req.user); user

    const user = await pool.query(
      "SELECT email,fullname,image FROM useraccount WHERE id = $1 AND ban = false",
      [req.user]
    );
    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Your account has been banned!" });
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/dashboard", authorization, async (req, res) => {
  try {
    const allregister = await pool.query("SELECT count(*) FROM useraccount");
    const allbuyplan = await pool.query("SELECT count(*) FROM radcheck");
    const activelogin = await pool.query(
      "SELECT useraccount.id, useraccount.fullname, COUNT(radacct.acc_id) AS Total FROM useraccount JOIN radacct ON useraccount.id::text = radacct.acc_id and radacct.calledstationid ='sanng-school' and radacct.acctterminatecause IS NULL GROUP BY useraccount.id;"
    );
    
    const alladmins = await pool.query(
      "SELECT count(*) FROM admins"
    );

    res.status(200).json({
      users_resgistered: allregister.rows[0].count,
      users_bought_plan: allbuyplan.rows[0].count,
      users_activate_login: activelogin.rows.length,
      user_admins: alladmins.rows[0].count
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});



module.exports = router;
