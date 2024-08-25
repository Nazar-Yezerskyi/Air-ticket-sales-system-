const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminAdd')
module.exports = function (connection) {
    router.post('/addPlane', (req, res) => {
        controller.addPlane(req, res, connection);
      });
    router.post('/addFlight', (req,res)=>{
        controller.addFlight(req, res, connection);
    })
     
    return router;
  };
