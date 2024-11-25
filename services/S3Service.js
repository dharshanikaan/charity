require('dotenv').config({ path: '../expenseapppassword/.env' });
const AWS = require("aws-sdk");

async function uploadFileToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

  try {
    // Check if the environment variables are set
    if (!BUCKET_NAME || !accessKey || !secretKey) {
      throw new Error("Missing AWS credentials or bucket name in environment variables.");
    }

    const s3bucket = new AWS.S3({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    });

    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",  // Change this as needed for your security requirements
    };

    // Using the promise version of the upload function
    const s3Response = await s3bucket.upload(params).promise();
    return s3Response.Location;  // Returns the URL of the uploaded file
  } catch (err) {
    console.error("Error uploading file to S3", err);
    throw err;
  }
}

module.exports = {
  uploadFileToS3,
};
