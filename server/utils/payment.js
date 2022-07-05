const pool = require("../db");
require("dotenv").config();
const bcrypt = require("bcrypt");
const CryptoJS = require('crypto-js');
const moment = require("moment");
const { Keyring, ApiPromise, WsProvider } = require('@polkadot/api');
require("../utils/functions")();

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
      console.log(data);
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};

const payment = async (req, asset, plan, memo) => {
  try {
    let amnt = parseFloat(plan, 10);
    var amount = 0;

    // check if admin allowed and set set discount
    const discount = await checkDiscount(req);
    var dis_value = 0;
    if (discount[1] !== 0) {
      dis_value = (amount * discount[1]) / 100;
    } else {
      dis_value = 0;
    }

    let dateTime = new moment().utcOffset(+7, false).format();

    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );


    const api = await requestTimer(res)

    const keyring = new Keyring({ 
      type: 'sr25519', 
      ss58Format: 972
    });



    const checkUserPlayerid = await pool.query("SELECT * FROM useraccount WHERE id = $1", [req.user]);
    const checkSellerPlayerid = await pool.query("SELECT * FROM useraccount WHERE wallet = $1", [process.env.SENDERADDRESS]);


    //===============================convert days to token of selendara 30 days = 5000 riels = 5 SEL
    //================================================================= 365days = 60000 riels = 600 SEL    by:   1 RISE = 1000 riel
    //============ amount for checking condition

    if (amnt === 30) {
      // RISE PRICE
      // amount = 5;

      // SEL PRICE
      amount = 50;

      // OneSignal Message
      let subscribePlanMessage = { 
        app_id: process.env.API_ID_ONESIGNAL,
        headings: {"en": "Subscribed Fi-Fi Plan" + " " + amnt + " " + "Days"},
        contents: {"en": amount + " " + asset + " " + "has been paid from your wallet"},
        include_player_ids: [checkUserPlayerid.rows[0].player_id]
      };

      let sellerMessage = { 
        app_id: process.env.API_ID_ONESIGNAL,
        headings: {"en": "Subscribed Fi-Fi Plan" + " " + amnt + " " + "Days"},
        contents: {"en": amount + " " + asset + " " + "has been paid to your wallet"},
        include_player_ids: [checkSellerPlayerid.rows[0].player_id]
      };

      if (checkWallet.rows[0].seed === null) {
        return [400, "Please get a wallet first!"];
      } else {

        const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, process.env.KEYENCRYPTION).toString(CryptoJS.enc.Utf8);
        
        const pair = keyring.createFromUri(seedDecrypted);

        const parsedAmount = BigInt(amount * Math.pow(10, api.registry.chainDecimals));

        const nonce = await api.rpc.system.accountNextIndex(pair.address);

        const check = await api.query.system.account(pair.address).then(async balance => {

          const parsedBalance = parseFloat(balance.data.free / Math.pow(10, api.registry.chainDecimals));

          if (parsedBalance < amount - dis_value) {
            return [400, "You don't have enough money!"];
          } else {

            const done = await api.tx.balances
              .transfer(process.env.SENDERADDRESS, parsedAmount)
              .signAndSend(pair, { nonce })
              .then(txObj => {
                pool.query(
                  "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime, fromname, toname) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
                  [
                    txObj.toHex(),
                    pair.address,
                    process.env.SENDERADDRESS, 
                    Number.parseFloat(amount).toFixed(4), 
                    "", 
                    "SEL", 
                    memo, 
                    dateTime, 
                    checkUserPlayerid.rows[0].fullname,  
                    checkSellerPlayerid.rows[0].fullname, 
                  ]
                );

                sendNotification(subscribePlanMessage);
                sendNotification(sellerMessage);

                return [200, "Paid successfully"];
              })
              .catch(err => {
                console.log("selendra's bug with payment", err);
                return [501, "Something went wrong! Please try again later"];
              });
            return done;
          }
        })
        .catch(err => {
          console.error(err);
          res.status(501).json({ message: "Selendra server is in maintenance." });
        });
        return check;
      }
    }
    if (amnt === 365) {
      // RISE PRICE
      // amount = 50;

      // SEL PRICE
      amount = 500;

      // OneSignal Message
      let subscribePlanMessage = { 
        app_id: process.env.API_ID_ONESIGNAL,
        headings: {"en": "Subscribed Fi-Fi Plan" + " " + amnt + " " + "Days"},
        contents: {"en": amount + " " + asset + " " + "has been paid from your wallet"},
        include_player_ids: [checkUserPlayerid.rows[0].player_id]
      };

      let sellerMessage = { 
        app_id: process.env.API_ID_ONESIGNAL,
        headings: {"en": "Subscribed Fi-Fi Plan" + " " + amnt + " " + "Days"},
        contents: {"en": amount + " " + asset + " " + "has been paid to your wallet"},
        include_player_ids: [checkSellerPlayerid.rows[0].player_id]
      };

      if (checkWallet.rows[0].seed === null) {
        return [400, "Please get a wallet first!"];
      } else {
        
        const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, process.env.KEYENCRYPTION).toString(CryptoJS.enc.Utf8);
        
        const pair = keyring.createFromUri(seedDecrypted);
        
        const parsedAmount = BigInt(amount * Math.pow(10, api.registry.chainDecimals));

        const nonce = await api.rpc.system.accountNextIndex(pair.address);

        const check =  await api.query.system.account(pair.address).then(async balance => {
          const parsedBalance = new BN(balance.data.free, 16)

          if (parsedBalance < amount - dis_value) {
            return [400, "You don't have enough money!"];
          } else {

            const done = await api.tx.balances
              .transfer(process.env.SENDERADDRESS, parsedAmount)
              .signAndSend(pair, { nonce })
              .then(txObj => {
                pool.query(
                  "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime, fromname, toname) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
                  [
                    txObj.toHex(),
                    pair.address,
                    process.env.SENDERADDRESS, 
                    Number.parseFloat(amount).toFixed(4), 
                    "", 
                    "SEL", 
                    memo, 
                    dateTime, 
                    checkUserPlayerid.rows[0].fullname,  
                    checkSellerPlayerid.rows[0].fullname, 
                  ]
                );

                sendNotification(subscribePlanMessage);
                sendNotification(sellerMessage);

                return [200, "Paid successfully"];
              })
              .catch(err => {
                console.log("selendra's bug with payment", err);
                return [501, "Something went wrong! Please try again later"];
              });
            return done;
          }
        })
        .catch(err => {
          console.error(err);
          res.status(501).json({ message: "Selendra server is in maintenance." });
        });
        return check;
      }
    }

    // =====================================check if user doesn't have a wallet=================

  } catch (err) {
    console.log("Payment error", err);
    return [500, "Server error!"];
  }
};

