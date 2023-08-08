const Friendship = require("../models/modelFriendship")
const User = require("../models/modelUser")

const send_request = (req, res) => {
    if(req.user) {
        const friendId = req.body.friendId;
        console.log(friendId)
        User.findById(friendId)
        .then((user) => {
            console.log(user)
                new Friendship({status: false, participants: [req.user._id, friendId]}).save()
                .then(() => res.json({msg: "Request sent"}))
                .catch(() => res.status(400).json({msg: "Error"}))
        })
        .catch(() => res.status(400).json({msg: "Invalid user id"}))
    } else {
        res.status(403).json({msg: "No user signed"})
    } 
}

const accept_request = (req, res) => {
    const id = req.params.id;
    if(req.user) {
        Friendship.findById(id)
        .then((relation) => {
            if(relation.participants[1] != req.user._id) {
                res.status(403).json({msg: "Access denied"})                
            } else {
                Friendship.findByIdAndUpdate(id, {
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
    const id = req.params.id;
    if(req.user) {
        Friendship.findById((relation) => {
            if(relation.participants.includes(req.user._id)) {
                Friendship.findByIdAndDelete(id)
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

module.exports = {
    send_request,
    accept_request,
    decline_request
}