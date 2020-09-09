const router = require("express").Router();
const pool = require("../../db");
// const authorization = require("../../middleware/authorization");

router.put("/complete-info", async (req, res) => {
  try {
    //1. destructure the req.body (full_name,gender , email, password,bithdate,address)

    const { name, gender, email, birthdate, address } = req.body;

    //2. check if user exist (if user exist then throw error)

    const user = await pool.query(
      "SELECT * FROM users_email WHERE email = $1",
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(401).send("Account isn't exist yet!");
    }
    const activate = await user.rows[0].activate;

    if (!activate) {
      return res.status(401).json("Please active your acount first!");
    } else {
      const updateAcc = await pool.query(
        "UPDATE users_email SET name=$1, gender=$2, birthdate=$3, address=$4  WHERE email=$5 AND activate = true",
        [name, gender, birthdate, address, email]
      );
      res.send("Completed Info.");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error!");
  }
});
module.exports = router;
