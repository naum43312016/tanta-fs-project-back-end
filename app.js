const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors')
const fileUpload = require('express-fileupload');
const AuthController = require('./controllers/AuthController');
//User file upload to upload images
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors())
app.use(express.json());

app.post('/signup',AuthController.signUp);
app.post('/login',AuthController.login);
app.get('/test',AuthController.test);

module.exports = app;