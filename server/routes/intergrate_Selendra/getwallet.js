const router = require("express").Router();
const axios = require("axios");
const pool = require("../../db");
require("dotenv").config();

//  Generate Wallet or Get wallet for userAcc
router.post("/get-wallet", async (req, res) => {
  try {
    const giveWallet = {
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
    };
    const { email } = req.body;
    const checkWallet = await pool.query(
      "SELECT ids FROM users_email WHERE email = $1",
      [email]
    );

    if (checkWallet.rows[0].ids === null) {
      axios
        .post("https://testnet-api.selendra.com/apis/v1/get-wallet", giveWallet)
        .then(async (res) => {
          await pool.query(
            "UPDATE users_email SET ids = $2, wallet = $3 WHERE email=$1",
            [email, res.data.message.id, res.data.message.wallet]
          );
        })
        .catch((err) => {
          console.error(err);
        });
      res.send("You got a Selendra Wallet.");
    } else {
      res.send("You already have a Selendra Wallet!");
    }
  } catch (err) {
    console.error(err);
  }
});

// Transaction of RSEL or payment
router.post("/transaction", async (req, res) => {
  try {
    const { email, destination, asset, amount, memo } = req.body;
    const checkWallet = await pool.query(
      "SELECT ids FROM users_email WHERE email = $1",
      [email]
    );
    const userTransaction = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
      destination: destination,
      asset_code: asset,
      amount: amount,
      memo: memo,
    };
    if (checkWallet.rows[0].ids === null) {
      res.send("Get wallet first!");
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/payment",
          userTransaction
        )
        .then((r) => {
          res.send(r.data.message);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error!");
  }
});

module.exports = router;
