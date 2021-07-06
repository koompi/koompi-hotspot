const router = require("express").Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

router.get("/dashboard", authorization, async (req, res) => {
  try {
    const allregister = await pool.query("SELECT count(*) FROM useraccount");
    const allbuyplan = await pool.query("SELECT count(*) FROM radcheck");
    const activelogin = await pool.query(
      "SELECT count(*) FROM radacct WHERE calledstationid ='saang-school' OR calledstationid ='sanng-school' AND acctterminatecause IS NULL"
    );
    const alladmins = await pool.query(
      "SELECT count(*) FROM admins"
    );

    res.status(200).json({
      users_resgistered: allregister.rows[0].count,
      users_bought_plan: allbuyplan.rows[0].count,
      users_activate_login: activelogin.rows[0].count,
      user_admins: alladmins.rows[0].count
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});



module.exports = router;
