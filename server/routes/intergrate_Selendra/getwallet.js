const router = require("express").Router();
const axios = require("axios");
const pool = require("../../db");
require("dotenv").config();
const authorization = require("../../middleware/authorization");
const confirmPass = require("../../utils/payment");
const AddressIsValid = require("../../utils/check_validwallet");
var ethers = require('ethers');
const abi = require( "../../abi.json" );
const CryptoJS = require('crypto-js');
const moment = require("moment");

//  Generate Wallet or Get wallet for userAcc
router.get("/get-wallet", authorization, async (req, res) => {
  try{
    let selendraProvider = new ethers.providers.JsonRpcProvider(
      'https://rpc.testnet.selendra.org/', 
    )
    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );

    // generate wallet address and seed
    const wallet = ethers.Wallet.createRandom(32).connect(selendraProvider);
    const seedEncrypted = CryptoJS.AES.encrypt(wallet.privateKey, "seed");
    if (checkWallet.rows[0].seed === null) {
      await pool.query(
        "UPDATE useraccount SET wallet = $2, seed = $3 WHERE id = $1",
        [req.user, wallet.address, seedEncrypted.toString()]
      )
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error!" });
      });
      res.status(200).json({ message: "You've got a selendra wallet." });
    } else {
      res.status(401).json({ message: "You already have a selendra wallet!" });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
})

router.post("/transfer", authorization, async (req, res) => {
  try {
    const { password, dest_wallet, asset, amount, memo } = req.body;
    let typeAsset = asset;

    const confirm = await confirmPass.confirm_pass(req, password);

    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );


    let riseContract = "0x3e6aE2b5D49D58cC8637a1A103e1B6d0B6378b8B";
    let selendraProvider = new ethers.providers.JsonRpcProvider(
      'https://rpc.testnet.selendra.org/', 
    )
    const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, "seed").toString(CryptoJS.enc.Utf8);

    const userWallet = new ethers.Wallet(seedDecrypted, selendraProvider);
    const getBalance = async (wallet) => {
      const contract = new ethers.Contract(riseContract, abi, selendraProvider);
      const balance = await contract.balanceOf(wallet.address)
      return balance
    }
    const isValidAddress = ethers.utils.getAddress(dest_wallet);

    let dateTime = new moment().utcOffset(+7, false).format();

    //=====================================check if user doesn't have a wallet=================
    if (!confirm) {
      res.status(401).json({ message: "Incorrect password!" });
    } else if (checkWallet.rows[0].seed === null) {
      res.status(400).json({ message: "Please get a wallet first!" });
    } else if(typeAsset === "RISE") {
      await getBalance(userWallet).then(async r => {
        const wallet = ethers.utils.formatUnits(r, 18);
        const balance = parseFloat(wallet);
        if (balance < amount) {
          res.status(400).json({ message: "You don't have enough token!" });
        } else {
          let senderWallet = new ethers.Wallet(seedDecrypted, selendraProvider);
          const contract = new ethers.Contract(riseContract, abi, senderWallet);

          let gas = {
            gasLimit: 100000,
            gasPrice: ethers.utils.parseUnits("100", "gwei"),
          }
          
          await contract.transfer(isValidAddress, ethers.utils.parseUnits(amount.toString(), 18), gas)
            .then(txObj => {
              // res.status(200).json({ 
              //   message: txObj
              //  });
              pool.query(
                "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
                [JSON.parse(JSON.stringify(txObj.hash)), JSON.parse(JSON.stringify(txObj.from)), isValidAddress, Number.parseFloat(amount).toFixed(3), "", "RISE", memo, dateTime]
              );
              res.status(200).json(JSON.parse(JSON.stringify({
                hash: txObj.hash,
                sender: txObj.from,
                destination: isValidAddress,
                amount: Number.parseFloat(amount).toFixed(3),
                fee: "",
                symbol: "RISE",
                memo: memo,
                datetime: dateTime
              })));
            })
            .catch(err => {
              console.log("selendra's bug with payment", err);
              res.status(501).json({ message: err.reason });
            });
          }
      })
      .catch(err => {
        console.error(err);
        res.status(501).json({ message: "Sorry, Something went wrong!" });
      });
    }
    else if(typeAsset === "SEL"){
      await selendraProvider.getBalance(checkWallet.rows[0].wallet).then(async r => {
        const wallet = ethers.utils.formatUnits(r, 18);
        const balance = parseFloat(wallet);
        if (balance < amount) {
          res.status(400).json({ message: "You don't have enough token!" });
        } else {
          // Create a transaction object
          let tx = {
            to: isValidAddress,
            value: ethers.utils.parseUnits(amount.toString(), 18),
            gasLimit: 100000,
            gasPrice: ethers.utils.parseUnits("100", "gwei"),
          }
          
          // Send a transaction
          userWallet.sendTransaction(tx)
          .then((txObj) => {
            // res.status(200).json({ message: txObj });
            pool.query(
              "INSERT INTO txhistory ( hash, sender, destination, amount, fee, symbol ,memo, datetime) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
              [JSON.parse(JSON.stringify(txObj.hash)), JSON.parse(JSON.stringify(txObj.from)), isValidAddress, Number.parseFloat(amount).toFixed(5), "", "SEL", memo, dateTime]
            );
            res.status(200).json(JSON.parse(JSON.stringify({
              hash: txObj.hash,
              sender: txObj.from,
              destination: isValidAddress,
              amount: Number.parseFloat(amount).toFixed(5),
              fee: "",
              symbol: "SEL",
              memo: memo,
              datetime: dateTime
            })));
          })
          .catch(err => {
            console.log("selendra's bug with payment", err);
            res.status(501).json({ message: err.reason });
          });

        }
      })
      .catch(err => {
        console.error(err);
        res.status(501).json({ message: "Sorry, Something went wrong!" });
      });
    }
    else{
      res.status(404).json({ message: "Sorry, Something went wrong!" });
    }
  } catch (err) {
    console.log("bug on get wallet function", err);
    res.status(500).json({ message: err.reason });
  }
});

