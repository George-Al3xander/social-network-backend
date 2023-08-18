const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerUser");
const verifyToken = require('../verifyToken');

/* GET users listing. */
router.put('/',verifyToken,  controller.user_edit);
router.get('/search',verifyToken,  controller.user_search);
router.get('/', verifyToken, controller.user_get);

router.get('/current',verifyToken,  controller.user_get_current);

module.exports = router;