const checking = async (req, plan) => {
  try {
    let amnt = parseFloat(plan, 10);
    var amount = 0;

    // check if admin allowed and set set discount
    const discount = await checkDiscount(req);
    var dis_value = 0;
    if (discount[1] !== 0) {
      dis_value = (amount * discount[1]) / 100;
    } else {
      dis_value = 0;
    }

    let dateTime = new moment().utcOffset(+7, false).format();

    const checkWallet = await pool.query(
      "SELECT seed FROM useraccount WHERE id = $1",
      [req.user]
    );

    const api = await requestTimer(res)

    const keyring = new Keyring({ 
      type: 'sr25519', 
      ss58Format: 972
    });

    const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, process.env.KEYENCRYPTION).toString(CryptoJS.enc.Utf8);
        
    const pair = keyring.createFromUri(seedDecrypted);
  
    const parsedAmount = BigInt(amount * Math.pow(10, api.registry.chainDecimals));

    const nonce = await api.rpc.system.accountNextIndex(pair.address);

    if (amnt === 30) {
      amount = 50;
      if (checkWallet.rows[0].seed === null) {
        return [400, "Please get a wallet first!"];
      } else {
        const check = await api.query.system.account(pair.address).then(async balance => {
          const parsedBalance = new BN(balance.data.free, 16)

          if (parsedBalance < amount - dis_value) {
            return [400, "You don't have enough money!"];
          } else {

            const done = await api.tx.balances
              .transfer(process.env.SENDERADDRESS, parsedAmount)
              .signAndSend(pair, { nonce })
              .then(txObj => {
                pool.query(
                  "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime, fromname, toname) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
                  [
                    txObj.toHex(),
                    pair.address,
                    process.env.SENDERADDRESS, 
                    Number.parseFloat(amount).toFixed(4), 
                    "", 
                    "SEL", 
                    memo, 
                    dateTime, 
                    checkUserPlayerid.rows[0].fullname,  
                    checkSellerPlayerid.rows[0].fullname, 
                  ]
                );

                return [200, "Paid successfully"];
              })
              .catch(err => {
                console.log("selendra's bug with payment", err);
                return [501, "Selendra server is in maintenance."];
              });
            return done;
          }
        })
        .catch(err => {
          console.error(err);
          res.status(501).json({ message: "Selendra server is in maintenance." });
        });
        return check;
      }
    }
    if (amnt === 365) {
      amount = 600;
      if (checkWallet.rows[0].seed === null) {
        return [400, "Please get a wallet first!"];
      } else {
        const check = await api.query.system.account(pair.address).then(async balance => {
          const parsedBalance = new BN(balance.data.free, 16)
          const parsedAmount = Number(amount * Math.pow(10, api.registry.chainDecimals));

          if (parsedBalance < amount - dis_value) {
            return [400, "You don't have enough money!"];
          } else {

            const done = await api.tx.balances
              .transfer(process.env.SENDERADDRESS, parsedAmount)
              .signAndSend(pair, { nonce })
              .then(txObj => {
                pool.query(
                  "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime, fromname, toname) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
                  [
                    txObj.toHex(),
                    pair.address,
                    process.env.SENDERADDRESS, 
                    Number.parseFloat(amount).toFixed(4), 
                    "", 
                    "SEL", 
                    memo, 
                    dateTime, 
                    checkUserPlayerid.rows[0].fullname,  
                    checkSellerPlayerid.rows[0].fullname, 
                  ]
                );

                return [200, "Paid successfully"];
              })
              .catch(err => {
                console.log("selendra's bug with payment", err);
                return [501, "Selendra server is in maintenance."];
              });
            return done;
          }
        })
        .catch(err => {
          console.error(err);
          res.status(501).json({ message: "Selendra server is in maintenance." });
        });
        return check;
      }
    }

  } catch (error) {
    console.log("checking", error);
    return [401, "You don't have enough money!"];
  }
};

