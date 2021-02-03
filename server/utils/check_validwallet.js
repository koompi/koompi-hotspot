const axios = require("axios");
require("dotenv").config();
const pool = require("../../db");


const checkBalance = (usr,res,req)=>{
    const balance;
    try{
    const checkWallet = await pool.query(
        "SELECT ids FROM useraccount WHERE id = $1",
        [usr]
    );

    const userPortfolio = {
        id: checkWallet.rows[0].ids,
        apikey: process.env.API_KEYs,
        apisec: process.env.API_SEC,
    };
    if (checkWallet.rows[0].ids === null) {
        res.status(401).json({message:"Please get wallet first!"});
    } else {
        axios
            .post(
                "https://testnet-api.selendra.com/apis/v1/portforlio-by-api",
                userPortfolio
            )
            .then((r) => {
                balance=JSON.parse(JSON.stringify(r.data.body.data.balance));
            })
            .catch((err) => {
                console.error(err);
            });
    }
} catch (err) {
    console.error(err);
    res.status(500).json({message:"Server error!"});
}
}

module.exports={checkBalance};