var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Contact = require('../models/contact');
const { FailedDependency } = require('http-errors');

router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.cors, (req, res) => { res.sendStatus(200); } )


router.get('/',cors.cors,   (req,res,next) => {
    Contact.find()
    .then((contacts) => {
        if(contacts.length){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(contacts.reverse());   
        }

        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({"status":false,"msg":"No Contacts Available"});

        }
    })
})

router.post('/',cors.cors, (req,res,next) => {
    Contact.find()
    .then((user) => {
        if(user==null || user==undefined) {
            console.log("contact",req.body);
            var data ={
                id: 1,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                address: req.body.address,
                zip: req.body.zip
            }

            Contact.create(data)
            .then((contact) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({"success":true,"res":contact,"msg":"Details sent suceessfully!"});
            
            }, (err) => next(err))
            .catch((err) => next(err));  
        }

        else {
            var data ={
                id: user.length + 1,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                address: req.body.address,
                zip: req.body.zip
            };

            Contact.create(data)
            .then((contact) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({"success":true,"res":contact,"msg":"Details sent suceessfully!"});
            
            }, (err) => next(err))
            .catch((err) => next(err));   
        }
    })

});
        

module.exports = router;