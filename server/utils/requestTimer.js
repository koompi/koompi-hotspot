const {ApiPromise, WsProvider } = require('@polkadot/api');

module.exports = async function  requestTimer(res){
    
    let timer = false; 
    
    let ws;

    res.setTimeout(8000, async function () {  
      if (timer === false) {
        ws.disconnect();
        return res.status(400).json({ message: "Bad request timed out" });
      }
    })
   
 

    ws = new WsProvider('wss://rpc-mainnet.selendra.org');
    api = await ApiPromise.create({ provider: ws });
    
    timer = true;
    return api; 
}