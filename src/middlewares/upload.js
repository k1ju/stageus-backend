const env = require('../config/env.js');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3 } = require('../config/aws.js')

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

//S3저장 multer
const S3upload = multer({
    storage: multerS3({
        s3: S3,
        bucket: env.AWS_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, `upload/${new Date().getTime().toString() + '_' + file.originalname}`);
        },
        limits: {fileSize : 5 * 1024 * 1024 }
    })
});

module.exports = {
    upload,
    S3upload
};
