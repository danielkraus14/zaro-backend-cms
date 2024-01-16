const dotenv = require('dotenv');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { fromUtf8 } = require("@aws-sdk/util-utf8-node");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const AWS_BUCKET_NAME=process.env.BUCKET_NAME_AWS
const AWS_BUCKET_REGION=process.env.BUCKET_REGION_AWS
const AWS_PUBLICK_KEY=process.env.PUBLICK_KEY_AWS
const AWS_SECRET_KEY=process.env.SECRET_KEY_AWS

const s3 = new S3Client({
    credentials: {
        accessKeyId: AWS_PUBLICK_KEY,
        secretAccessKey: AWS_SECRET_KEY
    },
    region: AWS_BUCKET_REGION
});

const uploadFileS3 = async (file, filename) => {
    try {
        var params;
        if (filename.split('.').pop() == 'json') {
            params = {
                Bucket: AWS_BUCKET_NAME,
                Key: filename,
                Body: fromUtf8(file),
                ContentType: 'application/json'
            };    
        } else {
            params = {
                Bucket: AWS_BUCKET_NAME,
                Key: filename,
                Body: file.data
            };
        };
        
        const command = new PutObjectCommand(params);
        const response = await s3.send(command);
        console.log(`File uploaded successfully in bucket ${AWS_BUCKET_NAME}`);
        return response;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const readFileS3 = async (filename) => {
    try {
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: filename,
        };
        const command = new GetObjectCommand(params);
        const response = await getSignedUrl(s3, command, { expiresIn: 36000 });
        return response;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const deleteFileS3 = async (filename) => {
    try {
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: filename,
        };
        const command = new DeleteObjectCommand(params);
        const response = await s3.send(command);
        return response;
    } catch(err) {
        console.error(err);
        throw err;
    }
};

const createDirectoryS3 = async(slug) => {
    try {
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: `${slug}/`,
            Body: ''
        };
        const command = new PutObjectCommand(params);
        const response = await s3.send(command);
        console.log(`Successfully created directory ${slug} in bucket ${AWS_BUCKET_NAME}`);
        return response;
    } catch(err) {
        console.error(err);
        throw err;
    }
};

const deleteDirectoryS3 = async (slug) => {
    try {
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: `${slug}/`
        };
        const command = new DeleteObjectCommand(params);
        const response = await s3.send(command);
        return response;
    } catch(err) {
        console.error(err);
        throw err;
    }
};

module.exports = {
    uploadFileS3,
    readFileS3,
    deleteFileS3,
    createDirectoryS3,
    deleteDirectoryS3
};