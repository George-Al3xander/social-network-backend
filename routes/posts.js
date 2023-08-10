const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerPost")


router.get("/", controller.get_all);
router.get("/feed", controller.get_feed);
router.post("/", controller.create_post);
router.get("/:id", controller.get_one);
router.delete("/:id", controller.delete_post);

module.exports = router;
