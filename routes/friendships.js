const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerFriendship");
const verifyToken = require('../verifyToken');

router.post("/", controller.send_request);
router.delete("/", controller.decline_request);
router.put("/", controller.accept_request);
router.get("/status", controller.get_status);
router.get("/requests", controller.get_requests);
router.get("/", controller.get_friends);


module.exports = router;
