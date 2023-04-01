const dotenv = require('dotenv');
const { S3Client, ListObjectsCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const dateFns = require('date-fns');

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

const getFiles = async () => {
    try {
        const params = {
            Bucket: AWS_BUCKET_NAME
        };
        const command = new ListObjectsCommand(params);
        const response = await s3.send(command);
        return response.Contents.map((object) => object.Key);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const uploadFile = async (file) => {
    try {
        const year = dateFns.format(new Date(), 'yyyy');
        const month = dateFns.format(new Date(), 'MM');
        const day = dateFns.format(new Date(), 'dd');

        //replace spaces with underscores
        const nameFormat = file.name.replace(/ /g, '_');
        const fileName = `${year}/${month}/${day}_${nameFormat}`;

        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.data
        };
        const command = new PutObjectCommand(params);
        const response = await s3.send(command);
        console.log(`File uploaded successfully to ${response.Location}`);
        return response;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const uploadFrontPage = async (file) => {
    try {
        const year = dateFns.format(new Date(), 'yyyy');
        const month = dateFns.format(new Date(), 'MM');
        const day = dateFns.format(new Date(), 'dd');

        //replace spaces with underscores
        const nameFormat = file.name.replace(/ /g, '_');
        const fileName = `print_edition/${year}/${month}/${day}_fp_${nameFormat}`;

        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.data
        };
        const command = new PutObjectCommand(params);
        const response = await s3.send(command);
        console.log(`File uploaded successfully to ${response.Location}`);
        return response;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const uploadNewsletterPDF = async (file) => {
    try {
        const year = dateFns.format(new Date(), 'yyyy');
        const month = dateFns.format(new Date(), 'MM');
        const day = dateFns.format(new Date(), 'dd');

        //replace spaces with underscores
        const nameFormat = file.name.replace(/ /g, '_');
        const fileName = `print_edition/${year}/${month}/${day}_pdf_${nameFormat}`;

        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.data
        };
        const command = new PutObjectCommand(params);
        const response = await s3.send(command);
        console.log(`File uploaded successfully to ${response.Location}`);
        return response;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const uploadBillboard = async (file) => {
    try {
        //replace spaces with underscores
        const nameFormat = file.name.replace(/ /g, '_');
        const fileName = `billboard/${nameFormat}`;

        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.data
        };
        const command = new PutObjectCommand(params);
        const response = await s3.send(command);
        console.log(`File uploaded successfully to ${response.Location}`);
        return response;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const readFile = async (fileName) => {
    try {
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: fileName,
        };
        const command = new GetObjectCommand(params);
        const response = await getSignedUrl(s3, command, { expiresIn: 36000 });
        return response;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const deleteFile = async (fileName) => {
    try {
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: fileName,
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
    getFiles,
    uploadFile,
    uploadFrontPage,
    uploadNewsletterPDF,
    uploadBillboard,
    readFile,
    deleteFile
};