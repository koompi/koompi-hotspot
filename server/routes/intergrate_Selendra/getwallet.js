const router = require("express").Router();
const axios = require("axios");
const pool = require("../../db");
require("dotenv").config();
const authorization = require("../../middleware/authorization");
const confirmPass = require("../../utils/payment");
const AddressIsValid = require("../../utils/check_validwallet");
var ethers = require('ethers');
const abi = require( "../../abi.json" );
const CryptoJS = require('crypto-js');
const moment = require("moment");
const { randomAsHex } = require('@polkadot/util-crypto');
const { Keyring, ApiPromise, WsProvider } = require('@polkadot/api');
const BN = require('bn.js');

// OneSignal Notification
var sendNotification = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": `Basic ${process.env.API_KEY_ONESIGNAL}`
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  var https = require('https');
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};

//  Generate Wallet or Get wallet for userAcc
router.get("/get-wallet", authorization, async (req, res) => {
  try{

    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );

    // generate wallet address and seed
    const seed = randomAsHex(32);

    const keyring = new Keyring({ 
      type: 'sr25519', 
      ss58Format: 972
    });

    
    const pair = keyring.createFromUri(seed);

    const seedEncrypted = CryptoJS.AES.encrypt(seed, "seed");
    
    if (checkWallet.rows[0].seed === null) {
      await pool.query(
        "UPDATE useraccount SET wallet = $2, seed = $3 WHERE id = $1",
        [req.user, pair.address, seedEncrypted.toString()]
      )
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error!" });
      });
      res.status(200).json({ message: "You've got a selendra wallet." });
    } else {
      res.status(401).json({ message: "You already have a selendra wallet!" });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
})


router.post("/transfer", authorization, async (req, res) => {
  try {
    const { password, dest_wallet, asset, amount, memo } = req.body;
    let typeAsset = asset;

    const checkSenderPlayerid = await pool.query("SELECT * FROM useraccount WHERE id = $1", [req.user]);
    const checkDestPlayerid = await pool.query("SELECT * FROM useraccount WHERE wallet = $1", [dest_wallet]);

    // OneSignal Message
    let senderMessage = { 
      app_id: process.env.API_ID_ONESIGNAL,
      headings: {"en": "Sent to" + " " + checkDestPlayerid.rows[0].fullname},
      contents: {"en": Number.parseFloat(amount).toFixed(4) + " " + typeAsset + " " + "to address" + " " + checkDestPlayerid.rows[0].wallet},
      include_player_ids: [checkSenderPlayerid.rows[0].player_id]
    };
  
    let recieverMessage = { 
      app_id: process.env.API_ID_ONESIGNAL,
      headings: {"en": "Recieved from" + " " + checkSenderPlayerid.rows[0].fullname},
      contents: {"en": Number.parseFloat(amount).toFixed(4) + " " + typeAsset + " " + "from address" + " " + checkSenderPlayerid.rows[0].wallet},
      include_player_ids: [checkDestPlayerid.rows[0].player_id]
    };

    const confirm = await confirmPass.confirm_pass(req, password);

    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );


    const ws = new WsProvider('wss://rpc1-testnet.selendra.org');
    const api = await ApiPromise.create({ provider: ws });
    
    const keyring = new Keyring({ 
      type: 'sr25519', 
      ss58Format: 972
    });


    const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, "seed").toString(CryptoJS.enc.Utf8);

    const pair = keyring.createFromUri(seedDecrypted);

    let dateTime = new moment().utcOffset(+7, false).format();

    //=====================================check if user doesn't have a wallet=================
    if (!confirm) {
      res.status(401).json({ message: "Incorrect password!" });
    } else if (checkWallet.rows[0].seed === null) {
      res.status(400).json({ message: "Please get a wallet first!" });
    } else if(typeAsset === "RISE") {
      await getBalance(userWallet).then(async r => {
        const wallet = ethers.utils.formatUnits(r, 18);
        const balance = parseFloat(wallet);
        if (balance < amount) {
          res.status(400).json({ message: "You don't have enough token!" });
        } else {
          let senderWallet = new ethers.Wallet(seedDecrypted, selendraProvider);
          const contract = new ethers.Contract(riseContract, abi, senderWallet);

          let gas = {
            gasLimit: 100000,
            gasPrice: ethers.utils.parseUnits("100", "gwei"),
          }
          
          await contract.transfer(dest_wallets, ethers.utils.parseUnits(amount.toString(), 18), gas)
            .then(txObj => {
              pool.query(
                "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime, fromname, toname) VALUES($1,$2,$3,$4,$5,$6,$7,$8, $9, $10)",
                [
                  JSON.parse(JSON.stringify(txObj.hash)), 
                  JSON.parse(JSON.stringify(txObj.from)), 
                  dest_wallet, Number.parseFloat(amount).toFixed(3), 
                  "", 
                  "RISE", 
                  memo, 
                  dateTime, 
                  checkSenderPlayerid.rows[0].fullname,  
                  checkDestPlayerid.rows[0].fullname, 
                ]
              );
              res.status(200).json(JSON.parse(JSON.stringify({
                hash: txObj.hash,
                sender: txObj.from,
                destination: dest_wallet,
                amount: Number.parseFloat(amount).toFixed(3),
                fee: "",
                symbol: "RISE",
                memo: memo,
                datetime: dateTime,
                from: checkSenderPlayerid.rows[0].fullname,
                to: checkDestPlayerid.rows[0].fullname,
              })));

              // sendNotification(senderMessage);
              // sendNotification(recieverMessage);
              
            })
            .catch(err => {
              console.log("selendra's bug with payment", err);
              res.status(501).json({ message: err.reason });
            });
          }
      })
      .catch(err => {
        console.error(err);
        res.status(501).json({ message: "Sorry, Something went wrong!" });
      });
    }
    else if(typeAsset === "SEL"){

      const parsedAmount = BigInt(amount * Math.pow(10, api.registry.chainDecimals));
      const nonce = await api.rpc.system.accountNextIndex(pair.address);

      await api.query.system.account(pair.address).then(async r => {

        const parsedBalance = BigInt(r.data.free * Math.pow(10, api.registry.chainDecimals));
        if (parsedBalance < parsedAmount) {
          res.status(400).json({ message: "You don't have enough token!" });
        }
        else{
          await api.tx.balances
            .transfer(dest_wallet, parsedAmount)
            .signAndSend(pair, { nonce }).then(result =>{
              pool.query(
                "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime, fromname, toname) VALUES($1,$2,$3,$4,$5,$6,$7,$8, $9, $10)",
                [
                  result.toHex(),
                  pair.address,
                  dest_wallet, 
                  Number.parseFloat(amount).toFixed(4), 
                  "", 
                  "SEL", 
                  memo, 
                  dateTime, 
                  checkSenderPlayerid.rows[0].fullname,  
                  checkDestPlayerid.rows[0].fullname, 
                ]
              );
              res.status(200).json(JSON.parse(JSON.stringify({
                hash: result.toHex(),
                sender: pair.address,
                destination: dest_wallet,
                amount: Number.parseFloat(amount).toFixed(4),
                fee: "",
                symbol: "SEL",
                memo: memo,
                datetime: dateTime,
                from: checkSenderPlayerid.rows[0].fullname,
                to: checkDestPlayerid.rows[0].fullname,
              })));
              sendNotification(senderMessage);
              sendNotification(recieverMessage);

            }).catch(err => {
              console.error(err);
              res.status(501).json({ message: "Sorry, Something went wrong!" });
            });
        }
      });
      
    }
    else{
      res.status(404).json({ message: "Sorry, Something went wrong!" });
    }
  } catch (err) {
    console.log("bug on get wallet function", err);
    res.status(500).json({ message: err.reason });
  }
});

