const axios = require("axios");
const moment = require("moment");
const pool = require("../../../db");
require("dotenv").config({ path: `../../../.env` });
var ethers = require('ethers');
const abi = require("../../../abi.json");
const CryptoJS = require('crypto-js');

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


    let dateTime = new Date();

    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );

    let riseContract = "0x3e6aE2b5D49D58cC8637a1A103e1B6d0B6378b8B";
    let recieverAddress = "0x8B055a926201c5fe4990A6D612314C2Bd4D78785";
    let selendraProvider = new ethers.providers.JsonRpcProvider(
      'https://rpc.testnet.selendra.org/', 
    );

    const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, "seed").toString(CryptoJS.enc.Utf8);

    const userWallet = new ethers.Wallet(seedDecrypted, selendraProvider);
    const getBalance = async (wallet) => {
      const contract = new ethers.Contract(riseContract, abi, wallet);
      const balance = await contract.balanceOf(wallet.address)
      return balance
    }

    let gas = {
      gasLimit: 100000,
      gasPrice: ethers.utils.parseUnits("100", "gwei"),
    }

    //===============================convert days to token of selendara 30 days = 5000 riels = 50 SEL
    //================================================================= 365days = 60000 riels = 600 SEL    by:   1 SEL = 100 riel
    //============ amount for checking condition

    if (amnt === 30) {
      amount = 50;
      if (checkWallet.rows[0].seed === null) {
        return [400, "Please get a wallet first!"];
      } else {
        const check = await getBalance(userWallet).then(async r => {
          const wallet = ethers.utils.formatUnits(r, 18);
          if (wallet < amount.toString()) {
            return [400, "You don't have enough money!"];
          } else {
            let senderWallet = new ethers.Wallet(seedDecrypted, selendraProvider);
            const contract = new ethers.Contract(riseContract, abi, senderWallet);
            const done = await contract.transfer(recieverAddress, ethers.utils.parseUnits(amount.toString(), 18), gas)
              .then(txObj => {
                pool.query(
                  "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
                  [JSON.parse(JSON.stringify(txObj.hash)), JSON.parse(JSON.stringify(txObj.from)), recieverAddress, amount, "", asset, memo, dateTime]
                );
                return [200, "Paid successfull"];
              })
              .catch(err => {
                console.log("selendra's bug with payment", err);
                return [501, err.reason];
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
        const check = await getBalance(userWallet).then(async r => {
          const wallet = ethers.utils.formatUnits(r, 18);
          if (wallet < amount.toString() - dis_value.toString()) {
            return [400, "You don't have enough money!"];
          } else {
            let senderWallet = new ethers.Wallet(seedDecrypted, selendraProvider);
            const contract = new ethers.Contract(riseContract, abi, senderWallet);
            const done = await contract.transfer(recieverAddress, ethers.utils.parseUnits(amount.toString(), 18), gas)
              .then(txObj => {
                pool.query(
                  "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
                  [JSON.parse(JSON.stringify(txObj.hash)), JSON.parse(JSON.stringify(txObj.from)), recieverAddress, amount, "", asset, memo, dateTime]
                );
                return [200, "Paid successfull"];
              })
              .catch(err => {
                console.log("selendra's bug with payment", err);
                return [501, err.reason];
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
          "RISE",
          value,
          "Automatically top-up for renew plan."
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

        i++;
      }
    }
  } catch (error) {
    console.log("error on auto topup", error);
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

module.exports = { autoRenew };
