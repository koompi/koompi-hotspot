const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const moment = require ("moment")
const { jwtGeneratorAdmin } = require("../../utils/jwtGenerator");
const validInfo = require("../../middleware/validInfo");
const authorization = require("./../../middleware/authorization");

const sesClient = require("../Account/aws/aws_ses_client");

// ---------------------- Admin -------------------------------

router.post("/login", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body
    const { email, password } = req.body;

    //2. check if user doesn't exist(if not then throw error)

    const user = await pool.query("SELECT * FROM useraccount WHERE email =$1", [
      email
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Incorrect E-mail!" });
    }

    const activate = await user.rows[0].activate;
    if (!activate) {
      return res
        .status(401)
        .json({ message: "Please active your acount first!" });
    }

    //3. check if incomming password is the same database password

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect Password!" });
    }

    //4. bcrypt the confirm code
    var min = 100000;
    var max = 999999;
    var code = Math.floor(Math.random() * (max - min + 1) + min);
    const html = `Hi there,
      <br/>
      Welcome to admin KOOMPI Fi-Fi.
      <br/><br/>
      Please verify your email by typing following code:
      <br/>
      <h3>Code: <b>${code}</b></h3>
      <br/>
      Have a pleasant day.
      <br/><br/>
      `;

    //4. call sesClient to send an email
    sesClient.sendEmail(email, "Account Verification", html);

    //5. enter the new user inside our database
    await pool.query("UPDATE useraccount SET code=$2 WHERE email=$1", [
      email,
      code
    ]); // 3. give them the jwt token
    const token = jwtGeneratorAdmin(user.rows[0].id);
    res.status(200).json({
      token
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.post("/retry", authorization, async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM useraccount WHERE id =$1", [
      req.user
    ]);

    const email = user.rows[0].email;
    //4. bcrypt the confirm code
    var min = 100000;
    var max = 999999;
    var code = Math.floor(Math.random() * (max - min + 1) + min);
    const html = `Hi there,
         <br/>
         Welcome to admin KOOMPI Fi-Fi.
         <br/><br/>
         Please verify your email by typing following code:
         <br/>
         <h3>Code: <b>${code}</b></h3>
         <br/>
         Have a pleasant day.
         <br/><br/>
         `;

    //4. call sesClient to send an email
    sesClient.sendEmail(email, "Account Verification", html);

    // //5. enter the new user inside our database
    await pool.query("UPDATE useraccount SET code=$2 WHERE id=$1", [
      req.user,
      code
    ]);
    // 3. give them the jwt token
    const token = jwtGeneratorAdmin(user.rows[0].id);
    res.status(200).json({
      token
    });
  } catch (error) {
    console.error("bug on adminAuth", error);
    res.status(500).json({ message: "Server Error!" });
  }
});
router.post("/confirm-admin", authorization, async (req, res) => {
  try {
    const { vCode } = req.body;

    const user = await pool.query("SELECT * FROM useraccount WHERE id =$1", [
      req.user
    ]);

    if (user.rows[0].code === vCode) {
      // 3. give them the jwt token
      const token = jwtGeneratorAdmin(user.rows[0].id);
      var now = moment();
      await pool.query("UPDATE admins SET last_login=$1 WHERE acc_id=$2",[now,req.user])
      res.json({
        token
      });
    } else res.status(401).json({ message: "Incorrect Code!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
