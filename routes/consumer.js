var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Consumer = require('../models/consumer');
const { FailedDependency } = require('http-errors');

router.use(bodyParser.json());

/* GET users listing. */
router.options('*',  (req, res) => { res.sendStatus(200); } )
router.get('/', (req,res,next) => {
    Consumer.find()
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err)=>next(err));
});



router.get('/:cid', cors.cors, (req,res,next) => {
       Consumer.findOne({id: req.params.cid})
       .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err)=>next(err));
});

router.post('/create',cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Consumer.findOne({id: req.body.id})
    .then((user) => {
        if(user === null) {
            console.log("user is null");
            console.log("body : ", req.body)
            Consumer.create(req.body)
            .then((user) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({"status":true,"msg":"Consumer Registration Successful!","res":user});
                
            }, (err) => {
                console.log("Errr",err)
                next(err)})
            .catch((err) => {next(err)});
        }
        else if(user!==null) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({"status":false,"msg":"user already exists","res":null});
        }
    })
    .catch((err) => next(err));
});

router.post('/edit',cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Consumer.findOne({id: req.body.id})
    .then((user) => {
        if(user!==null) {
            console.log("reqbody",req.body);
           Consumer.updateOne({id:req.body.id}, {$set: {[req.body.field]:req.body.val}})
           .then((resp) => {
               console.log("resp",resp);

               if(resp.ok) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({"status":true,"res":resp});
               }

               else 
               throw err;

               
           })
           .catch((err) => next(err));
        }
    })
    .catch((err) => next(err));
});

module.exports = router;