const express = require('express')
const router = express.Router()
const controller = require('../controllers/ticket')

module.exports = function (connection) {
    router.get('/orderticket', (req, res) => {
        controller.getSeatsForFlight(req, res, connection);
      });

      router.get('/infoticket',(req, res) =>{
        controller.flight_info(req, res, connection);
      });
      router.post('/orderticketuser',(req,res)=>{
        controller.order_ticket(req,res,connection)
      })
      router.get('/orderedTicket',(req,res)=>{
        controller.orderedTicket(req,res, connection)
      })

  return router;
};
