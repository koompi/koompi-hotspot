var ethers = require('ethers');
const router = require("express").Router();
const abi = require( "../../abi" );
var crypto = require('crypto');
// const authorization = require("../../middleware/authorization");

let privateKey = "0x9b26bba569eda989723404c80edf0e909c1543fe490d294de81ab2e5a457232b";
let usdtContract = "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd";
let senderAddress = "0xCe02312164c3B4b1acAEe0C24f37a8fB5c379993";
let recieverAddress = "0xEb068F884ba8F69180e0fc7e5225c26D317f9A38";

let bscProvider = new ethers.providers.JsonRpcProvider(
    'https://data-seed-prebsc-1-s1.binance.org:8545/', 
    {   
        name: 'binance', 
        chainId: 97 
    }
)



let senderWallet = new ethers.Wallet(privateKey, bscProvider);

// Send Token 
const contract = new ethers.Contract(usdtContract, abi, senderWallet);
// const howMuchTokens = ethers.utils.parseUnits('1', 18)
// async function init() {
//     await contract.transfer(recieverAddress, howMuchTokens) 
//     console.log(`Sent ${ethers.utils.formatUnits(howMuchTokens, 18)} USDT to address ${recieverAddress}`)
// }
// init()

// // Get History Trx
// let network = 'ropsten'
// let etherscanProvider = new ethers.providers.EtherscanProvider("binance");


// Get Histotry Trx
// etherscanProvider.getHistory(senderAddress).then((history) => {

//     history.forEach((tx) => {

//         console.log(tx);

//     })
//  });


// provider.getTransactionCount(senderAddress).then((transactionCount) => {
//     console.log("Total Transactions Ever Send: " + transactionCount);
// });

// var id = crypto.randomBytes(32).toString('hex');
// var seed = "0x"+id;


// var wallet = new ethers.Wallet(seed);
// console.log(wallet.address);
// Get Balance Token
const getBalance = async (wallet) => {
    // const abi = [
    //   {
    //     name: 'balanceOf',
    //     type: 'function',
    //     inputs: [
    //       {
    //         name: '_owner',
    //         type: 'address',
    //       },
    //     ],
    //     outputs: [
    //       {
    //         name: 'balance',
    //         type: 'uint256',
    //       },
    //     ],
    //     constant: true,
    //     payable: false,
    //   },
    // ];
    const contract = new ethers.Contract(riseContract, abi, wallet);
    const balance = await contract.balanceOf(wallet.address)
    return balance
}

// async function init() {
//     const receiverWallet = new ethers.Wallet(privateKey, bscProvider)
//     const receiverBalance = await getBalance(receiverWallet)
//     console.log('Reciever balance: ', ethers.utils.formatUnits(receiverBalance, 18) + ' USDT' + ' From', receiverWallet.address)  
// }
// init()



// let tx = {
//     to: "0xEb068F884ba8F69180e0fc7e5225c26D317f9A38",
//     value: ethers.utils.parseEther('0.1'),
// }


// let sendPromise = wallet.sendTransaction(tx);

// sendPromise.then((tx) => {
//     console.log(tx);
// })

// console.log(wallet),


// provider.getBalance("0xCe02312164c3B4b1acAEe0C24f37a8fB5c379993").then((balance) => {
//     // convert a currency unit from wei to ether
//     const balanceInEth = ethers.utils.formatEther(balance)
//     console.log(`balance: ${balanceInEth} ETH`)
//    }
// )

router.post("/payment", async (req, res) => {
    try {
        const {to, price } = req.body;

        await contract.transfer(to, ethers.utils.parseUnits(price, 18));
    
        res.status(200).json({
            to: to,
            value: price,
            success: true,
        })
    } catch (error) {
        res.status(400).json({ 
            message: `${error}`
        })
    }
})

router.get("/portfilio", async (req, res) => {
    const receiverWallet = new ethers.Wallet(privateKey, bscProvider)
    const receiverBalance = await getBalance(receiverWallet)
    res.status(200).json({ 
        from: receiverWallet.address,
        balance: ethers.utils.formatUnits(receiverBalance, 18),
        symbol: "USDT",
    })

})

module.exports = router;