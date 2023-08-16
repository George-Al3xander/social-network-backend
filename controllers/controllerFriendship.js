const Friendship = require("../models/modelFriendship")
const User = require("../models/modelUser")

const send_request = (req, res) => {
    if(req.user) {
        const friendId = req.body.friendId;        
        User.findById(friendId)
        .then((user) => {
            Friendship.findOne({participants: {$all: [req.user._id, friendId]}})
            .then((rel) => {
               if(rel == null) {
                new Friendship({status: false, participants: [req.user._id, friendId]}).save()
                .then(() => res.json({msg: "Request sent"}))
                .catch(() => res.status(400).json({msg: "Error"}))
               } else {
                res.status(409).json("Request already exists")
               }
            })
            
                
        })
        .catch(() => res.status(400).json({msg: "Invalid user id"}))
    } else {
        res.status(403).json({msg: "No user signed"})
    } 
}

const accept_request = (req, res) => {
    const id = req.body.friendId;
    if(req.user) {
        Friendship.findOne({participants: {$all: [req.user._id, id]}})
        .then((relation) => {
            if(relation.participants[1] != req.user._id) {
                res.status(403).json({msg: "Access denied"})                
            } else {
                Friendship.findByIdAndUpdate(relation._id, {
                    $set: {
                        status: true
                    }
                })
                .then(() => res.json({msg: "Friendship accepted"}))
                .catch(() => res.status(400).json({msg: "Error"}))
            }
        })
        .catch(() => res.status(400).json({msg: "Invalid relation id"}))
    } else {
        res.status(403).json({msg: "No user signed"})
    } 
}

const decline_request = (req, res) => {
    const id = req.body.friendId;
    if(req.user) {
        Friendship.findOne({participants: {$all: [req.user._id, id]}})
        .then((relation) => {
            if(relation.participants.includes(req.user._id)) {
                Friendship.findByIdAndDelete(relation._id)
                .then(() => res.json({msg: "Friendship denied"}))
                .catch(() => res.status(400).json({msg: "Error"}))
            } else {
                res.status(403).json({msg: "Access denied"})  
            }
        })
        .catch(() => res.status(400).json({msg: "Invalid relation id"}))
    } else {
        res.status(403).json({msg: "No user signed"})
    }
}

const get_status = (req, res) => {
    const id = req.query.userId;
    if(req.user) {
        Friendship.findOne({participants: {$all: [req.user._id, id]}})
        .then((status) => {
            if(status) {
                let sentByUser = false;
                if(status.participants[0] == req.user._id) {
                    sentByUser = true;
                }
                res.json({data: {status: status.status, sentByUser}})
            } else {
                res.json({data: {status}})
            }
        })
        .catch((err) => res.status(400).json({msg: "Invalid user ID"}))
    } else {
        res.status(403).json({msg: "No user signed"})
    }
}

const get_requests = (req, res) => {
    if(req.user) {
        Friendship.find({status: false,participants: {$in: [req.user._id]}})
        .then(async (results) => {
            let sent = results.filter((request) => {
                return request.participants[0] == req.user._id
            }) 

            sent = sent.map(async(send) => {
                const user = await User.findById(send.participants[1])
                let obj = {name: user.name, id: user._id}
                if(user.avatar) {
                    obj = {...obj, avatar: user.avatar}
                }
                return obj
            })

            let incoming = results.filter((request) => {
                return request.participants[1] == req.user._id
            })      
            incoming = incoming.map(async(income) => {
                const user = await User.findById(income.participants[0])
                let obj = {name: user.name, id: user._id}
                if(user.avatar) {
                    obj = {...obj, avatar: user.avatar}
                }
                return obj
            })
            sent = await Promise.all(sent);
            incoming = await Promise.all(incoming);
            //console.log(sent)
           // console.log(incoming)
            res.json({sent, incoming})
        })
        .catch(() => res.status(400).json({msg: "Error"}))
    } else  {
        res.status(403).json({msg: "No user signed"})
    }
}

const get_friends = (req, res) => {
    if(req.user) {
        let userId = req.user._id;
        if(req.query.userId) {
            userId = req.query.userId;
        }
        Friendship.find({status: true,participants: {$in: [userId]}})
        .then(async (relations) => {
            const ids = relations.map((rel) => {
                let id;
                if(rel.participants[0] == userId) {
                    id = rel.participants[1]
                } else {
                    id = rel.participants[0]
                }
                return id
            })

            let friends = ids.map(async(id) => {
                const user = await User.findById(id)
                let obj = {name: user.name, id: user._id}
                if(user.avatar) {
                    obj = {...obj, avatar: user.avatar}
                }
                return obj
            })
            friends = await Promise.all(friends);
            res.json({friends})
        })
        .catch(() => res.status(400).json({msg: "Error"}))
    } else {
        res.status(403).json({msg: "No user signed"})
    }
}

module.exports = {
    send_request,
    accept_request,
    decline_request,
    get_status,
    get_requests,
    get_friends
}