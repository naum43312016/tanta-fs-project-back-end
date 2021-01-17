const {getDb} = require('../config/dbConnection');
const ObjectID = require('mongodb').ObjectID;
const USERS_PER_PAGE = 6;

exports.addUser = async (user) => {
    const _db = getDb();
    try{
        const collection = _db.collection('users');
        const result = await collection.insertOne(user);
        return result;
    }catch{
        return null;
    }
}

exports.getAllUsers = async () => {
    const _db = getDb();
    try{
        const collection = _db.collection('users');
        const result = await collection.find({}, { projection: {password: 0}}).toArray();
        return result;
    }catch{
        return null;
    }
}

exports.getAllUsersForPage = async (page) => {
    const _db = getDb();
    try{
        page = page-1;
        const collection = _db.collection('users');
        const usersCount = await collection.find({}).count();
        const users = await collection.find({}, { projection: {password: 0}}).skip(page*USERS_PER_PAGE).limit(USERS_PER_PAGE).toArray();
        const pagesCount = Math.ceil(usersCount/USERS_PER_PAGE);
        return {pagesCount,users};
    }catch{
        return null;
    }
}
exports.getUserById = async (_id) => {
    const _db = getDb();
    try{
        const collection = _db.collection('users');
        const user = await collection.findOne({"_id": ObjectID(_id)});
        return user;
    }catch{
        return null;
    }
}

exports.getUserByEmail = async (email) => {
    const _db = getDb();
    try{
        const collection = _db.collection('users');
        const user = await collection.findOne({"email": email});
        return user;
    }catch{
        return null;
    }
}

exports.updateUserItems = async (userId,userItems) => {
    const _db = getDb();
    try{
        const collection = _db.collection('users');
        const user = await collection.updateOne({"_id": ObjectID(userId)},{$set : {items : userItems}});
        return user;
    }catch{
        return null;
    }
}

exports.updateUserFavoriteItems = async (userId, userFavoriteItems) => { 
    const _db = getDb();
    try {
        const collection = _db.collection('users');
        const user = await collection.updateOne({ '_id': ObjectID(userId) }, { $set: { favoriteItems: userFavoriteItems } });
        return user;

    } catch (error) {
        return null;
    }
}