const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const https = require('https');

// Initial Setup
const { createRoles, createStatus } = require('./libs/initialSetup');

// Load env vars

dotenv.config();

//Init express
const app = express();
createRoles();
createStatus();

// Cors
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['*'],
        accessControlAllowOrigin: true,
        credentials: true,
    }
));

// Middlewares to handle data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Manage files uploads
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads/tmp',
}))

// Routes
app.use('/api', routes);

// Media files
app.use(express.static('uploads/images'));

const certificate = fs.readFileSync('./certificates/D37AF9A4ABE39D45867209822A67AAA2.txt');

app.get('/.well-known/pki-validation/D37AF9A4ABE39D45867209822A67AAA2.txt', (req, res) => {
    res.send('D:\Zaro\zaro-backend-cms\certificates\D37AF9A4ABE39D45867209822A67AAA2.txt')
})

// Connect to DB and Server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, error =>{
    if(error){
        console.log(error);
    } else {
        console.log('Connected to DB');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        })
        // Connect to https server
        //const httpsServer = https.createServer({

    }
})
