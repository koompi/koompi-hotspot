const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");

router.put("/account", async (req, res) => {
  try {
    const { email, old_password, new_password } = req.body;
    const user = await pool.query(
      "SELECT * FROM users_email WHERE email = $1",
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(401).json("Incorrect E-mail!");
    }

    // compare password
    const validPassword = await bcrypt.compare(
      old_password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json("Incorect Password!");
    }

    // bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(new_password, salt);
    // update into database
    const newPass = await pool.query(
      "UPDATE users_email SET password = $1 WHERE email = $2",
      [bcryptPassword, email]
    );

    res.send("Reset password successfully.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
