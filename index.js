const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const http = require('http');
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

const cert = fs.readFileSync('./certificates/certificate.crt');
const key = fs.readFileSync('./certificates/private.key');

const cred = {
    key: key,
    cert: cert
}

const httpServer = http.createServer(app);
const httpsServer = https.createServer(cred, app);


// Connect to DB and Server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, error =>{
    if(error){
        console.log(error);
    } else {
        console.log('Connected to DB');
        //Connect to http server
        httpServer.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        })

        // Connect to https server
        httpsServer.listen(process.env.HTTPS_PORT, () => {
            console.log(`Server running on port ${process.env.HTTPS_PORT}`);
        })
    }
})
