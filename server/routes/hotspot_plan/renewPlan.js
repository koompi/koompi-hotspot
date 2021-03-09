const router = require("express").Router();
const moment = require("moment");
const pool = require("../../db");
const Payment = require("../../utils/payment");
const authorization = require("../../middleware/authorization");

router.put("/renew", authorization, async (req, res) => {
  try {
    const { password } = req.body;

    const info = await pool.query(
      "SELECT * FROM  radgroupcheck WHERE attribute = 'Expiration' and acc_id = $1",
      [req.user]
    );

    let deadline = info.rows[0].value;
    let mydate = moment(deadline, "YYYY-MM-DD").toDate();
    const checkDate = moment().isAfter(mydate);

    if (!checkDate) {
      return res.status(200).json({ message: "Your plan doesn't expire yet." });
    }

    let str = info.rows[0].groupname;
    let plan = str.slice(str.lastIndexOf("Ex_") + 3, str.lastIndexOf("_"));
    const value = parseInt(plan, 10);

    ////            check password
    const confirm = await Payment.confirm_pass(req, password);
    if (!confirm) {
      return res.status(401).json({ message: "Incorrect Password!" });
    }

    ///////////// check balance with payment /////////////////////////

    const paid = await Payment.payment(req, "SEL", value, "Renew plan.");
    if (paid[0] === 200) {
      const due = moment()
        .add(value, "days")
        .format("YYYY MMM DD");

      await pool.query(
        "UPDATE radgroupcheck SET value = $1 WHERE attribute = 'Expiration' and acc_id = $2",
        [due, req.user]
      );
      await pool.query("UPDATE radcheck SET status = true WHERE acc_id = $1", [
        req.user
      ]);
      res.status(paid[0]).json({ message: paid[1] });
      console.log(`user ${req.user} renew their plan`);
    } else {
      res.status(paid[0]).json({ message: paid[1] });
    }
  } catch (err) {
    console.log("error on renew plan", err);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.put("/auto", authorization, async (req, res) => {
  try {
    const { automatically } = req.body;

    await pool.query("UPDATE radcheck SET auto = $1 WHERE acc_id = $2", [
      automatically,
      req.user
    ]);

    res.status(200).json({ message: "Done" });
  } catch (err) {
    console.log("error on renew plan", err);
    res.status(500).json({ message: "Server Error!" });
  }
});
module.exports = router;
