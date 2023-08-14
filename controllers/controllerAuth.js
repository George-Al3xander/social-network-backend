const bcrypt = require("bcryptjs");
const User = require("../models/modelUser.js");


const login_failed = (req,res) => {
    res.status(404).json({
        success: false,
        message: "Login failed"
     })
}

const login_success = (req,res) => {
    if(req.user) {        
            res.status(200).json({
            success: true,
            message: "Loged in",
            user: req.user,
            cookies: req.cookies
         })
    }
}

const logout = (req, res) => {
    req.logout();
    res.redirect(process.env.CLIENT_URI)
}

const login = (req, res) => {   
    User.find({email: req.body.email})
    .then(async (user) => {
        if(user.length != 0) {
            user = user[0];        
            try {
                if(await bcrypt.compare(req.body.password, user.password)) {
                    res.redirect("/auth/login/callback")                   
                } else {
                    res.status(401).json({msg: "Incorrect email or password"})
                }
           } catch (error) {
                res.status(401).json({msg: "Incorrect email or password"})
           }
        } else {
            res.status(401).json({msg: "Incorrect email or password"})
        }        
    })
    .catch((err) => res.json({err}))
}

const register = (req, res) => {
    const emailValid = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    const passwordValid = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    const blankValid = new RegExp(/\S/);
    try {
        if(req.body.email == undefined || req.body.name == undefined || req.body.password == undefined || !blankValid.test(req.body.email) || !blankValid.test(req.body.password)) {
            throw "Fill all the required fields"
        }          
        User.find({email: req.body.email})
        .then(async (dbUser) => {
            if(dbUser.length == 0) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                const user = {...req.body, password: hashedPassword}
                try {
                    if(emailValid.test(req.body.email) == false) {
                        throw "Enter a valid email"
                    } 
                    if(!blankValid.test(req.body.name.first) || !blankValid.test(req.body.name.last) ) {
                        throw "Name properties can't be a blank"
                    }
                    if(passwordValid.test(req.body.password) == false) {
                        throw "Password must contains six characters or more and has at least one lowercase and one uppercase alphabetical character or has at least one lowercase and one numeric character or has at least one uppercase and one numeric character. We’ve chosen to leave special characters out of this one."
                    } 
                    await new User(user).save()
                    .then(() => res.status(200).json({msg: "User saved"}))
                    .catch((err) => res.json(err));
                } catch (error) {
                    res.status(403).json({msg: error})
                }                
            } else {
                res.status(403).json({msg: "That user already exists"})
            }
        })  
    } catch (msg) {
        res.status(400).json({msg})
    }
}

module.exports = {
    login_failed,
    login_success,
    logout,
    login,
    register
}
