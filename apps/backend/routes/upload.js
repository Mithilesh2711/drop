const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Configure multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload single file
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate unique filename
        const datePrefix = new Date().toISOString().slice(0, 7).replace('-', '/');
        const key = crypto.randomBytes(10).toString('hex');
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${key}${fileExt}`;
        const folder = req.body.folder || 'uploads';
        const filePath = `${folder}/${datePrefix}/${fileName}`;

        // Upload to S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filePath,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read'
        };

        console.log('Uploading to S3 with params:', {
            Bucket: params.Bucket,
            Key: params.Key,
            ContentType: params.ContentType
        });

        const uploadResult = await s3.upload(params).promise();
        console.log('S3 upload result:', uploadResult);

        res.json({ 
            location: uploadResult.Location,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
});

module.exports = router; 