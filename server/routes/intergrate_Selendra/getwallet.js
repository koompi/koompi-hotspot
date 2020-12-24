const router = require("express").Router();
const axios = require("axios");
const pool = require("../../db");
require("dotenv").config();
const authorization = require("../../middleware/authorization");

// const chkBalance = require("../../utils/check_validwallet");

//  Generate Wallet or Get wallet for userAcc
router.get("/get-wallet", authorization, async (req, res) => {
  try {
    const giveWallet = {
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
    };

    const checkWallet = await pool.query(
      "SELECT ids FROM users_email WHERE id = $1",
      [req.user]
    );

    if (checkWallet.rows[0].ids === null) {
      axios
        .post("https://testnet-api.selendra.com/apis/v1/get-wallet", giveWallet)
        .then(async (res) => {
          await pool.query(
            "UPDATE users_email SET ids = $2, wallet = $3 WHERE id = $1",
            [req.user, res.data.message.id, res.data.message.wallet]
          );
        })
        .catch((err) => {
          console.error(err);
          res.send("server error on selendra.");
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
router.post("/payment", authorization, async (req, res) => {
  try {
    const { asset, amount, memo } = req.body;
    var amnt = parseInt(amount, 10);
    const checkWallet = await pool.query(
      "SELECT ids FROM users_email WHERE id = $1",
      [req.user]
    );

    const userPortfolio = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
    };

    const userPayment = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
      destination: process.env.BANK_wallet,
      asset_code: asset,
      amount: amount,
      memo: memo,
    };

    //=====================================check if user doesn't have a wallet=================
    if (checkWallet.rows[0].ids === null) {
      res.send("please get a wallet first!");
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
          userPortfolio
        )
        .then(async (r) => {
          wallet = await JSON.parse(JSON.stringify(r.data.body.data.balance));
          if (wallet < amnt) {
            res.send("You don't have anough money!");
          } else {
            axios
              .post(
                "https://testnet-api.selendra.com/apis/v1/payment",
                userPayment
              )
              .then(async (re) => {
                await console.log(r.data);
                res.send("Paid successfull.");
              })
              .catch((err) => {
                console.error(err);
              });
          }
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

// Porfilio user balance
router.get("/portfolio", authorization, async (req, res) => {
  try {
    const checkWallet = await pool.query(
      "SELECT ids FROM users_email WHERE id = $1",
      [req.user]
    );

    const userPortfolio = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
    };
    if (checkWallet.rows[0].ids === null) {
      res.send("Please get wallet first!");
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
          userPortfolio
        )
        .then(async (r) => {
          // await r.send(JSON.parse(JSON.stringify(r.data)));
          await res.send(JSON.parse(JSON.stringify(r.data.body)));
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
// Porfilio user balance
router.get("/history", authorization, async (req, res) => {
  try {
    const checkWallet = await pool.query(
      "SELECT ids FROM users_email WHERE id = $1",
      [req.user]
    );

    const userPortfolio = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
    };
    if (checkWallet.rows[0].ids === null) {
      res.send("Please get wallet first!");
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/history-by-api",
          userPortfolio
        )
        .then(async (r) => {
          await res.send(JSON.parse(JSON.stringify(r.data)));
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

router.get("/testing", authorization, async (req, res) => {
  try {
    var wallet = 0;
    const { amount } = req.body;
    var amnt = parseInt(amount, 10);
    const checkWallet = await pool.query(
      "SELECT ids FROM users_email WHERE id = $1",
      [req.user]
    );

    const userPortfolio = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
    };
    if (checkWallet.rows[0].ids === null) {
      res.send("Please get wallet first!");
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
          userPortfolio
        )
        .then(async (r) => {
          wallet = JSON.parse(JSON.stringify(r.data.body.data.balance));
          if (wallet < amnt) {
            res.send(wallet);
          } else {
            res.send("welcome");
          }
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
