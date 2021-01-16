const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const AuthController = require('./controllers/AuthController');
const ItemController = require('./controllers/ItemController');
const CategoryController = require('./controllers/CategoryController');
//User file upload to upload images
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//Auth endpoints
app.post('/signup',AuthController.signUp);
app.post('/login',AuthController.login);


//Category endpoints
app.post("/category",CategoryController.createCategory);
app.get("/category/all",CategoryController.getAllCategories);
app.get("/category",CategoryController.getCategoryByName);
app.get("/category/:id",CategoryController.getCategoryById);

//Item endpoints
app.post("/item",ItemController.createItem);
app.get("/home/get-all-items",ItemController.getAllItems);


module.exports = app;