const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const authorization = require("../../middleware/authorization");

router.put("/account", authorization, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;

    const acc = await pool.query("SELECT * FROM users_email WHERE id = $1", [
      req.user,
    ]);
    if (acc.rows.length === 0) {
      return res.status(401).json({ message: "Incorrect E-mail!" });
    }

    // compare password
    const validPassword = await bcrypt.compare(
      old_password,
      acc.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Incorect Password!" });
    }

    // bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(new_password, salt);
    // update into database
    await pool.query("UPDATE users_email SET password = $1 WHERE id = $2", [
      bcryptPassword,
      req.user,
    ]);

    res.status(200).json({ message: "Change password successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
