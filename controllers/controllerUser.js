const bcrypt = require("bcryptjs");
const User = require("../models/modelUser.js");
const Comment = require("../models/modelComment.js");
const Post = require("../models/modelPost.js");
const jwt = require("jsonwebtoken");


const user_search = (req, res) => {
    const searchKey = req.query.searchKey;    
    const tokenUser = jwt.decode(req.token, process.env.SECRET_KEY).user; 
    let valid = new RegExp(`${searchKey.toLowerCase()}`);
    // if(req.user) {
        User.find()
        .then((users) => {   
            try {            
                let filtered = users.filter((user) => {  
                return ((                   
                        valid.test(user.name.first.toLowerCase()) == true || 
                        valid.test(user.name.last.toLowerCase()) == true ||
                        valid.test(user.name.first.toLowerCase() + " " + user.name.last.toLowerCase()) == true
                        ) 
                        && user._id.toString() !== tokenUser._id) 
                    })  
                const result = filtered.map((fil) => {
                    let obj = {name: fil.name, id: fil._id}
                    if(fil.avatar) {
                        obj = {...obj, avatar: fil.avatar}
                    }                    
                    return obj
                })
                res.json({data: result})
            } catch (error) {
                res.status(400).json({msg: "Something went wrong"})
            }
        })
        .catch(() => res.status(400).json({msg: "Something went wrong"}))
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // }    
}

const user_edit = (req, res) => {    
    const emailValid = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    const passwordValid = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    const valid = new RegExp(/\S/);
    const tokenUser = jwt.decode(req.token, process.env.SECRET_KEY).user; 
    // if(req.user) {
        try {
            User.findById(tokenUser._id)
            .then(async (user) => {                
                //if(await bcrypt.compare(req.body.password, user.password)) {   
                    // if(req.body.password && !passwordValid.test(req.body.password)) {
                    //     throw
                    // }
                    if(req.body.email && !emailValid.test(req.body.email)) {
                        throw "Invalid email"
                    }
                    if(req.body.name) {
                        if(req.body.name.first && !valid.test(req.body.name.first)) {
                            throw "First name can't be a blank"
                        }
                        if(req.body.name.last && !valid.test(req.body.name.last)) {
                            throw "Last name can't be a blank"
                        }
                    }
                    let updateObj = req.body;
                    delete updateObj.password
                    
                    User.findByIdAndUpdate(user._id, {
                        $set: updateObj
                    },  {new: true})
                    .then((user) => {
                        let newUser = {
                            name: user.name,
                            id: user._id,
                            avatar: user.avatar
                        }
                        if(user.avatar) {
                            newUser = {...newUser, avatar: user.avatar}
                        }
                        Post.updateMany({"user.id" : user._id},
                        {$set: {user: newUser}}                    
                        ).then(() => {
                            Comment.updateMany({"user.id" : user._id},
                            {$set: {user: newUser}})
                            .then(() => {
                                res.json({msg: "User updated"})
                            })
                            .catch(() => res.status(400).json({msg: "Error"}))
                            })
                        .catch(() => res.status(400).json({msg: "Error"}))
                })
                .catch(() => res.status(400).json({msg: "Error"}))
                // } else {
                //     res.status(401).json({msg: "Incorrect password"})
                // }
            })
            
       } catch (error) {
            res.status(401).json({msg: error})
       }        
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // }

}


const user_get = (req, res) => {
    const id = req.query.id;    
    
    // if(req.user) {
        User.findById(id)
        .then((user) => {   
            delete user.password
            res.json({user})
        })
        .catch(() => res.status(400).json({msg: "Invalid user ID"}))
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // }
}


const user_get_current = (req, res) => {
    const tokenUser = jwt.decode(req.token, process.env.SECRET_KEY).user; 
    User.findById(tokenUser._id)
    .then((user) => {
        delete user.password;
        res.json({user})   
    })
    .catch(() => res.status(400).json({msg: "Invalid user ID"}))
}   


module.exports = {    
    user_search,   
    user_edit,
    user_get,
    user_get_current
}
