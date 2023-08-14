const bcrypt = require("bcryptjs");
const User = require("../models/modelUser.js");

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
    const emailValid = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    const passwordValid = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    const valid = new RegExp(/\S/);
    if(req.user) {
        try {
            User.findOne({email: req.user.email})
            .then(async (user) => {                
                if(await bcrypt.compare(req.body.password, user.password)) {   
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
                    console.log(updateObj)
                    User.findByIdAndUpdate(user._id, {
                        $set:
                        // {
                        //     name: {
                        //         first: req.body.name.first != user.name.first ? req.body.name.first : user.name.first,
                        //         last: req.body.name.last != user.name.last ? req.body.name.last : user.name.last
                        //     },
                        //     email: req.body.email != user.email ? req.body.email : user.email,
                        //     avatar: req.body.avatar != user.avatar ? req.body.avatar : user.avatar,
                        // }
                        updateObj
                    })
                .then(() => res.json({msg: "User updated"}))
                .catch(() => res.status(400).json({msg: "Error"}))
                                 
                } else {
                    res.status(401).json({msg: "Incorrect password"})
                }
            })
            
       } catch (error) {
            res.status(401).json({msg: "Incorrect email or password"})
       }        
    } else {
        res.status(403).json({msg: "No user signed"})
    }

}

module.exports = {    
    user_search,   
    user_edit
}
