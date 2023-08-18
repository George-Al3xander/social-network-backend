const Like = require("../models/modelLike")
const Post = require("../models/modelPost")
const jwt = require('jsonwebtoken')

const create_like = (req, res) => {
    const postId = req.params.id;
    // if(user) {
        const user = jwt.decode(req.token, process.env.SECRET_KEY).user;
        try {            
            Post.findById(req.body.postId)
            .then(() => {
                Like.find({postId, userId: user._id})
                .then((likes) => {
                    if(likes.length == 0) {
                        new Like({postId, userId: user._id}).save()
                        .then(() => res.json({msg: "Like created"}))
                        .catch(() => res.status(400).json({msg: "Error"}))
                    } else {                        
                        res.status(409).json({msg: "Like already exists"})
                    }
                    
                })
            })
            .catch(() => res.status(400).json({msg: "Invalid post id"}))
        } catch (msg) {
            res.status(403).json({msg})            
        }
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // }
}

const delete_like = (req, res) => {
    const postId = req.params.id;
    // if(user) {
        const user = jwt.decode(req.token, process.env.SECRET_KEY).user;
        Like.findOneAndDelete({postId, userId: user._id})
            .then(() => {
                res.json({msg: "Like deleted"})               
            })
            .catch(() => res.status(400).json({msg: "Invalid  id`s"}))
        
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // }
}

const get_post_likes = (req, res) => {    
    const id = req.params.id;   
    // if(user) {
        const user = jwt.decode(req.token, process.env.SECRET_KEY).user;
        Post.findById(id)
        .then(() => {            
            Like.find({postId: id})
            .then((likes) => {
                let data = {likes, userStatus: false};
                if(likes.some((like) => like.userId == user._id)) {
                    data = {likes, userStatus: true};
                } 
                res.json({data})
            })
        })
        .catch(() => res.status(400).json({msg: "Invalid post id"}))
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // }
}

module.exports = {
    create_like,
    delete_like,
    get_post_likes
}