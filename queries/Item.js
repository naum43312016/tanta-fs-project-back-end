const {getDb} = require('../config/dbConnection');
const ObjectID = require('mongodb').ObjectID;
const User = require('./User');
const ITEMS_PER_PAGE = 12;

exports.add = async (item) => {
    const _db = getDb();
    try{
        const collection = _db.collection('items');
        const result = await collection.insertOne(item);
        if(result){
            return result.ops[0];
        }else{
            return null;
        }
    }catch{
        return null;
    }
}

exports.addItemToUser = async (item,userId) => {
    const user = await User.getUserById(userId);
    if(user){
        const userItems = user.items;
        userItems.push(ObjectID(item._id))
        const result = await User.updateUserItems(userId,userItems);
        if(result){
            return true;
        }else{
            return null;
        }
    }else{
        return null;
    }
}

exports.getAllItems = async () => {
    const _db = getDb();
    try{
        const collection = _db.collection('items');
        const result = await collection.find({}).toArray();
        return result;
    }catch{
        return null;
    }
}

exports.getItemById = async (_id) => { 
    const _db = getDb();
    try {
        const collection = _db.collection('items');
        const item = await collection.findOne({'_id': ObjectID(_id) });
        return item;
        
    } catch {
        return null;
    }
   
}

exports.getItemsByQuery = async (query,page) => {
    const _db = getDb();
    try{
        page = page-1;
        const collection = _db.collection('items');
        const itemsCount = await collection.find(query).count();
        const items = await collection.find(query).skip(page*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).toArray();
        const pagesCount = Math.ceil(itemsCount/ITEMS_PER_PAGE);
        return {pagesCount,items};
    }catch{
        return null;
    }
}

exports.addFavoriteItemToUser = async (itemId, userId) => {
    const user = await User.getUserById(userId);
    if(user){
        const userFavoriteItems = user.favoriteItems;
        const userFavoriteItemsToString = userFavoriteItems.map(item => item.toString());
        const isRepeatedItem = userFavoriteItemsToString.find(item => item === itemId);
        if (!isRepeatedItem) {
            userFavoriteItems.push(ObjectID(itemId))
            const result = await User.updateUserFavoriteItems(userId, userFavoriteItems);
            if (result) {
                return true;
            } else {
                return null;
            }
        }
        else { 
            return null;
        }     
    }else{
        return null;
    }
}

exports.removeFavoriteItemFromUser = async (itemId, userId) => {
    const user = await User.getUserById(userId);
    if(user){
        const userFavoriteItems = user.favoriteItems;
        const userFavoriteItemsToString = userFavoriteItems.map(item => item.toString());
        const indexOfItemToRemove = userFavoriteItemsToString.indexOf(itemId);
        if (indexOfItemToRemove) {
            userFavoriteItemsToString.splice(indexOfItemToRemove, 1);
            const updatedUserFavoriteItemsToObjectId = userFavoriteItemsToString.map(item => ObjectID(item));
            const result = await User.updateUserFavoriteItems(userId, updatedUserFavoriteItemsToObjectId);
             if (result) {
                return true;
            } else {
                return null;
            }
        }
        else { 
            return null;
        } 
    }else{
        return null;
    }
}

//WIP
exports.addPurchasedItemToUser = async (itemId, userId) => {
    const user = await User.getUserById(userId);
    if (user) {
        const result = await Item.changeItemStatusToSold(itemId);
        
        if (result) {
            return true;
        } else {
            return null;
        }
    } else { 
        return null;
    }
}
//WIP
exports.changeItemStatusToSold = async (itemId) => { 
    const _db = getDb();
    try {
        const collection = _db.collection('items');
        const item = await collection.updateOne({ '_id': ObjectID(itemId) }, { $set: {$status: 'sold'}});
        return item;
        
    } catch {
        return null;
    }
   
}

