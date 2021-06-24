const router = require("express").Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

router.get("/dashboard", authorization, async (req, res) => {
  try {
    const allregister = await pool.query("SELECT count(*) FROM useraccount");
    const allbuyplan = await pool.query("SELECT count(*) FROM radcheck");
    const activelogin = await pool.query(
      "SELECT detail.id,detail.fullname, detail.phone, r.*, c.acc_id,c.calledstationid,c.acctterminatecause FROM  useraccount AS detail, radgroupcheck as r, radacct AS c WHERE detail.id::text=c.acc_id AND r.acc_id=c.acc_id AND  c.calledstationid ='sanng-school' OR c.calledstationid ='saang-school' AND c.acctterminatecause IS NULL"
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
