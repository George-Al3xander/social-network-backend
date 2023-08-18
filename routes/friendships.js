const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerFriendship");
const verifyToken = require('../verifyToken');

router.post("/",verifyToken, controller.send_request);
router.delete("/",verifyToken, controller.decline_request);
router.put("/",verifyToken, controller.accept_request);
router.get("/status",verifyToken, controller.get_status);
router.get("/requests",verifyToken, controller.get_requests);
router.get("/",verifyToken, controller.get_friends);


module.exports = router;
