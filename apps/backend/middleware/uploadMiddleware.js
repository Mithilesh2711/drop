const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const crypto = require('crypto');

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

// Middleware to handle file upload to S3
const uploadToS3 = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        // Generate unique filename
        const datePrefix = new Date().toISOString().slice(0, 7).replace('-', '/');
        const key = crypto.randomBytes(10).toString('hex');
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${key}${fileExt}`;
        const s3Key = `${req.body.folder || 'uploads'}/${datePrefix}/${fileName}`;

        // Upload to S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read'
        };

        const result = await s3.upload(params).promise();
        
        // Attach the S3 URL to the request body
        req.body[req.file.fieldname] = result.Location;
        
        next();
    } catch (error) {
        console.error('Error uploading to S3:', error);
        next(error);
    }
};

module.exports = {
    upload,
    uploadToS3
}; 