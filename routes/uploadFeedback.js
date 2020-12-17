const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

const cors = require('./cors');

const uploadFeedbackRouter = express.Router();
var cid;
uploadFeedbackRouter.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../client/build/assets/images/payments');
    },

    filename: (req, file, cb) => {
        var ob=file.mimetype.split("/")[1]
        cb(null, cid+"-"+fid+"."+ob)
        console.log("body",cid+"-"+fid+"."+ob);
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


uploadFeedbackRouter.route('/:cid/:fid')
.options(cors.cors, (req, res) => { res.sendStatus(200); })

.post(cors.cors,  (req, res, next) => {
    fid=req.params.fid
    cid=req.params.cid;
    console.log("cid",cid);
    next();

}, upload.single('imageFile'), (req,res) => {
    console.log("success:",req.file);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
});

module.exports = uploadFeedbackRouter;