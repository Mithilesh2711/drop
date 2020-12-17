var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Payment = require('../models/payment');
const { FailedDependency } = require('http-errors');

router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.cors, (req, res) => { res.sendStatus(200); } )
router.get('/:cid/pid',cors.cors, (req,res,next) => {
    Payment.findOne({cid: req.params.cid})
    .then((user) => {
        if(user===null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({"status":true,"pid":1});   
        }

        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({"status":true,"pid":user.payments.length +1}); 
        }
    })
})

router.get('/payments',cors.cors, (req,res,next) => {
    Payment.find()
    .then((user) => {
        if(user!==null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);   
        }

        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json(user); 
        }
    })
})

router.post('/:cid',cors.cors, authenticate.verifyUser, (req,res,next) => {
    Payment.findOne({cid: req.params.cid})
    .then((user) => {
        console.log("user1",req.user);
        if(user === null) {
            console.log("body payment",req.body);
            var payment={
                pid:1,
                paid: req.body.paid,
                openReading : req.body.openReading,
                closeReading : req.body.closeReading,
                method: req.body.method,
                image: req.body.image,
                receiver: req.user.username
            };
            var data= {
                cid: req.params.cid,
                dues: (req.body.closeReading - req.body.openReading)*req.body.charge - req.body.paid,
                payments: payment
            };

        Payment.create(data)
        .then((payment) => {
            console.log("payment",payment);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({"status":true,"msg":"Payment Data added  Successfully!","res":payment});
        
        })
        .catch((err) => {
            console.log("errr",err)
            next(err)
         })   
        
        
    }
        else if(user!==null) {
            console.log("body",req.body);
            if(req.body.openReading)
            var payment={
                pid:user.payments.length + 1,
                paid: req.body.paid,
                openReading : req.body.openReading,
                closeReading : req.body.closeReading,
                method: req.body.method,
                image: req.body.image,
                receiver: req.user.username
            };
            else
            {
                
                var payment={
                    pid:user.payments.length + 1,
                    paid: req.body.paid,
                    openReading : user.payments.reverse()[0].closeReading,
                    closeReading : req.body.closeReading,
                    method: req.body.method,
                    image: req.body.image,
                    receiver: req.user.username
                };
            }
            
           user.payments.push(payment)
           user.save()
           .then((user) => {
            user.dues = (req.body.closeReading - payment.openReading)*req.body.charge - req.body.paid + user.dues;
            user.save()
            .then((payment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({"status":true,"msg":"Payment Data added  Successfully!","res":payment});
            
            }, (err) => next(err))
            .catch((err) => next(err)); 

        }, (err) => next(err))
        .catch((err) => next(err)); 

        }
        
    })
    .catch((err) => next(err));
})

module.exports = router;