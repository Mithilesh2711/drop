const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

async function configureBucketCORS() {
    try {
        // Read the CORS configuration file
        const corsConfig = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, '../config/s3-cors.json'),
                'utf8'
            )
        );

        // Apply CORS configuration to the bucket
        await s3.putBucketCors({
            Bucket: process.env.AWS_S3_BUCKET,
            CORSConfiguration: corsConfig
        }).promise();

        console.log('Successfully configured CORS for bucket:', process.env.AWS_S3_BUCKET);
    } catch (error) {
        console.error('Error configuring CORS:', error);
    }
}

configureBucketCORS(); 