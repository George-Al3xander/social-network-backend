const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerPost")
const controllerComment = require("../controllers/controllerComment")
const controllerLike = require("../controllers/controllerLike");
const verifyToken = require('../verifyToken');


router.get("/",verifyToken, controller.get_all);
router.get("/feed",verifyToken, controller.get_feed);
router.post("/",verifyToken, controller.create_post);
router.get("/:id",verifyToken, controller.get_one);
router.put("/:id",verifyToken, controller.update_post);
router.delete("/:id",verifyToken, controller.delete_post);

router.get("/:id/comments",verifyToken, controllerComment.get_post_comments);
router.post("/:id/comments",verifyToken, controllerComment.create_comment);
router.put("/:id/comments/:commentId",verifyToken, controllerComment.edit_comment);
router.delete("/:id/comments/:commentId",verifyToken, controllerComment.delete_comment);

router.get("/:id/likes",verifyToken, controllerLike.get_post_likes);
router.post("/:id/likes",verifyToken, controllerLike.create_like);
router.delete("/:id/likes",verifyToken, controllerLike.delete_like);


module.exports = router;
