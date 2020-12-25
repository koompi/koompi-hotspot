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

// Transaction of SEL or payment
router.post("/payment", authorization, async (req, res) => {
  try {
    const { asset, amount, memo } = req.body;
    var amnt = parseInt(amount, 10);

    //===============================convert days to token of selendara 30 days = 5000 riels = 50 SEL
    //================================================================= 365days = 60000 riels = 600 SEL    by:   1 SEL = 100 riel
    if (amnt === 30) {
      amnt = 50;
    }
    if (amnt === 365) {
      amnt = 600;
    }

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
          const wallet = await JSON.parse(
            JSON.stringify(r.data.body.data.balance)
          );
          //=============================check if the money is enough or not=========
          if (wallet < amnt) {
            res.send("You don't have anough money!");
          } else {
            axios
              .post(
                "https://testnet-api.selendra.com/apis/v1/payment",
                userPayment
              )
              .then(async (re) => {
                res.status(200).send("Paid successfull.");
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
          // await res.send(JSON.parse(JSON.stringify(r.data.body)));
          await res.send(r.data.data);
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

router.post("/transfer", authorization, async (req, res) => {
  try {
    const { dest_email, asset, amount, memo } = req.body;
    var amnt = parseInt(amount, 10);

    const checkDestWallet = await pool.query(
      "SELECT wallet FROM users_email WHERE email = $1",
      [dest_email]
    );
    const checkWallet = await pool.query(
      "SELECT ids FROM users_email WHERE id = $1",
      [req.user]
    );

    const userPortfolio = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
    };

    //====================check is destination have an acc or not===============
    if (checkDestWallet.rows.length === 0) {
      res.send("Make sure that your friend has an account KOOMPI hotspot!");
    }

    // ====================check is acc destination have a selendra's wallet or not
    else if (checkDestWallet.rows[0].wallet === null) {
      res.send("Make sure your friend has a wallet!");
    }

    //======================check if user doesn't have a wallet=================
    else if (checkWallet.rows[0].ids === null) {
      res.send("Please get a wallet first!");
    } else {
      const userTransfer = {
        id: checkWallet.rows[0].ids,
        apikey: process.env.API_KEYs,
        apisec: process.env.API_SEC,
        destination: checkDestWallet.rows[0].wallet,
        asset_code: asset,
        amount: amount,
        memo: memo,
      };
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
          userPortfolio
        )
        .then(async (r) => {
          const wallet = await JSON.parse(
            JSON.stringify(r.data.body.data.balance)
          );
          //=================check wallet has money or not======================
          if (wallet < amnt) {
            res.send("You don't have enough money!");
          } else {
            axios
              .post(
                "https://testnet-api.selendra.com/apis/v1/payment",
                userTransfer
              )
              .then(async (re) => {
                res.status(200).send("Transfer successfull.");
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

router.post("/testing", async (req, res) => {
  try {
    const { amount } = req.body;
    var amnt = parseInt(amount, 10);

    if (amnt === 30) {
      amnt = 50;
    }
    if (amnt === 365) {
      amnt = 600;
    }
    res.status(200).send(`${amnt}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error!");
  }
});
module.exports = router;
