const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const validInfo = require("../../middleware/validInfo");
const sesClient = require("../Account/aws/aws_ses_client");
const twilio_sms_Client = require("../Account/twilioSMS/sendSMS");

///////////////////////////// Email //////////////////////////////////////////////

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
      return res.status(401).json({ message: "Account was not exist" });
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
    res.status(200).json({ message: "Please check your E-mail!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
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
      res.status(200).json({ message: "Correct Code." });
    } else res.status(401).json({ message: "Incorrect Code!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
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

    res.status(200).json({ message: "Reset password successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

////////////////////////////// Phone /////////////////////////////////////////////
router.post("/forgot-password-phone", async (req, res) => {
  try {
    //1. destructure the req.body
    const { phone } = req.body;

    //2. check if user doesn't exist(if not then throw error)
    const account = await pool.query(
      "SELECT * FROM useraccount WHERE phone = $1",
      [phone]
    );
    if (account.rows.length === 0) {
      return res.status(401).json({ message: "Account was not exist" });
    }

    //4. bcrypt the confirm code
    var code = Math.floor(Math.random() * 1000000 + 1);
    const message = `Your KOOMPI Hotspot verification code: ${code} `;

    //4. call twilio to send an sms
    try {
      twilio_sms_Client.sendSMS(phone, message);
      res.status(200).json({ message: `Message send to ${phone}` });
    } catch (error) {
      res.status(401).json({ message: `This number is incorrect ${phone}` });
      console.error(error.message);
    }
    //5. update this code inside our database
    await pool.query("UPDATE useraccount SET code = $1 WHERE phone = $2", [
      code,
      phone,
    ]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/reset-password-phone", async (req, res) => {
  try {
    const { phone, new_password } = req.body;

    const account = await pool.query(
      "SELECT * FROM useraccount WHERE phone = $1",
      [phone]
    );

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(new_password, salt);
    // update into database
    await pool.query("UPDATE useraccount SET password = $1 WHERE phone = $2", [
      bcryptPassword,
      phone,
    ]);

    const passwordHotsport = await pool.query(
      "SELECT * FROM radcheck WHERE acc_id = $1",
      [account.rows[0].id]
    );
    if (passwordHotsport.rows.length !== 0) {
      await pool.query(
        "UPDATE radcheck SET value = MD5($1) WHERE acc_id = $2",
        [new_password, account.rows[0].id]
      );
    }

    res.status(200).json({ message: "Reset password successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
