const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth')
module.exports = function (connection) {
      router.post('/login', (req, res) => {
        controller.login(req, res, connection);
    });

        router.post('/register', (req, res) => {
          controller.register(req, res, connection);
        });
        
  
    return router;
  };
