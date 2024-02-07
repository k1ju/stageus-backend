const { S3Client } = require('@aws-sdk/client-s3');
const env = require('./env.js');


const S3 = new S3Client({
    region: env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

module.exports = {
    S3,
}