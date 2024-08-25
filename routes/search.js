const express = require('express')
const router = express.Router()
const controller = require('../controllers/search')

module.exports = function (connection) {
    router.get('/searchticketto', (req, res) => {
        controller.search(req, res, connection);
      });
     

      
      

  return router;
};
