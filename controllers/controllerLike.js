const Like = require("../models/modelLike")
const Post = require("../models/modelPost")

const create_like = (req, res) => {
    if(req.user) {
        try {
            if(req.body.postId == undefined) {
                throw "Fill all the required fields"
            }
            Post.findById(req.body.postId)
            .then(() => {
                new Like({postId: req.body.postId, userId: req.user._id}).save()
                .then(() => res.json({msg: "Like created"}))
                .catch(() => res.status(400).json({msg: "Error"}))
            })
            .catch(() => res.status(400).json({msg: "Invalid post id"}))
        } catch (msg) {
            res.status(403).json({msg})            
        }
    } else {
        res.status(403).json({msg: "No user signed"})
    }
}

const delete_like = (req, res) => {
    const id = req.params.id;
    if(req.user) {
        Like.findByIdAndDelete(id)
            .then(() => {
                res.json({msg: "Like deleted"})               
            })
            .catch(() => res.status(400).json({msg: "Invalid like id"}))
        
    } else {
        res.status(403).json({msg: "No user signed"})
    }
}

module.exports = {
    create_like,
    delete_like
}