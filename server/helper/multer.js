const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const { v4 } = require('uuid');

const { S3_ENDPOINT, BUCKET_NAME } = process.env;

const s3Config = {};
if (S3_ENDPOINT) {
  s3Config.endpoint = new aws.Endpoint(S3_ENDPOINT);
}

const s3 = new aws.S3(s3Config);

const upload = BUCKET_NAME
  ? multer({
    storage: multerS3({
      s3,
      bucket: BUCKET_NAME,
      acl: 'public-read',
      metadata: (req, file, cb) => {
        cb(null, {
          fieldName: file.fieldname,
        });
      },
      key: (request, file, cb) => {
        cb(null, v4() + path.extname(file.originalname));
      },
    }),
  }).array("upload")
  : (req, res, next) => {
    res.status(500).json({
      success: false,
      data: 'DigitalOcean/S3 no está configurado',
    });
  };


module.exports = { upload, s3 };
