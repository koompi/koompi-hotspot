const router = require("express").Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    // req.user has the payload
    // res.json(req.user); user

    const user = await pool.query(
      "SELECT * FROM users_email WHERE id = $1 AND activate = true",
      [req.user]
    );
    if (user.rows.length === 0) {
      return res.status(401).json("Please active your acount first!");
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
