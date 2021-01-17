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