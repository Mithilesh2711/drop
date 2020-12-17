const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

const cors = require('./cors');

const uploadRouter = express.Router();
var cid,pid;
uploadRouter.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../client/build/assets/images/payments');
    },

    filename: (req, file, cb) => {
        var ob=file.mimetype.split("/")[1]
        cb(null, cid+"-"+pid+"."+ob)
        console.log("body",cid+"-"+pid+"."+ob);
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
    console.log("file",file);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});


uploadRouter.route('/:cid/:pid')
.options(cors.cors, (req, res) => { res.sendStatus(200); })

.post(cors.cors, authenticate.verifyUser, (req, res, next) => {

    cid=req.params.cid;
    pid=req.params.pid;
    console.log("pid",pid);
    next();

}, upload.single('imageFile'), (req,res) => {
    console.log("success:",req.file);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
});

module.exports = uploadRouter;