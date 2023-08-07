const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerPost")
const Post = require("../models/modelPost")


router.get("/", (req,res) => {
    if(req.user) {
        res.json({msg: "Blogs"})
    } else {
        res.status(403).json({msg: "No user signed"})
    }
})


router.post("/", async (req , res) => {
    console.log(req.user)
    if(req.user) {
        const valid = new RegExp(/\S/);
        try {
            if(req.body.text == undefined ||req.body.userId == undefined ) {
                throw "Fill all the required fields"                
            }
            if(!valid.test(req.body.text))  {
                throw "Text can't be empy"
            }             
            await new Post({userId: req.user._id, text: req.body.text})
            .then(() => res.status(200).json({msg: "Post created"}))
            .catch(() => res.status(400).json({msg: "Error"}))
        } catch (error) {
            res.status(403).json({msg: error})
        }
    } else {
        res.status(403).json({msg: "No user signed"})
    }
})

module.exports = router;
