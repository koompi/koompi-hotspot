const router = require("express").Router();
const axios = require("axios");
const pool = require("../../db");
require("dotenv").config();
const authorization = require("../../middleware/authorization");
const confirmPass = require("../../utils/payment");
const AddressIsValid = require("../../utils/check_validwallet");
var ethers = require('ethers');
const abi = require( "../../abi" );

//  Generate Wallet or Get wallet for userAcc
router.get("/get-wallet", authorization, async (req, res) => {
  try {
    const giveWallet = {
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC
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
        .then(async respond => {
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
                amount: "100.0002",
                memo: `Free balance: you are the user number ${checkFreeToken
                  .rows.length + 1}`
              }
            );
          }
          res.status(200).json({
            message: "You recieve free 100 SEL to buy Wifi Hotspot."
          });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: "Internal server error." });
        });

      ///============================= by default get the wallet ========================
    } else if (checkWallet.rows[0].ids === null) {
      axios
        .post("https://testnet-api.selendra.com/apis/v1/get-wallet", giveWallet)
        .then(async respond => {
          await pool.query(
            "UPDATE useraccount SET ids = $2, wallet = $3 WHERE id = $1",
            [req.user, respond.data.message.id, respond.data.message.wallet]
          );
        })
        .catch(err => {
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
    let amnt = parseFloat(plan, 10);
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

    //=====================================check if user doesn't have a wallet=================
    if (checkWallet.rows[0].ids === null) {
      res.status(401).json({ message: "Please get a wallet first!" });
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
          userPortfolio
        )
        .then(async r => {
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
              .then(async re => {
                res.status(200).json({ message: "Paid successfull." });
              })
              .catch(err => {
                res.status(500).json({ message: "Internal server error" });
                console.error(err);
              });
          }
        })
        .catch(err => {
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
    const { password, dest_wallet, asset, amount, memo } = req.body;

    const isValidAddress = AddressIsValid.isValidAddressPolkadotAddress(
      dest_wallet
    );
    if (!isValidAddress) {
      return res
        .status(400)
        .json({ message: "Please fill in a valid address!" });
    }

    var amnt = parseFloat(amount, 10);
    //////////////// check password ////////////////////////
    const confirm = await confirmPass.confirm_pass(req, password);

    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
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
      destination: dest_wallet,
      asset_code: asset,
      amount: amount,
      memo: memo
    };

    //=====================================check if user doesn't have a wallet=================
    if (!confirm) {
      res.status(401).json({ message: "Incorrect password!" });
    } else if (checkWallet.rows[0].ids === null) {
      res.status(400).json({ message: "Please get a wallet first!" });
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
          userPortfolio
        )
        .then(async r => {
          const wallet = await r.data.token;

          //=============================check if the money is enough or not=========
          if (wallet < amnt + 0.0001) {
            res.status(400).json({ message: "You don't have enough money!" });
          } else {
            axios
              .post(
                "https://testnet-api.selendra.com/apis/v1/payment",
                userPayment
              )
              .then(async () => {
                res.status(200).json({ message: "Transfer successfull." });
              })
              .catch(err => {
                console.log("Error on transfer", err);
                res.status(500).json({ message: "Interal server error!" });
              });
          }
        })
        .catch(err => {
          console.log("error with portfolio", err);
          res.status(500).json({ message: "Interal server error" });
        });
    }
  } catch (err) {
    console.log("bug on get wallet function", err);
    res.status(500).json({ message: "Server error!" });
  }
});

// Porfilio user balance
router.get("/portfolio", authorization, async (req, res) => {
  try {
    const checkWallet = await pool.query(
      "SELECT ids FROM useraccount WHERE id = $1",
      [req.user]
    );
    let privateKey = "0x9b26bba569eda989723404c80edf0e909c1543fe490d294de81ab2e5a457232b";
    let usdtContract = "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd";
    let bscProvider = new ethers.providers.JsonRpcProvider(
      'https://data-seed-prebsc-1-s1.binance.org:8545/', 
      {   
          name: 'binance', 
          chainId: 97 
      }
    );
    const receiverWallet = new ethers.Wallet(privateKey, bscProvider);
    const getBalance = async (wallet) => {
      const contract = new ethers.Contract(usdtContract, abi, wallet);
      const balance = await contract.balanceOf(wallet.address)
      return balance
      
    }

    const userPortfolio = {
      id: checkWallet.rows[0].ids,
      apikey: process.env.API_KEYs,
      apisec: process.env.API_SEC
    };
    if (checkWallet.rows[0].ids === null) {
      res.status(401).json({ message: "Please get wallet first!" });
    } else {
      const receiverBalance = await getBalance(receiverWallet)
      await getBalance(receiverWallet).then(async r => {
        await res.status(200).json({
          token: ethers.utils.formatUnits(receiverBalance, 18),
          symbol: "USDT"
        }
        );
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error!" });
      });
      // axios
      //   .post(
      //     "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
      //     userPortfolio
      //   )
      //   .then(async r => {
      //     await res.status(200).json(r.data);
      //   })
      //   .catch(err => {
      //     console.error(err);
      //     res.status(500).json({ message: "Internal server error!" });
      //   });
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
      apisec: process.env.API_SEC
    };
    if (checkWallet.rows[0].ids === null) {
      res.status(401).json({ message: "Please get wallet first!" });
    } else {
      axios
        .post(
          "https://testnet-api.selendra.com/apis/v1/history-by-api",
          userPortfolio
        )
        .then(async r => {
          await res.status(200).json(JSON.parse(JSON.stringify(r.data)));
        })
        .catch(err => {
          res.status(500).json({ message: "Internal server error" });
          console.error(err);
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!" });
  }
});

router.post("/test", authorization, async (req, res) => {
  try {
    const { password } = req.body;
    // //////////////// check password ////////////////////////
    const verify = await confirmPass.confirm_pass(req, password);
    if (!verify) {
      res.status(401).json({ message: "Incorrect password" });
    } else {
      console.log(verify);
      res.status(200).json({ message: "correct pass" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!" });
  }
});
module.exports = router;
