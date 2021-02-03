const router = require("express").Router();
const pool = require("../../db");
const Payment = require("../../utils/payment");
const authorization = require("../../middleware/authorization");

router.put("/renew", authorization, async (req, res) => {
  try {
    res.status(200).json({ message: "Change successfull." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

module.exports = router;
