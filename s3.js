const dotenv = require('dotenv');
const {S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner')
const fs = require('fs');
const dateFns = require('date-fns');

const AWS_BUCKET_NAME=process.env.BUCKET_NAME_AWS
const AWS_BUCKET_REGION=process.env.BUCKET_REGION_AWS
const AWS_PUBLICK_KEY=process.env.PUBLICK_KEY_AWS
const AWS_SECRET_KEY=process.env.SECRET_KEY_AWS

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLICK_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    }
});

async function getFiles() {
    const params = {
        Bucket: AWS_BUCKET_NAME,
    };
    const data = await client.send(new ListObjectsCommand(params));
    return data.Contents;
}

async function uploadFile(file) {

    const stream = fs.createReadStream(file.tempFilePath);

    const year = dateFns.format(new Date(), 'yyyy');
    const month = dateFns.format(new Date(), 'MM');
    const day = dateFns.format(new Date(), 'dd');

    //replace spaces with underscores
    const nameFormat = file.name.replace(/ /g, '_');
    const fileName = `${year}/${month}/${day}_${nameFormat}`;

    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        Body: stream
    };
    await client.send(new PutObjectCommand(params));

    return fileName;
    
};

async function readFile(fileName) {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
    };

    const command = new GetObjectCommand(params);
    const data = await getSignedUrl(client, command, { expiresIn: 36000 });
    console.log(data)
    return data;
    //data.Body.pipe(fs.createWriteStream(`./uploads/images/${fileName}`));

}

async function deleteFile(fileName) {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
    };
    const data = await client.send(new DeleteObjectCommand(params));
    return data;
}


module.exports = {
    getFiles,
    uploadFile,
    readFile,
    deleteFile
};