// Porfilio user balance
router.get("/portfolio", authorization, async (req, res) => {
  try {
    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );

    const ws = new WsProvider('wss://rpc1-testnet.selendra.org');
    const api = await ApiPromise.create({ provider: ws });

    const keyring = new Keyring({ 
      type: 'sr25519', 
      ss58Format: 972
    });

    
    if (checkWallet.rows[0].seed === null) {
      res.status(401).json({ message: "Please get wallet first!" });
    } else {
      const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, "seed").toString(CryptoJS.enc.Utf8);
      
      const pair = keyring.createFromUri(seedDecrypted);


      // Retrieve the account balance via the system module
      const { data: balance } = await api.query.system.account(pair.address);
  

      const parsedAmount = Number(balance.free / Math.pow(10, api.registry.chainDecimals));
      

      res.status(200).json([
        {
          id: "rise",
          token: "Token Suspended",
          symbol: "RISE"
        },
        {
          id: "sel",
          token: parsedAmount.toFixed(4),
          symbol: "SEL"
        }
      ]);

    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!" });
  }
});


// History user balance
router.get("/history", authorization, async (req, res) => {
  try {
    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );

    if (checkWallet.rows[0].seed === null) {
      res.status(401).json({ message: "Please get wallet first!" });
    } else {
        await pool.query(
          "SELECT * FROM txhistory WHERE sender = $1 OR destination = $1 ORDER BY datetime DESC",
          [checkWallet.rows[0].wallet]
        )
        .then(async r => {
          res.status(200).json(JSON.parse(JSON.stringify(r.rows)));
        })
        .catch(err => {
          res.status(500).json({ message: "Internal server error" });
          console.error(err);
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!" });
  }
});

// router.post("/test", authorization, async (req, res) => {
//   try {
//     const { password } = req.body;
//     // //////////////// check password ////////////////////////
//     const verify = await confirmPass.confirm_pass(req, password);
//     if (!verify) {
//       res.status(401).json({ message: "Incorrect password" });
//     } else {
//       console.log(verify);
//       res.status(200).json({ message: "correct pass" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error!" });
//   }
// });
module.exports = router;
