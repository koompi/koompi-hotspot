const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const { jwtGenerator } = require("../../utils/jwtGenerator");
const validInfo = require("../../middleware/validInfo");
const authorization = require("../../middleware/authorization");
const sesClient = require("../Account/aws/aws_ses_client");
const twilio_sms_Client = require("../Account/twilioSMS/sendSMS");
const moment = require("moment");
const { randomAsHex } = require('@polkadot/util-crypto');
const { Keyring, ApiPromise, WsProvider } = require('@polkadot/api');
const CryptoJS = require('crypto-js');
require("dotenv").config();

//         RESGISTERING //

router.post("/register-full", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body (full_name,gender , email, password,bithdate,address)

    const { name, gender, email, password, birthdate, address } = req.body;

    //2. check if user exist (if user exist then throw error)

    const user = await pool.query(
      "SELECT * FROM useraccount WHERE email = $1",
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
    var min = 100000;
    var max = 999999;
    var code = Math.floor(Math.random() * (max - min + 1) + min);
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
      "INSERT INTO useraccount (name, gender, email, password, birthdate, address,verify) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
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
      "SELECT * FROM useraccount WHERE email = $1",
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
    var min = 100000;
    var max = 999999;
    var code = Math.floor(Math.random() * (max - min + 1) + min);
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
      "INSERT INTO useraccount ( email, password, code) VALUES($1,$2,$3)",
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

    //3. give them the jwt token

    const token = jwtGenerator(user.rows[0].id);
    res.json({
      token
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
      "SELECT code FROM useraccount WHERE email =$1",
      [email]
    );

    if (rCode.rows[0].code === vCode) {
      await pool.query(
        "UPDATE useraccount SET activate = true WHERE email=$1",
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
      var min = 100000;
      var max = 999999;
      var code = Math.floor(Math.random() * (max - min + 1) + min);
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
      phone
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Account was not exist!" });
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
      token
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error!" });
  }
});

router.post("/confirm-phone", async (req, res) => {
  try {
    const { phone, vCode } = req.body;

    const user = await pool.query(
      "SELECT * FROM useraccount WHERE phone =$1",
      [phone]
    );
    const checkFreeToken = await pool.query(
      "SELECT seed FROM useraccount WHERE seed != 'null'"
    );

    if (user.rows[0].code === vCode) {
      await pool.query(
        "UPDATE useraccount SET activate = true WHERE phone=$1",
        [phone]
      );

      // Generate Wallet after completed OPT

      if(user.rows[0].seed === null && checkFreeToken.rows.length < 1000){

        ///============================= Free SEL Token ========================
  
  
        try{
  
          let dateTime = new moment().utcOffset(+7, false).format();
      
          const senderWallet = await pool.query(
            "SELECT * FROM useraccount WHERE id = $1",
            ['08682825-e9df-437f-b3f8-1172825512b3']
          );
      
          // generate wallet address and seed
          const seed = randomAsHex(32);
      
          const ws = new WsProvider('wss://rpc-mainnet.selendra.org');
          const api = await ApiPromise.create({ provider: ws });
          
          const keyring = new Keyring({ 
            type: 'sr25519', 
            ss58Format: 972
          });
          
          const pair = keyring.createFromUri(seed);
      
          const seedEncrypted = CryptoJS.AES.encrypt(seed, process.env.KEYENCRYPTION);
      
          // sender initialize
          const senderSeedDecrypted = CryptoJS.AES.decrypt(senderWallet.rows[0].seed, process.env.KEYENCRYPTION).toString(CryptoJS.enc.Utf8);
          const pairSender = keyring.createFromUri(senderSeedDecrypted);
          const amount = 50.1;
          const parsedAmount = BigInt(amount * Math.pow(10, api.registry.chainDecimals));
          const nonce = await api.rpc.system.accountNextIndex(pairSender.address);
      
          
          if (user.rows[0].seed === null) {
            await pool.query(
              "UPDATE useraccount SET wallet = $2, seed = $3 WHERE phone = $1",
              [phone, pair.address, seedEncrypted.toString()]
            )
            
            await api.tx.balances
            .transfer(pair.address, parsedAmount)
            .signAndSend(pairSender, { nonce }).then(result => {
              pool.query(
                "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
                [
                  result.toHex(),
                  pairSender.address,
                  pair.address, 
                  Number.parseFloat(amount).toFixed(4), 
                  "", 
                  "SEL", 
                  "You recieved free 50.1000 SEL.", 
                  dateTime, 
                  // checkSenderPlayerid.rows[0].fullname,  
                  // checkDestPlayerid.rows[0].fullname, 
                ]
              );
            });
  
            return res.status(200).json({ message: "You've got a selendra wallet." });
            
          }
          else {
            return res.status(401).json({ message: "You already have a selendra wallet!" });
          }
        }
        catch (err) {
          console.error(err);
          return res.status(500).json({ message: "Server Error" });
        }
      }
      else if(user.rows[0].seed === null){
        ///============================= by default get the wallet ========================
  
        try{
      
          // generate wallet address and seed
          const seed = randomAsHex(32);
          
          const keyring = new Keyring({ 
            type: 'sr25519', 
            ss58Format: 972
          });
          
          const pair = keyring.createFromUri(seed);
      
          const seedEncrypted = CryptoJS.AES.encrypt(seed, process.env.KEYENCRYPTION);
      
          
          if (user.rows[0].seed === null) {
            await pool.query(
              "UPDATE useraccount SET wallet = $2, seed = $3 WHERE phone = $1",
              [phone, pair.address, seedEncrypted.toString()]
            )
  
            return res.status(200).json({ message: "You've got a selendra wallet." });
            
          }
          else {
            return res.status(401).json({ message: "You already have a selendra wallet!" });
          }
        }
        catch (err) {
          console.error(err);
          return res.status(500).json({ message: "Server Error" });
        }
        
      }

      res.status(200).json({ message: "Successfull." });
    } else res.status(401).json({ message: "Incorrect Code!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
