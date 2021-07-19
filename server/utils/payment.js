const axios = require("axios");
const pool = require("../db");
require("dotenv").config();
const bcrypt = require("bcrypt");

const payment = async (req, asset, plan, memo) => {
  try {
    let amnt = parseFloat(plan, 10);
    var amount = 0;

    //===============================convert days to token of selendara 30 days = 5000 riels = 50 SEL
    //================================================================= 365days = 60000 riels = 600 SEL    by:   1 SEL = 100 riel
    //============ amount for checking condition

    if (amnt === 30) {
      amount = 50;
    }
    if (amnt === 365) {
      amount = 600;
    }

    // check if admin allowed and set set discount
    const discount = await checkDiscount(req);
    var dis_value = 0;
    if (discount[1] !== 0) {
      dis_value = (amount * discount[1]) / 100;
    } else {
      dis_value = 0;
    }

    const checkWallet = await pool.query(
      "SELECT ids FROM useraccount WHERE id = $1",
      [req.user]
    );

    const userPortfolio = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC
    };

    const userPayment = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
      destination: process.env.BANK_wallet,
      asset_code: asset,
      amount: `${amount - dis_value}`,
      memo: memo
    };

    // =====================================check if user doesn't have a wallet=================
    if (checkWallet.rows[0].ids === null) {
      return [400, "Please get a wallet first!"];
    } else {
      const check = await axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
          userPortfolio
        )
        .then(async r => {
          const wallet = await r.data.token;
          //=============================check if the money is enough or not=========
          //============================= 0.0001 if for fee ==========================
          if (wallet < amount - dis_value + 0.0001) {
            return [400, "You don't have enough money!"];
          } else {
            const done = await axios
              .post(
                "https://testnet-api.selendra.com/apis/v1/payment",
                userPayment
              )
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
          console.log("selendra's bug with payment portfolio\n",err.message,'\n',err.response.status,err.response.statusText);
          return [501, "Selendra server is in maintenance."];
        });
      return check;
    }
  } catch (err) {
    console.log("Payment error", err);
    return [500, "Server error!"];
  }
};

const checking = async (req, plan) => {
  try {
    let amnt = parseFloat(plan, 10);
    var amount = 0;

    if (amnt === 30) {
      amount = 50;
    }
    if (amnt === 365) {
      amount = 600;
    }

    // check if admin allowed and set set discount
    const discount = await checkDiscount(req);
    var dis_value = 0;
    if (discount[1] !== 0) {
      dis_value = (amount * discount[1]) / 100;
    } else {
      dis_value = 0;
    }

    const checkWallet = await pool.query(
      "SELECT ids FROM useraccount WHERE id = $1",
      [req.user]
    );

    const userPortfolio = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC
    };
    if (checkWallet.rows[0].ids === null) {
      console.log("get wallet first.");
      return [(status = 200), (message = "Please get a wallet first!")];
    } else {
      const data = await axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
          userPortfolio
        )

        .then(async r => {
          const wallet = await r.data.token;
          //=============================check if the money is enough or not=========
          //============================= 0.001 if for fee ==========================
          if (wallet < amount - dis_value + 0.0001) {
            return [401, "You don't have enough money!"];
          }
        })
        .catch(err => {
          console.log("internal! with portfolio", err);
          return [501, "Selendra server error."];
        });
      return data;
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
