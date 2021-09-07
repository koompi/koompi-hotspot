const axios = require("axios");
const pool = require("../db");
require("dotenv").config();
const bcrypt = require("bcrypt");
var ethers = require('ethers');
const abi = require("../abi.json");
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

    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );

    let usdtContract = "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd";
    let recieverAddress = "0xd9327341Ba48faB04d62c9Dc5128C01EB80927ab";
    let bscProvider = new ethers.providers.JsonRpcProvider(
      'https://data-seed-prebsc-1-s1.binance.org:8545/', 
      {   
          name: 'binance', 
          chainId: 97 
      }
    );
    const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, "seed").toString(CryptoJS.enc.Utf8);

    const userWallet = new ethers.Wallet(seedDecrypted, bscProvider);
    const getBalance = async (wallet) => {
      const contract = new ethers.Contract(usdtContract, abi, wallet);
      const balance = await contract.balanceOf(wallet.address)
      return balance
    }

    

    //===============================convert days to token of selendara 30 days = 5000 riels = 50 SEL
    //================================================================= 365days = 60000 riels = 600 SEL    by:   1 SEL = 100 riel
    //============ amount for checking condition

    if (amnt === 30) {
      amount = 0.5;
      if (checkWallet.rows[0].seed === null) {
        return [400, "Please get a wallet first!"];
      } else {
        const check = await getBalance(userWallet).then(async r => {
          const wallet = ethers.utils.formatUnits(r, 18);
          if (wallet < amount.toString() - dis_value.toString()) {
            return [400, "You don't have enough money!"];
          } else {
            let senderWallet = new ethers.Wallet(seedDecrypted, bscProvider);
            const contract = new ethers.Contract(usdtContract, abi, senderWallet);
            const done = await contract.transfer(recieverAddress, ethers.utils.parseUnits(amount.toString(), 18))
              .then(() => {
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
      amount = 1.0;
      if (checkWallet.rows[0].seed === null) {
        return [400, "Please get a wallet first!"];
      } else {
        const check = await getBalance(userWallet).then(async r => {
          const wallet = ethers.utils.formatUnits(r, 18);
          if (wallet < amount.toString() - dis_value.toString()) {
            return [400, "You don't have enough money!"];
          } else {
            let senderWallet = new ethers.Wallet(seedDecrypted, bscProvider);
            const contract = new ethers.Contract(usdtContract, abi, senderWallet);
            const done = await contract.transfer(recieverAddress, ethers.utils.parseUnits(amount.toString(), 18))
              .then(() => {
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

    const checkWallet = await pool.query(
      "SELECT seed FROM useraccount WHERE id = $1",
      [req.user]
    );
    
    const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, "seed").toString(CryptoJS.enc.Utf8);
   
    const userWallet = new ethers.Wallet(seedDecrypted, bscProvider);
    const getBalance = async (wallet) => {
      const contract = new ethers.Contract(usdtContract, abi, wallet);
      const balance = await contract.balanceOf(wallet.address)
      return balance
    }

    if (amnt === 30) {
      amount = 50;
      if (checkWallet.rows[0].seed === null) {
        return [400, "Please get a wallet first!"];
      } else {
        const check = await getBalance(userWallet).then(async r => {
          const wallet = ethers.utils.formatUnits(r, 18);
          if (wallet < amount.toString() - dis_value.toString()) {
            return [400, "You don't have enough money!"];
          } else {
            let senderWallet = new ethers.Wallet(seedDecrypted, bscProvider);
            const contract = new ethers.Contract(usdtContract, abi, senderWallet);
            const done = await contract.transfer(recieverAddress, ethers.utils.parseUnits(amount.toString(), 18))
              .then(() => {
                return [200, "Paid successfull"];
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
        const check = await getBalance(userWallet).then(async r => {
          const wallet = ethers.utils.formatUnits(r, 18);
          if (wallet < amount.toString() - dis_value.toString()) {
            return [400, "You don't have enough money!"];
          } else {
            let senderWallet = new ethers.Wallet(seedDecrypted, bscProvider);
            const contract = new ethers.Contract(usdtContract, abi, senderWallet);
            const done = await contract.transfer(recieverAddress, ethers.utils.parseUnits(amount.toString(), 18))
              .then(() => {
                return [200, "Paid successfull"];
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
