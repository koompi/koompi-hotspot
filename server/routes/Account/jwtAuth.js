const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../../utils/jwtGenerator");
const validInfo = require("../../middleware/validInfo");
const authorization = require("../../middleware/authorization");
const sesClient = require("../Account/aws/aws_ses_client");
const twilio_sms_Client = require("../Account/twilioSMS/sendSMS");

//         RESGISTERING //

router.post("/register-full", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body (full_name,gender , email, password,bithdate,address)

    const { name, gender, email, password, birthdate, address } = req.body;

    //2. check if user exist (if user exist then throw error)

    const user = await pool.query(
      "SELECT * FROM users_email WHERE email = $1",
      [email]
    );
    if (user.rows.length !== 0) {
      return res.status(401).json({ message: "User already exist!" });
    }

    //3. bcrypt the user password

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    //4. bcrypt the verify code
    var code = Math.floor(Math.random() * 1000000 + 1);
    const html = `Hi there,
      <br/>
      Thank you for registering!
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

    const newUserAcc = await pool.query(
      "INSERT INTO users_email (name, gender, email, password, birthdate, address,verify) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [name, gender, email, bcryptPassword, birthdate, address, code]
    );

    res.status(200).json({ message: "Please check your E-mail!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.post("/register", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body
    const { email, password } = req.body;

    //2. check if user doesn't exist(if not then throw error)
    const user = await pool.query(
      "SELECT * FROM users_email WHERE email = $1",
      [email]
    );
    if (user.rows.length !== 0) {
      return res.status(401).json({ message: "Account already exist." });
    }

    //3. bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    //4. bcrypt the confirm code
    var code = Math.floor(Math.random() * 1000000 + 1);
    const html = `Hi there,
      <br/>
      Thank you for registering!
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
    await pool.query(
      "INSERT INTO users_email ( email, password, code) VALUES($1,$2,$3)",
      [email, bcryptPassword, code]
    );
    res.status(200).json({ message: "Please check your E-mail!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

//         LOGIN ROUTE //

router.post("/login", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body
    const { email, password } = req.body;

    //2. check if user doesn't exist(if not then throw error)

    const user = await pool.query("SELECT * FROM users_email WHERE email =$1", [
      email,
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

    //3. give them the jwt token

    const token = jwtGenerator(user.rows[0].id);
    res.json({
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

//         IS VERIFY ON LOGIN JWT TOKEN

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

//         CONFIRM CODE FROM EMAIL
router.post("/confirm-email", async (req, res) => {
  try {
    const { email, vCode } = req.body;

    const rCode = await pool.query(
      "SELECT code FROM users_email WHERE email =$1",
      [email]
    );

    if (rCode.rows[0].code === vCode) {
      await pool.query(
        "UPDATE users_email SET activate = true WHERE email=$1",
        [email]
      );
      res.status(200).json({ message: "Correct Code." });
    } else res.status(401).json({ message: "Incorrect Code!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

/////////////////////////////////////// Phone /////////////////////////////////////

router.post("/register-phone", async (req, res) => {
  try {
    // //1. destructure the req.body
    const { phone, password } = req.body;

    //2. check if user doesn't exist(if not then throw error)
    const user = await pool.query(
      "SELECT * FROM useraccount WHERE phone = $1",
      [phone]
    );
    // console.log(user);
    if (user.rows.length !== 0 && user.rows[0].activate === true) {
      return res.status(401).json({ message: "Account already exist." });
    } else {
      //3. bcrypt the user password
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);

      //4. bcrypt the confirm code
      var code = Math.floor(Math.random() * 1000000 + 1);
      const message = `Your KOOMPI Hotspot verification code: ${code} `;

      //4. call twilio send sms
      try {
        twilio_sms_Client.sendSMS(phone, message);

        res.status(200).json({ message: `Message send to ${phone}` });
      } catch (error) {
        res.status(401).json({ message: `This number is incorrect ${phone}` });
      }

      //5. enter the new user inside our database
      if (user.rows.length === 0) {
        await pool.query(
          "INSERT INTO useraccount ( phone, password, code) VALUES($1,$2,$3)",
          [phone, bcryptPassword, code]
        );
      }
      if (user.rows.length !== 0 && user.rows[0].activate === false) {
        await pool.query(
          "UPDATE useraccount SET password=$1, code=$2 WHERE phone =$3",
          [bcryptPassword, code, phone]
        );
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.post("/login-phone", async (req, res) => {
  try {
    //1. destructure the req.body
    const { phone, password } = req.body;

    //2. check if user doesn't exist(if not then throw error)

    const user = await pool.query("SELECT * FROM useraccount WHERE phone =$1", [
      phone,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Incorrect phone number!" });
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

    //3. give them the jwt token

    const token = jwtGenerator(user.rows[0].id);
    res.json({
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.post("/confirm-phone", async (req, res) => {
  try {
    const { phone, vCode } = req.body;

    const rCode = await pool.query(
      "SELECT code FROM useraccount WHERE phone =$1",
      [phone]
    );

    if (rCode.rows[0].code === vCode) {
      await pool.query(
        "UPDATE useraccount SET activate = true WHERE phone=$1",
        [phone]
      );
      res.status(200).json({ message: "Successfull." });
    } else res.status(401).json({ message: "Incorrect Code!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
