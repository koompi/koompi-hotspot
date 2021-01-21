const router = require("express").Router();
const pool = require("../../db");

router.put("/complete-inf", async (req, res) => {
  try {
    //1. destructure the req.body (full_name,gender , email, password,bithdate,address)

    const { name, gender, email, birthdate, address } = req.body;

    //2. check if user exist (if user exist then throw error)

    const user = await pool.query(
      "SELECT * FROM users_email WHERE email = $1",
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Account isn't exist yet!" });
    }
    const activate = await user.rows[0].activate;

    if (!activate) {
      return res
        .status(401)
        .json({ message: "Please active your acount first!" });
    } else {
      await pool.query(
        "UPDATE users_email SET name=$1, gender=$2, birthdate=$3, address=$4  WHERE email=$5 AND activate = true",
        [name, gender, birthdate, address, email]
      );
      res.status(200).json({ message: "Completed Information." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.put("/complete-info", async (req, res) => {
  try {
    //1. destructure the req.body (full_name,gender , email, password,bithdate,address)

    const { name, gender, phone, email, birthdate, address } = req.body;

    //2. check if user exist (if user exist then throw error)

    const user = await pool.query(
      "SELECT * FROM useraccount WHERE phone = $1",
      [phone]
    );
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Account isn't exist yet!" });
    }
    const activate = await user.rows[0].activate;

    if (!activate) {
      return res
        .status(401)
        .json({ message: "Please activate your account first!" });
    } else {
      await pool.query(
        "UPDATE useraccount SET fullname=$1, gender=$2, birthdate=$3, address=$4, email=$5  WHERE phone=$6 AND activate = true",
        [name, gender, birthdate, address, email, phone]
      );
      // console.log(user.rows[0].id);
      res.status(200).json({ message: "Completed Information." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});
module.exports = router;
