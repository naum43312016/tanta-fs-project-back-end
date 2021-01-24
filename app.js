const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const AuthController = require('./controllers/AuthController');
const ItemController = require('./controllers/ItemController');
const CategoryController = require('./controllers/CategoryController');
const SearchController = require('./controllers/SearchController');
const UserController = require('./controllers/UserController');
const AdminController = require('./controllers/AdminController');

//User file upload to upload images
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Auth endpoints
app.post('/signup',AuthController.signUp);
app.post('/login',AuthController.login);

//Category endpoints
app.post("/category",CategoryController.createCategory);
app.get("/category/all",CategoryController.getAllCategories);
app.get("/category",CategoryController.getCategoryByName);
app.get("/category/:id",CategoryController.getCategoryById);

//Item endpoints
app.post("/item", ItemController.createItem);
app.post('/item/:id/purchase', ItemController.addPurchasedItemToUser);
app.post('/item/:id/favorite', ItemController.addFavoriteItemToUser);
app.delete('/item/:id/favorite', ItemController.deleteFavoriteItemFromUser);
app.get('/item/:id', ItemController.getItemById);
app.get("/home/get-all-items", ItemController.getAllItems);
app.delete('/item/:id',ItemController.deleteItem);
app.put('/purchase/:id', ItemController.purchaseItem);

//UserItemFilter endpoints
app.get('/user/filter', UserController.getUserFilter);

//User endpoints
app.get('/user/favorites', UserController.getUserFavorites)
app.get("/user/all", UserController.getAllUsers);
app.get("/user/:id", UserController.getUserById);

//Search endpoints
app.get('/search/item',SearchController.searchItems);

//Admin endpoints
app.get('/admin/users',AdminController.getAllUsers);

module.exports = app;