const router = require("express").Router();
const pool = require("../../db");
const authorization = require("../../middleware/authorization");
const moment = require("moment");
const { randomAsHex } = require('@polkadot/util-crypto');
const { Keyring, ApiPromise, WsProvider } = require('@polkadot/api');
const CryptoJS = require('crypto-js');
require("dotenv").config();


router.put("/complete-inf", async (req, res) => {
  try {
    //1. destructure the req.body (full_name,gender , email, password,bithdate,address)

    const { name, gender, email, birthdate, address } = req.body;

    //2. check if user exist (if user exist then throw error)

    const user = await pool.query(
      "SELECT * FROM useraccount WHERE email = $1",
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
        "UPDATE useraccount SET name=$1, gender=$2, birthdate=$3, address=$4  WHERE email=$5 AND activate = true",
        [name, gender, birthdate, address, email]
      );
      return res.status(200).json({ message: "Completed Information." });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server Error!" });
  }
});

router.put("/complete-info", async (req, res) => {
  try {
    //1. destructure the req.body (full_name,gender , email, password,bithdate,address)

    const { fullname, gender, phone, email, birthdate, address } = req.body;

    //2. check if user exist (if user exist then throw error)

    const user = await pool.query(
      "SELECT * FROM useraccount WHERE phone = $1",
      [phone]
    );

    const checkFreeToken = await pool.query(
      "SELECT seed FROM useraccount WHERE seed != 'null'"
    );


    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Account isn't exist yet!" });
    }

  

    ///============================= Update Profile Info ========================
    
    const activate = await user.rows[0].activate;

    if (!activate) {
      return res
        .status(401)
        .json({ message: "Please activate your account first!" });
    } else {
      
      if(user.rows[0].fullname == null || user.rows[0].gender == null || user.rows[0].birthdate == null || user.rows[0].address == null){
        
        try{
    
          let dateTime = new moment().utcOffset(+7, false).format();
      
          const senderWallet = await pool.query(
            "SELECT * FROM useraccount WHERE id = $1",
            ['08682825-e9df-437f-b3f8-1172825512b3']
          );
      
          const ws = new WsProvider('wss://rpc-mainnet.selendra.org');
          const api = await ApiPromise.create({ provider: ws });
          
          const keyring = new Keyring({ 
            type: 'sr25519', 
            ss58Format: 972
          });
      
          // sender initialize
          const senderSeedDecrypted = CryptoJS.AES.decrypt(senderWallet.rows[0].seed, process.env.KEYENCRYPTION).toString(CryptoJS.enc.Utf8);
          const pairSender = keyring.createFromUri(senderSeedDecrypted);
          const amount = 10.0;
          const parsedAmount = BigInt(amount * Math.pow(10, api.registry.chainDecimals));
          const nonce = await api.rpc.system.accountNextIndex(pairSender.address);
      
          
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
                  "You recieved free 10.0000 SEL.", 
                  dateTime, 
                  // checkSenderPlayerid.rows[0].fullname,  
                  // checkDestPlayerid.rows[0].fullname, 
                ]
              );
            }
          );
        }
        catch (err) {
          console.error(err);
          return res.status(500).json({ message: "Server Error" });
        }
      }
      await pool.query(
        "UPDATE useraccount SET fullname=$1, gender=$2, birthdate=$3, address=$4, email=$5  WHERE phone=$6 AND activate = true",
        [fullname, gender, birthdate, address, email, phone]
      );

      // if(user.rows[0].seed === null && checkFreeToken.rows.length < 1000){

      //   ///============================= Free SEL Token ========================
  
  
      //   try{
  
      //     let dateTime = new moment().utcOffset(+7, false).format();
      
      //     const senderWallet = await pool.query(
      //       "SELECT * FROM useraccount WHERE id = $1",
      //       ['08682825-e9df-437f-b3f8-1172825512b3']
      //     );
      
      //     // generate wallet address and seed
      //     const seed = randomAsHex(32);
      
      //     const ws = new WsProvider('wss://rpc-mainnet.selendra.org');
      //     const api = await ApiPromise.create({ provider: ws });
          
      //     const keyring = new Keyring({ 
      //       type: 'sr25519', 
      //       ss58Format: 972
      //     });
          
      //     const pair = keyring.createFromUri(seed);
      
      //     const seedEncrypted = CryptoJS.AES.encrypt(seed, process.env.KEYENCRYPTION);
      
      //     // sender initialize
      //     const senderSeedDecrypted = CryptoJS.AES.decrypt(senderWallet.rows[0].seed, process.env.KEYENCRYPTION).toString(CryptoJS.enc.Utf8);
      //     const pairSender = keyring.createFromUri(senderSeedDecrypted);
      //     const amount = 50.1;
      //     const parsedAmount = BigInt(amount * Math.pow(10, api.registry.chainDecimals));
      //     const nonce = await api.rpc.system.accountNextIndex(pairSender.address);
      
          
      //     if (user.rows[0].seed === null) {
      //       await pool.query(
      //         "UPDATE useraccount SET wallet = $2, seed = $3 WHERE phone = $1",
      //         [phone, pair.address, seedEncrypted.toString()]
      //       )
            
      //       await api.tx.balances
      //       .transfer(pair.address, parsedAmount)
      //       .signAndSend(pairSender, { nonce }).then(result => {
      //         pool.query(
      //           "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
      //           [
      //             result.toHex(),
      //             pairSender.address,
      //             pair.address, 
      //             Number.parseFloat(amount).toFixed(4), 
      //             "", 
      //             "SEL", 
      //             "You recieved free 50.1000 SEL.", 
      //             dateTime, 
      //             // checkSenderPlayerid.rows[0].fullname,  
      //             // checkDestPlayerid.rows[0].fullname, 
      //           ]
      //         );
      //       });
  
      //       return res.status(200).json({ message: "You've got a selendra wallet." });
            
      //     }
      //     else {
      //       return res.status(401).json({ message: "You already have a selendra wallet!" });
      //     }
      //   }
      //   catch (err) {
      //     console.error(err);
      //     return res.status(500).json({ message: "Server Error" });
      //   }
      // }
      // else if(user.rows[0].seed === null){
      //   ///============================= by default get the wallet ========================
  
      //   try{
      
      //     // generate wallet address and seed
      //     const seed = randomAsHex(32);
          
      //     const keyring = new Keyring({ 
      //       type: 'sr25519', 
      //       ss58Format: 972
      //     });
          
      //     const pair = keyring.createFromUri(seed);
      
      //     const seedEncrypted = CryptoJS.AES.encrypt(seed, process.env.KEYENCRYPTION);
      
          
      //     if (user.rows[0].seed === null) {
      //       await pool.query(
      //         "UPDATE useraccount SET wallet = $2, seed = $3 WHERE phone = $1",
      //         [phone, pair.address, seedEncrypted.toString()]
      //       )
  
      //       return res.status(200).json({ message: "You've got a selendra wallet." });
            
      //     }
      //     else {
      //       return res.status(401).json({ message: "You already have a selendra wallet!" });
      //     }
      //   }
      //   catch (err) {
      //     console.error(err);
      //     return res.status(500).json({ message: "Server Error" });
      //   }
        
      // }

      return res.status(200).json({ message: "Completed Information." });
    }



  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server Error!" });
  }
});

// router.put("/edit-info", async (req, res) => {
//   try {
//     //1. destructure the req.body (full_name,gender , email, password,bithdate,address)

//     const { fullname, gender, phone, email, birthdate, address } = req.body;

//     //2. check if user exist (if user exist then throw error)

//     const user = await pool.query(
//       "SELECT * FROM useraccount WHERE phone = $1",
//       [phone]
//     );

//     const checkFreeToken = await pool.query(
//       "SELECT seed FROM useraccount WHERE seed != 'null'"
//     );


//     if (user.rows.length === 0) {
//       return res.status(401).json({ message: "Account isn't exist yet!" });
//     }


//     ///============================= Update Profile Info ========================
    
//     const activate = await user.rows[0].activate;

//     if (!activate) {
//       return res
//         .status(401)
//         .json({ message: "Please activate your account first!" });
//     } else {
//       await pool.query(
//         "UPDATE useraccount SET fullname=$1, gender=$2, birthdate=$3, address=$4, email=$5  WHERE phone=$6 AND activate = true",
//         [fullname, gender, birthdate, address, email, phone]
//       );

//       return res.status(200).json({ message: "Updated Information." });
//     }



//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ message: "Server Error!" });
//   }
// });


module.exports = router;
