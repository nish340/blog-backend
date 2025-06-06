const AWS = require('aws-sdk');

// Configure AWS with your region and credentials
// Make sure to set your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const generatePresignedUrl = async (fileName, fileType) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60 * 5, // URL expires in 5 minutes
    ContentType: fileType,
    ACL: 'public-read' // Or 'private' depending on your needs
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    return url;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error('Could not generate pre-signed URL.');
  }
};

module.exports = { generatePresignedUrl };