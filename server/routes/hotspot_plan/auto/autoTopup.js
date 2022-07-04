const moment = require("moment");
const pool = require("../../../db");
require("dotenv").config();
const abi = require("../../../abi.json");
const CryptoJS = require('crypto-js');
const { Keyring, ApiPromise, WsProvider } = require('@polkadot/api');


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

const payment = async (req, asset, plan, memo) => {
  try {
    let amnt = parseFloat(plan, 10);
    var amount = 0;

    let dateTime = new moment().utcOffset(+7, false).format();
    
    //===============================convert days to token of selendara 30 days = 5000 riels = 50 SEL
    //================================================================= 365days = 60000 riels = 600 SEL    by:   1 SEL = 100 riel
    //============ amnt for push data to selendra as string
    //============ amount for checking condition

    if (amnt === 30) {
      // RISE PRICE
      // amount = 5;

      // SEL PRICE
      amount = 50;

    }
    if (amnt === 365) {
      // RISE PRICE
      // amount = 50;

      // SEL PRICE
      amount = 500;
    }

    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req]
    );


    let ws;
    ws = new WsProvider('wss://rpc-mainnet.selendra.org');
    
    if(ws.isConnected == false){
      await ws.disconnect();

      ws = new WsProvider('wss://api-mainnet.selendra.org');

      if(ws.isConnected == false){
        await ws.disconnect();
      }
    }

    const api = await ApiPromise.create({ provider: ws });

    const keyring = new Keyring({ 
      type: 'sr25519', 
      ss58Format: 972
    });

    const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, process.env.KEYENCRYPTION).toString(CryptoJS.enc.Utf8);
        
    const pair = keyring.createFromUri(seedDecrypted);

    const checkUserPlayerid = await pool.query("SELECT * FROM useraccount WHERE id = $1", [req]);
    const checkSellerPlayerid = await pool.query("SELECT * FROM useraccount WHERE wallet = $1", [process.env.SENDERADDRESS]);

    const nonce = await api.rpc.system.accountNextIndex(pair.address);

    // OneSignal Message
    let autoRenewPlanMessage = { 
      app_id: process.env.API_ID_ONESIGNAL,
      headings: {"en": "Auto Renew Fi-Fi Plan" + " " + amnt + " " + "days"},
      contents: {"en": amount + " " + asset + " " + "has been paid from your wallet"},
      include_player_ids: [checkUserPlayerid.rows[0].player_id]
    };

    let sellerMessage = { 
      app_id: process.env.API_ID_ONESIGNAL,
      headings: {"en": "Auto Renew Fi-Fi Plan" + " " + amnt + " " + "days"},
      contents: {"en": amount + " " + asset + " " + "has been paid to your wallet"},
      include_player_ids: [checkSellerPlayerid.rows[0].player_id]
    };

    // =====================================check if user doesn't have a wallet=================
    if (checkWallet.rows[0].seed === null) {
      return [400, "Please get a wallet first!"];
    } else {
      const check = api.query.system.account(pair.address).then(async balance => {

        const parsedBalance = new BN(r.data.free, 16)
        const parsedAmount = Number(amount * Math.pow(10, api.registry.chainDecimals));

        if (parsedBalance < amount) {
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

              sendNotification(autoRenewPlanMessage);
              sendNotification(sellerMessage);

              return [200, "Paid successfully!"];
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
        return [501, "Selendra server is in maintenance."];
      });
      return check;
    }
  } catch (err) {
    console.log("Payment error", err);
    return [500, "Server error!"];
  }
};


const autoRenew = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM  radcheck WHERE status = false and auto = true"
    );

    let n = result.rows.length;

    if (n > 0) {
      let i = 0;
      while (i < n) {
        const info = await pool.query(
          "SELECT * FROM  radgroupcheck WHERE attribute = 'Expiration' and acc_id = $1",
          [result.rows[i].acc_id]
        );

        let str = info.rows[0].groupname;
        let plan = str.slice(str.lastIndexOf("Ex_") + 3, str.lastIndexOf("_"));
        const value = parseFloat(plan, 10);

        /////////// check balance with payment /////////////////////////

        const paid = await payment(
          result.rows[i].acc_id,
          "SEL",
          value,
          `Automatically Renewed Fi-Fi Plan ${value} Days`
        );

        if (paid[0] === 200) {
          const due = moment()
            .add(value, "days")
            .format("YYYY MMM DD");

          await pool.query(
            "UPDATE radgroupcheck SET value = $1 WHERE attribute = 'Expiration' AND acc_id = $2",
            [due, result.rows[i].acc_id]
          );
          await pool.query(
            "UPDATE radcheck SET status = true WHERE acc_id = $1",
            [result.rows[i].acc_id]
          );

          console.log(`Automatically top-up for ${result.rows[i].acc_id}`);
        }
        else{
          console.log(paid[1])
        }

        i++;
      }
    }
  } catch (error) {
    console.log("error on auto topup", error);
  }
};

module.exports = { autoRenew };
