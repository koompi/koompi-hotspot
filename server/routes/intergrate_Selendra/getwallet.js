const router = require("express").Router();
const axios = require("axios");
const pool = require("../../db");
require("dotenv").config();
const authorization = require("../../middleware/authorization");

//  Generate Wallet or Get wallet for userAcc
router.get("/get-wallet", authorization, async (req, res) => {
  try {
    const giveWallet = {
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
    };

    const checkWallet = await pool.query(
      "SELECT ids FROM useraccount WHERE id = $1",
      [req.user]
    );
    const checkFreeToken = await pool.query(
      "SELECT ids FROM useraccount WHERE ids != 'null'"
    );

    ///============================= free for firstly 1000 users to got 50 SEL from koompi ========================
    if (
      checkWallet.rows[0].ids === null &&
      checkFreeToken.rows.length <= 2000
    ) {
      axios
        .post("https://testnet-api.selendra.com/apis/v1/get-wallet", giveWallet)
        .then(async (respond) => {
          await pool.query(
            "UPDATE useraccount SET ids = $2, wallet = $3 WHERE id = $1",
            [req.user, respond.data.message.id, respond.data.message.wallet]
          );
          {
            await axios.post(
              "https://testnet-api.selendra.com/apis/v1/payment",
              {
                id: process.env.BANK_id,
                apikey: process.env.API_KEYs,
                apisec: process.env.API_SEC,
                destination: respond.data.message.wallet,
                asset_code: "SEL",
                amount: "100.002",
                memo: `Free balance: you are the user number ${
                  checkFreeToken.rows.length + 1
                }`,
              }
            );
          }
          res.status(200).json({
            message: "You recieve free 100 SEL to buy Wifi Hotspot.",
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Internal server error." });
        });

      ///============================= by default get the wallet ========================
    } else if (checkWallet.rows[0].ids === null) {
      axios
        .post("https://testnet-api.selendra.com/apis/v1/get-wallet", giveWallet)
        .then(async (respond) => {
          await pool.query(
            "UPDATE useraccount SET ids = $2, wallet = $3 WHERE id = $1",
            [req.user, respond.data.message.id, respond.data.message.wallet]
          );
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Internal server error!" });
        });
      res.status(200).json({ message: "You've got a selendra wallet." });
    } else {
      res.status(401).json({ message: "You already have a selendra wallet!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Transaction of SEL or payment
router.post("/payment", authorization, async (req, res) => {
  try {
    const { asset, plan, memo } = req.body;
    let amnt = parseInt(plan, 10);
    var amount = 0;

    //===============================convert days to token of selendara 30 days = 5000 riels = 50 SEL
    //================================================================= 365days = 60000 riels = 600 SEL    by:   1 SEL = 100 riel
    //============ amnt for push data to selendra as string
    //============ amount for checking condition

    // if (amnt !== 30 || amnt !== 365) {
    //   res.send("Please select plan!");
    // }
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
      amount: amnt,
      memo: memo,
    };

    //=====================================check if user doesn't have a wallet=================
    if (checkWallet.rows[0].ids === null) {
      res.status(401).json({ message: "Please get a wallet first!" });
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
          userPortfolio
        )
        .then(async (r) => {
          const wallet = await r.data.token;
          //=============================check if the money is enough or not=========
          //============================= 0.001 if for fee ==========================
          if (wallet < amount + 0.001) {
            res.status(401).json({ message: "You don't have enough money!" });
          } else {
            axios
              .post(
                "https://testnet-api.selendra.com/apis/v1/payment",
                userPayment
              )
              .then(async (re) => {
                res.status(200).json({ message: "Paid successfull." });
              })
              .catch((err) => {
                res.status(500).json({ message: "Internal server error" });
                console.error(err);
              });
          }
        })
        .catch((err) => {
          res.status(500).json({ message: "Internal server error" });
          console.error(err);
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!" });
  }
});

router.post("/transfer", authorization, async (req, res) => {
  try {
    const { dest_wallet, asset, amount, memo } = req.body;
    var amnt = parseInt(amount, 10);

    const checkWallet = await pool.query(
      "SELECT ids FROM useraccount WHERE id = $1",
      [req.user]
    );

    const checkDestWallet = await pool.query(
      "SELECT wallet FROM useraccount WHERE wallet = $1",
      [dest_wallet]
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
      destination: dest_wallet,
      asset_code: asset,
      amount: amount,
      memo: memo,
    };

    //=====================================check if user doesn't have a wallet=================
    if (checkWallet.rows[0].ids === null) {
      res.status(401).json({ message: "Please get a wallet first!" });
    } else if (checkDestWallet.rows.length === 0) {
      res
        .status(401)
        .json({ message: "Make sure that your friend has a wallet!" });
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
          userPortfolio
        )
        .then(async (r) => {
          const wallet = await r.data.token;

          //=============================check if the money is enough or not=========
          if (wallet < amnt + 0.001) {
            res.status(401).json({ message: "You don't have enough money!" });
          } else {
            axios
              .post(
                "https://testnet-api.selendra.com/apis/v1/payment",
                userPayment
              )
              .then(async (re) => {
                res.status(200).json({ message: "Transfer successfull." });
              })
              .catch((err) => {
                console.error(err);
                res.status(500).json({ message: "Interal server error!" });
              });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Interal server error" });
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!" });
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
      res.status(401).json({ message: "Please get wallet first!" });
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
          userPortfolio
        )
        .then(async (r) => {
          await res.status(200).json(r.data);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Internal server error!" });
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!" });
  }
});

// History user balance
router.get("/history", authorization, async (req, res) => {
  try {
    const checkWallet = await pool.query(
      "SELECT ids FROM useraccount WHERE id = $1",
      [req.user]
    );

    const userPortfolio = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
    };
    if (checkWallet.rows[0].ids === null) {
      res.status(401).json({ message: "Please get wallet first!" });
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/history-by-api",
          userPortfolio
        )
        .then(async (r) => {
          await res.status(200).json(JSON.parse(JSON.stringify(r.data)));
        })
        .catch((err) => {
          res.status(500).json({ message: "Internal server error" });
          console.error(err);
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!" });
  }
});

router.get("/test", authorization, async (req, res) => {
  try {
    let a;
    let b;
    const checkWallet = await pool.query(
      "SELECT ids FROM useraccount WHERE id = $1",
      [req.user]
    );
    const userPortfolio = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC,
    };
    axios
      .post(
        "https://testnet-api.selendra.com/apis/v1/history-by-api",
        userPortfolio
      )
      .then(async (r) => {
        a = await r.data[0].hash;
        res.send(a);
        // await res.status(200).send(JSON.parse(JSON.stringify(r.data)));
        // await res.status(200).send(r.data);
      })
      .catch((err) => {
        res.status(500).json({ message: "Internal server error!" });
        console.error(err);
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!" });
  }
});
module.exports = router;
