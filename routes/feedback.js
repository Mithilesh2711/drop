var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Feedback = require('../models/feedback');
const { FailedDependency } = require('http-errors');

router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.cors, (req, res) => { res.sendStatus(200); } )


router.get('/',cors.cors,  (req,res,next) => {
    Feedback.find()
    .then((feedbacks) => {
        if(feedbacks.length){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(feedbacks.reverse());   
        }

        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({"status":false,"msg":"No Feedbacks Available"});

        }
    })
})

router.post('/',cors.cors,  (req,res,next) => {
    Feedback.create(req.body)
        .then((feedback) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({"status":true,"res":feedback,"mes":"Feedback Message Send !"});
        
        }, (err) => next(err))
        .catch((err) => next(err));   
});
        

module.exports = router;