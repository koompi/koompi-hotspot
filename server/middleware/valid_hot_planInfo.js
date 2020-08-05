module.exports=(req,res,next)=>{
    const{
        username,
        password,
        selectUser,
        selectPlan
    }=req.body;
    if(req.path==="/hotspot"){
        if (![username, password,selectUser,selectPlan].every(Boolean)) {
          return res.status(401).json("Missing Credentials");
        } 
    }
    next();
};