// Porfilio user balance
// router.get("/portfolio", authorization, async (req, res) => {
//   try {
//     const checkWallet = await pool.query(
//       "SELECT * FROM useraccount WHERE id = $1",
//       [req.user]
//     );

//     let riseContract = "0x3e6aE2b5D49D58cC8637a1A103e1B6d0B6378b8B";
//     let selendraProvider = new ethers.providers.JsonRpcProvider(
//       'https://rpc.testnet.selendra.org/', 
//     );


    
//     if (checkWallet.rows[0].seed === null) {
//       res.status(401).json({ message: "Please get wallet first!" });
//     } else {
//       const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, "seed").toString(CryptoJS.enc.Utf8);
      
//       const userWallet = new ethers.Wallet(seedDecrypted, selendraProvider);
      
//       // Get Balance
//       const getBalance = async (wallet) => {
//         const contract = new ethers.Contract(riseContract, abi, selendraProvider);
//         const balance = await contract.balanceOf(wallet.address)
//         return balance
//       }
      
//       const userBalanceRise = await getBalance(userWallet);
      
//       // Get SEL Balance
//       const userBalanceSel = await selendraProvider.getBalance(checkWallet.rows[0].wallet);

//       await getBalance(userWallet).then(async r => {

//         await res.status(200).json([
//           {
//             id: "rise",
//             token: Number.parseFloat(ethers.utils.formatUnits(userBalanceRise, 18)).toFixed(3),
//             symbol: "RISE"
//           },
//           {
//             id: "sel",
//             token: Number.parseFloat(ethers.utils.formatUnits(userBalanceSel, 18)).toFixed(5),
//             symbol: "SEL"
//           }
//         ]);
//       })
//       .catch(err => {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error!" });
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error!" });
//   }
// });

// raw portfolio
router.get("/portfolio", authorization, async (req, res) => {
  try {
    const checkWallet = await pool.query(
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );

    let riseContract = "0x3e6aE2b5D49D58cC8637a1A103e1B6d0B6378b8B";
    let selendraProvider = new ethers.providers.JsonRpcProvider(
      'https://rpc.testnet.selendra.org/', 
    );


    
    if (checkWallet.rows[0].seed === null) {
      res.status(401).json({ message: "Please get wallet first!" });
    } else {
      const seedDecrypted = CryptoJS.AES.decrypt(checkWallet.rows[0].seed, "seed").toString(CryptoJS.enc.Utf8);
      
      const userWallet = new ethers.Wallet(seedDecrypted, selendraProvider);
    
      
      // Get SEL Balance
      const userBalanceSel = await selendraProvider.getBalance(checkWallet.rows[0].wallet);

      await res.status(200).json([
        // {
        //   id: "rise",
        //   token: Number.parseFloat(ethers.utils.formatUnits(userBalanceRise, 18)).toFixed(3),
        //   symbol: "RISE"
        // },
        {
          id: "sel",
          token: Number.parseFloat(ethers.utils.formatUnits(userBalanceSel, 18)).toFixed(5),
          symbol: "SEL"
        }
      ]);
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
      "SELECT * FROM useraccount WHERE id = $1",
      [req.user]
    );

    if (checkWallet.rows[0].seed === null) {
      res.status(401).json({ message: "Please get wallet first!" });
    } else {
        await pool.query(
          "SELECT * FROM txhistory WHERE sender = $1 OR destination = $1 ORDER BY datetime DESC",
          [checkWallet.rows[0].wallet]
        )
        .then(async r => {
          await res.status(200).json(JSON.parse(JSON.stringify(r.rows)));
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

// router.post("/test", authorization, async (req, res) => {
//   try {
//     const { password } = req.body;
//     // //////////////// check password ////////////////////////
//     const verify = await confirmPass.confirm_pass(req, password);
//     if (!verify) {
//       res.status(401).json({ message: "Incorrect password" });
//     } else {
//       console.log(verify);
//       res.status(200).json({ message: "correct pass" });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error!" });
//   }
// });
module.exports = router;
