const router = require("express").Router();
const moment = require("moment");
const pool = require("../../db");
const Payment = require("../../utils/payment");
const authorization = require("../../middleware/authorization");

router.put("/renew", authorization, async (req, res) => {
  try {
    const { password } = req.body;

    const detail = await pool.query(
      "SELECT * FROM  radgroupcheck WHERE attribute = 'Expiration' and acc_id = $1",
      [req.user]
    );

    let deadline = detail.rows[0].value;
    deadline;
    let mydate = moment(deadline, "YYYY-MM-DD").toDate();
    const check = moment().isAfter(mydate);

    if (check) {
      return res.status(200).json({ message: mydate });
    }

    let a = detail.rows[0].groupname;
    let val = a.lastIndexOf("_");
    let value = a.slice(val + 1, a.length);

    ////            check password
    const confirm = await Payment.confirm_pass(req, password);
    if (!confirm) {
      return res.status(401).json({ message: "Incorrect Password!" });
    }

    ///////////// check balance with payment /////////////////////////
    // const paid = await Payment.payment(req, "SEL", value, "Renew plan.");
    // if (paid[0] === 200) {
    const due = moment()
      .add(value, "days")
      .format("YYYY MMM DD");

    await pool.query("UPDATE radgroupcheck SET value = $1 WHERE acc_id = $2", [
      due,
      req.user
    ]);
    res.status(200).json({ message: due });
    // } else {
    //   res.status(paid[0]).json({ message: paid[1] });
    // }
  } catch (err) {
    console.log("error on renew plan", err);
    res.status(500).json({ message: "Server Error!" });
  }
});

module.exports = router;
