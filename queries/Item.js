const {getDb} = require('../config/dbConnection');
const ObjectID = require('mongodb').ObjectID;
const User = require('./User');

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