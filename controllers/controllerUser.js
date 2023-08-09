const bcrypt = require("bcryptjs");
const User = require("../models/modelUser.js");



const user_register = async (req, res) => {
    const emailValid = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    const passwordValid = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*_)(?!.*\W)(?!.* ).{8,16}$/);

    try {
        if(req.body.email == undefined || req.body.name == undefined || req.body.password == undefined) {
            throw "Fill all the required fields"
        }       
        User.find({email: req.body.email})
        .then(async (dbUser) => {
            if(dbUser.length == 0) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                const user = {...req.body, password: hashedPassword}
                try {
                    if(emailValid.test(req.body.email) == false) {
                        throw "You have entered an invalid email address!"
                    } 
                    if(passwordValid.test(req.body.password) == false) {
                        throw "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one underscore but no other special character, no space and it must be 8-16 characters long."
                    } 
                    await new User(user).save()
                    .then(() => res.status(200).json({msg: "User saved"}))
                    .catch((err) => res.sendStatus(500));
                } catch (error) {
                    res.status(403).json({msg: error})
                }                
            } else {
                res.status(403).json({msg: "That user already exists"})
            }
        })  
    } catch (error) {
        res.status(400).json({error})
    }
}

const user_login = async (req, res) => {
    User.find({email: req.body.email})
    .then(async (user) => {
        if(user.length != 0) {
        user = user[0];
        delete user.password
           try {
                if(await bcrypt.compare(req.body.password, user.password)) {                    
                        res.json(user)
                    
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

const user_search = (req, res) => {
    const searchKey = req.query.searchKey;
    const id = req.params.id;
    const status = req.query.status;
    let valid = new RegExp(`${searchKey.toLowerCase()}`);
    User.find()
    .then((users) => {   
        try {            
            let filtered;
            if(status == "full") {
                filtered = users.filter((user) => {  
                    return (
                    (
                        valid.test(user.username.toLowerCase()) == true || 
                        valid.test(user.name.first.toLowerCase()) == true || 
                        valid.test(user.name.last.toLowerCase()) == true ||
                        valid.test(user.name.first.toLowerCase() + " " + user.name.last.toLowerCase()) == true
                    ) 
                    && user._id.toString() !== id) 
                })
            } else {
                filtered = users.filter((user) => {  
                    return (valid.test(user.username.toLowerCase()) == true && user._id.toString() !== id) 
                })
            }
           
            const result = filtered.map((fil) => {
            return {name: fil.name, id: fil._id, username: fil.username}
            })
            res.json({data: result})
        } catch (error) {
            res.status(400).json({msg: "Something went wrong"})
        }
    })
    .catch(() => res.status(400).json({msg: "Something went wrong"}))
}

const user_edit = (req, res) => {    
    const id = req.params.id;
    const usernameValid = new RegExp(/^(?=(?:[0-9_]*[a-z]){3})[a-z0-9_]{5,}$/);
    const blankValid = new RegExp(/\S/);
    try {              
        User.find({username: req.body.username})
        .then(async (dbUser) => {
            if(dbUser.length == 0) {
                try {
                    if(usernameValid.test(req.body.username) == false && req.body.username != undefined) {
                        throw "Username must be at least 5-characters long(no less than 3 characters of that length must be letters), no spaces, and may consist only of lowercase letters, numbers, and underscores."
                    } 
                    if(req.body.name) {                        
                        if(req.body.name.first != undefined) {
                            if(blankValid.test(req.body.name.first) == false ) {
                                throw "First name cant't be a blank"
                            }
                        } 
                        if(req.body.name.last != undefined) {
                            if(blankValid.test(req.body.name.last) == false ) {
                                throw "last name cant't be a blank"
                            }
                        }
                    } 
                    const user = await User.findById(id);
                    User.findByIdAndUpdate(id, {
                        username: req.body.username ? req.body.username.trim() : user.username,
                        name: {
                            first: (req.body.name && req.body.name.first && blankValid.test(req.body.name.first)) ? req.body.name.first.trim() : user.name.first,
                            last: (req.body.name && req.body.name.last && blankValid.test(req.body.name.last)) ? req.body.name.last.trim() : user.name.last
                        }
                    })
                    .then(() => res.status(200).json({msg: "Changes saved"}))
                    .catch((err) => res.sendStatus(500));
                } catch (error) {
                    console.log(error)
                    res.status(403).json({msg: error})
                }                
            } else {
                res.status(403).json({msg: "Username already taken"})
            }
        })  
    } catch (error) {
        res.status(400).json({error})
    }

}

module.exports = {
    user_register,
    user_login,
    user_search,   
    user_edit
}
