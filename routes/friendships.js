const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerFriendship")

router.post("/", controller.send_request);
router.delete("/:id", controller.decline_request);
router.post("/:id", controller.accept_request);

module.exports = router;
