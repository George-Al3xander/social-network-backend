const jwt = require("jsonwebtoken");

const verifyToken = (req, res,next) => {    
    //const id = req.params.id;
    const bearerHeader = req.headers["authorization"];    
    if(typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken
        //const tokenUser = jwt.decode(bearerToken, process.env.SECRET_KEY);
        //console.log(tokenUser)
        //MUST BE RETURNED !!!!
        //Checks if user uses his token
        //if(tokenUser.user._id != id) {
           // res.status(498).json({msg: "Invalid token"})
        //} else {            
        jwt.verify(bearerToken, process.env.SECRET_KEY, async (err, authData) => {
               if(err) {                   
                   res.status(498).json({msg: "Invalid token"})
                } else {                    
                    //req.user = tokenUser.user
                    req.session
                    next();
               }
            })
        //}

    } else {
        res.status(498).json({msg: "Invalid token"})
    }    
  }


  module.exports = verifyToken