const axios = require("axios");
const moment = require("moment");
const pool = require("../../../db");

require("dotenv").config({ path: `../../../.env` });

const autopayment = async (id, asset, plan, memo) => {
  try {
    let amnt = parseInt(plan, 10);
    var amount = 0;

    if (amnt === 30) {
      amnt = "50";
      amount = 50;
    }
    if (amnt === 365) {
      amnt = "600";
      amount = 600;
    }

    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [id]
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
            return [400, `${id} don't have enough money!`];
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
          console.log("selendra's bug with payment portfolio", err);
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
      "SELECT * FROM  radcheck WHERE status = false and auto = false"
    );

    let n = result.rows.length;
    if (n > 0) {
      for (i = 0; i < n; i++) {
        const detail = await pool.query(
          "SELECT * FROM  radgroupcheck WHERE attribute = 'Expiration' and acc_id = $1",
          [result.rows[0].acc_id]
        );

        let a = detail.rows[0].groupname;
        let val = a.lastIndexOf("_");
        let value = a.slice(val + 1, a.length);

        /////////// check balance with payment /////////////////////////
        const paid = await autopayment(
          result.rows[0].acc_id,
          "SEL",
          value,
          "Renew plan."
        );
        if (paid[0] === 200) {
          const due = moment()
            .add(value, "days")
            .format("YYYY MMM DD");

          await pool.query(
            "UPDATE radgroupcheck SET value = $1 WHERE acc_id = $2",
            [due, result.rows[0].acc_id]
          );
          await pool.query(
            "UPDATE radcheck SET status = true, WHERE acc_id = $1",
            [result.rows[0].acc_id]
          );

          // this is for update status on database
        }
      }
    }
  } catch (error) {
    console.log("error on auto topup", error);
  }
};

// autoRenew();
module.exports = { autoRenew };
