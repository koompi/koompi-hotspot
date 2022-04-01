// const { spawn } = require('child_process');
// const router = require("express").Router();
// const authorization = require("../../middleware/authorization");


// router.post("/disconnect" , async (req, res) => {

//   const {session, username, ip} = req.body;


//   let package_template = ({session_id, user_name, ip}) => {
//     return `Acct-Session-Id=${session_id}
//     User-Name=${user_name}
//     NAS-IP-Address=${ip}`;
//   }
    
//   let packet = package_template({
//       session_id: session,
//       user_name: username,
//       ip: ip
//   })
  
//   let command_string = ({ip, port, password}) =>`echo "${packet}" | radclient -x ${ip}:${port} disconnect ${password}`
  
//   process = spawn('sh', ['-c', command_string({
//       ip: "10.1.2.120", 
//       port: "3791", 
//       password: "Testing123"
//   })]);
  
//   process.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//   });
  
//   process.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });
  
//   process.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
//   });
  
//   res.status(200).json({ message: "Disconnected RadClient!" });
// })

// module.exports = router;
