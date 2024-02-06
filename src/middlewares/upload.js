const env = require('../config/env.js');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

//db저장 multer
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, new Date().getTime() + '_' + file.originalname);
        },
    }),
});

const S3 = new S3Client({
    region: env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

//S3저장 multer
const S3upload = multer({
    storage: multerS3({
        s3: S3,
        bucket: env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
        key: (req, file, cb) => {
            cb(null, new Date().getTime().toString());
        }
    })
});

module.exports = {
    upload,
    S3upload
};
