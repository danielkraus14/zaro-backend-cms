const dotenv = require('dotenv');
const {S3Client, PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const fs = require('fs');

const AWS_BUCKET_NAME=process.env.AWS_BUCKET_NAME
const AWS_BUCKET_REGION=process.env.AWS_BUCKET_REGION
const AWS_PUBLICK_KEY=process.env.AWS_PUBLICK_KEY
const AWS_SECRET_KEY=process.env.AWS_SECRET_KEY

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLICK_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    }
});

async function uploadFile(file) {

    const stream = fs.createReadStream(file.tempFilePath);

    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream
    };

    return await client.send(new PutObjectCommand(params));
};

async function readFile(fileName) {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
    };

    const command = new GetObjectCommand(params);
    const data = await client.send(command);
    data.Body.pipe(fs.createWriteStream(`./uploads/images/${fileName}`));
}

module.exports = {
    uploadFile,
    readFile
};