const confirm_pass = async (req, password) => {
  try {
    ////            check password
    const pass = await pool.query("select * from useraccount WHERE id = $1", [
      req.user
    ]);
    // compare password
    const validPassword = await bcrypt.compare(password, pass.rows[0].password);
    if (!validPassword) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("bug with confrim password function", error);
    return false;
  }
};

const checkDiscount = async req => {
  try {
    const a = await pool.query("SELECT role  FROM useraccount where id=$1", [
      req.user
    ]);
    if (a.rows[0].role === "Teacher") {
      var b = await pool.query(
        "select d.*,s.* from discount_teachers as d INNER JOIN setdiscount as s ON (d.acc_id=$1 AND d.approved IS TRUE AND s.role = 'Teacher')",
        [req.user]
      );
      if (b.rowCount === 0) {
        return ["teacher", 0];
      }
      return ["teacher", b.rows[0].discount];
    } else if (a.rows[0].role === "Normal") {
      const c = await pool.query(
        "SELECT *  FROM setdiscount where role='Normal'"
      );
      if (b.rowCount === 0) {
        return ["normal", 0];
      }
      return ["normal", c.rows[0].discount];
    } else return ["null", 0];
  } catch (error) {
    console.log("Error on method checkDiscount on payment.js", error);
    return ["error function", 0];
  }
};

module.exports = { checking, payment, confirm_pass };
