const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerUser");
const verifyToken = require('../verifyToken');

/* GET users listing. */
router.put('/',  controller.user_edit);
router.get('/search',  controller.user_search);
router.get('/',  controller.user_get);

module.exports = router;
