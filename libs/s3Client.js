// Create service client module using ES6 syntax.
const { S3Client } = require("@aws-sdk/client-s3");
// Set the AWS Region.
// const REGION = "us-east-1"; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({});
module.exports = s3Client;
