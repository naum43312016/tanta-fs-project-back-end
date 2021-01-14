const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors')
const fileUpload = require('express-fileupload');

//User file upload to upload images
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors())
app.use(express.json());

module.exports = app;