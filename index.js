const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const fileUpload = require('express-fileupload');

// Initial Setup
const { createRoles } = require('./libs/initialSetup');

// Load env vars

dotenv.config();

//Init express
const app = express();
createRoles();

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
app.use(express.static('images'));

// Connect to DB and Server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, error =>{
    if(error){
        console.log(error);
    } else {
        console.log('Connected to DB');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        })
    }
})