const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const { jwtGeneratorAdmin } = require("../../utils/jwtGenerator");
const authorization = require("../../middleware/authorization");

router.get("/dashboard",authorization, async (req, res) => {
  try {
    const allregister = await pool.query("SELECT count(*) FROM useraccount");
    const allbuyplan = await pool.query("SELECT count(*) FROM radcheck");
    // const activelogin = await pool.query("SELECT count(*) FROM useraccount");

    res.status(200).json({ user: allbuyplan });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});
module.exports = router;
