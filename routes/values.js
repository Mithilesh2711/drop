var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Value = require('../models/values');
const { FailedDependency } = require('http-errors');

router.use(bodyParser.json());

/* GET home page. */
router.options('*', cors.cors, (req, res) => { res.sendStatus(200); } )

router.get('/',cors.cors, (req,res,next) => {
    Value.findOne({id:1})
        .then((value) => {
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({"status":true, "res":value});
        }, (err) => next(err))
        .catch((err) => next(err));    
})

router.post('/',cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {

    Value.find()
    .then((value) => {
     if(value.length==0)
     {
        Value.create({id:1, charge:req.body.charge})
         .then((value) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({"status":true, "res":value});
        
        }, (err) => next(err))
        .catch((err) => next(err));
     }

     else {
        Value.findOne({id:1})
        .then((value) => {
            value.charge = req.body.charge;
            value.save()
            .then((value) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({"status":true, "res":value});
            
            }, (err) => next(err))
            .catch((err) => next(err));
        
        }, (err) => next(err))
        .catch((err) => next(err));
     }
    
    }, (err) => next(err))
    .catch((err) => next(err))
});

module.exports = router;