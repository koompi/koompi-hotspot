const router = require("express").Router();
const pool = require("../../db");
require("dotenv").config();
const authorization = require("../../middleware/authorization");
const confirmPass = require("../../utils/payment");
const AddressIsValid = require("../../utils/check_validwallet");
const CryptoJS = require('crypto-js');
const moment = require("moment");
const { Keyring, ApiPromise, WsProvider } = require('@polkadot/api');
require("../../utils/functions")();
const { formatBalance } = require ('@polkadot/util');

const Api = require('../../utils/requestTimer');


router.post("/transfer", authorization, async (req, res) => {
  try {
    const { password, dest_wallet, asset, amount, memo } = req.body;
    let typeAsset = asset;

    const confirm = await confirmPass.confirm_pass(req, password);

    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );


    const {api} = new Api();
    
    const keyring = new Keyring({ 
      type: 'sr25519', 
      ss58Format: 972
    });


    const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, process.env.KEYENCRYPTION).toString(CryptoJS.enc.Utf8);

    const pair = keyring.createFromUri(seedDecrypted);

    // Retrieve the account balance via the system module
    const { data: balance } = await api.query.system.account(pair.address);

    let mainBalance = parseFloat(balance.free / Math.pow(10, api.registry.chainDecimals[0]));

    const parsedAmount = BigInt(amount * Math.pow(10, api.registry.chainDecimals[0]));

    const nonce = await api.rpc.system.accountNextIndex(pair.address);
    
    let dateTime = new moment().utcOffset(+7, false).format();

    

    //=====================================check if user doesn't have a wallet=================
    if (!confirm) {
      res.status(401).json({ message: "Incorrect password!" });
    } else if (checkWallet.rows[0].seed === null) {
      res.status(400).json({ message: "Please get a wallet first!" });
    } else if(typeAsset === "LUY") {
      return res.status(400).json({ message: "Not yet available!" });
    }
    else if(typeAsset === "SEL"){


      if (mainBalance < amount) {
        res.status(400).json({ message: "You don't have enough token!" });
      }
      else{
        await api.tx.balances
          .transfer(dest_wallet, parsedAmount)
          .signAndSend(pair, { nonce }).then(result =>{
            pool.query(
              "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
              [
                result.toHex(),
                pair.address,
                dest_wallet, 
                Number.parseFloat(amount).toFixed(4), 
                "", 
                "SEL", 
                memo, 
                dateTime, 
              ]
            ).then(() => {
                res.status(200).json(JSON.parse(JSON.stringify({
                  hash: result.toHex(),
                  sender: pair.address,
                  destination: dest_wallet,
                  amount: Number.parseFloat(amount).toFixed(4),
                  fee: "",
                  symbol: "SEL",
                  memo: memo,
                  datetime: dateTime,
                })));
            });
            

          }).catch(err => {
            console.error(err);
            res.status(501).json({ message: "Sorry, Something went wrong!" });
          });
      }
      
    }
    else{
      res.status(404).json({ message: "Sorry, Something went wrong!" });
    }
  } catch (err) {
    console.log("bug on get wallet function", err);
    res.status(500).json({ message: err.reason });
  }
});


router.get("/portfolio", authorization, async (req, res) => {
 
  try {
    
    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );

    const {api} = new Api();

    const keyring = new Keyring({ 
      type: 'sr25519', 
      ss58Format: 972
    });
   
    
    if (checkWallet.rows[0].seed === null) {

      res.status(401).json({ message: "Please get wallet first!" });

    } else {
      
      const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, process.env.KEYENCRYPTION).toString(CryptoJS.enc.Utf8);
      
      const pair = keyring.createFromUri(seedDecrypted);      

      // Retrieve the account balance via the system module
      const { data: balance } = await api.query.system.account(pair.address);

      let mainBalance = parseFloat(balance.free / Math.pow(10, api.registry.chainDecimals[0]));


      res.status(200).json([
        {
          id: "sel",
          token: mainBalance,
          symbol: "SEL"
        },
        {
          id: "luy",
          token: "Coming soon",
          symbol: "LUY"
        },
        {
          id: "ksd",
          token: "Coming soon",
          symbol: "KSD"
        },
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

    const limit = req.query.limit;
    
    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );

    const getHistory = await pool.query(
      "SELECT * FROM txhistory WHERE sender = $1 OR destination = $1 ORDER BY datetime DESC LIMIT $2",
      [checkWallet.rows[0].wallet, limit]
    )

    // const paginate = getHistory.rows.slice((page - 1) * limit, page * limit);


    if (checkWallet.rows[0].seed === null) {
      res.status(401).json({ message: "Please get wallet first!" });
    } else {
      if(limit === null){
        return res.status(200).json(getHistory.rows);
      } 
      else{
        return res.status(200).json(getHistory.rows);
      }
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