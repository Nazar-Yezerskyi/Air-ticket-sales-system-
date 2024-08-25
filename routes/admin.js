const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin');

router.post('/loginadmin', (req, res) => {
    controller.adminLogin(req, res);
});


module.exports = router;