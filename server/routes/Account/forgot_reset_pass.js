const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const validInfo = require("../../middleware/validInfo");
const sesClient = require("../Account/aws/aws_ses_client");

//         FORGOT PASSWORD
router.post("/forgot-password", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body
    const { email } = req.body;

    //2. check if user doesn't exist(if not then throw error)
    const account = await pool.query(
      "SELECT * FROM users_email WHERE email = $1",
      [email]
    );
    if (account.rows.length === 0) {
      return res.status(401).send("Account was not exist");
    }

    //3. random code to send via email
    var code = Math.floor(Math.random() * 1000000 + 1);
    const html = `Hi there,
      <br/>
      Reset your password account hotspot!
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

    //5. update this code inside our database
    await pool.query("UPDATE users_email SET code = $1 WHERE email = $2", [
      code,
      email,
    ]);
    res.send("Please check your E-mail!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//         CONFIRM CODE FROM EMAIL
router.post("/confirm-forgot-code", async (req, res) => {
  try {
    const { email, vCode } = req.body;

    const rCode = await pool.query(
      "SELECT code FROM users_email WHERE email =$1",
      [email]
    );
    if (rCode.rows[0].code === vCode) {
      res.send("Correct Code.");
    } else res.send("Incorrect Code!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//         RESET PASSWORD
router.put("/reset-password", async (req, res) => {
  try {
    const { email, new_password } = req.body;

    // bcrypt the account password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(new_password, salt);
    // update into database
    await pool.query("UPDATE users_email SET password = $1 WHERE email = $2", [
      bcryptPassword,
      email,
    ]);

    res.send("Reset password successfully.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
