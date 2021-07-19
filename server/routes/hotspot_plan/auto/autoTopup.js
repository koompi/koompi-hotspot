const axios = require("axios");
const moment = require("moment");
const pool = require("../../../db");
require("dotenv").config({ path: `../../../.env` });

const payment = async (req, asset, plan, memo) => {
  try {
    let amnt = parseFloat(plan, 10);
    var amount = 0;

    //===============================convert days to token of selendara 30 days = 5000 riels = 50 SEL
    //================================================================= 365days = 60000 riels = 600 SEL    by:   1 SEL = 100 riel
    //============ amnt for push data to selendra as string
    //============ amount for checking condition

    if (amnt === 30) {
      amnt = "50";
      amount = 50;
    }
    if (amnt === 365) {
      amnt = "600";
      amount = 600;
    }

    const checkWallet = await pool.query(
      "SELECT ids FROM useraccount WHERE id = $1",
      [req]
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
      amount: amnt,
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
          if (wallet < amount + 0.0001) {
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

module.exports = { autoRenew };
