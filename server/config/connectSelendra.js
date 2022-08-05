const {ApiPromise, WsProvider } = require('@polkadot/api');

let api;

const connectSelendra = async () => {

  let timer = false; 
  let ws;
  
  setTimeout( function () {  
    try{
      if (timer === false) {
        ws.disconnect();
        throw Error("Timeout");
      }
    }catch(err){
      console.log(err)
    }
   
  },8000)

  ws = new WsProvider('wss://rpc-mainnet.selendra.org');
  api = await ApiPromise.create({ provider: ws });
  console.log("Connected to Selendra");
  timer = true;
  // await api.isReady
  // console.log(api.genesisHash.toHex())
}

const getApi = () => {
  return api;
}


module.exports = {connectSelendra, getApi, api};
// timer = true;


// module.exports = async function  requestTimer(res){
    
//     let timer = false; 
    
//     let ws;

//     res.setTimeout(8000, async function () {  
//       if (timer === false) {
//         ws.disconnect();
//         return res.status(400).json({ message: "Bad request timed out" });
//       }
//     })
   
 

//     ws = new WsProvider('wss://rpc-mainnet.selendra.org');
//     api = await ApiPromise.create({ provider: ws });
    
//     timer = true;
//     return api; 
// }