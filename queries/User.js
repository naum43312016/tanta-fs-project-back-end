const { getDb } = require('../config/dbConnection');
const ObjectID = require('mongodb').ObjectID;
const USERS_PER_PAGE = 6;

exports.addUser = async (user) => {
    const _db = getDb();
    try {
        const collection = _db.collection('users');
        const result = await collection.insertOne(user);
        return result;
    } catch {
        return null;
    }
}

exports.getAllUsers = async () => {
    const _db = getDb();
    try {
        const collection = _db.collection('users');
        const result = await collection.find({}, { projection: { password: 0 } }).toArray();
        return result;
    } catch {
        return null;
    }
}

exports.getAllUsersForPage = async (page) => {
    const _db = getDb();
    try {
        page = page - 1;
        const collection = _db.collection('users');
        const usersCount = await collection.find({}).count();
        const users = await collection.find({}, { projection: { password: 0 } }).skip(page * USERS_PER_PAGE).limit(USERS_PER_PAGE).toArray();
        const pagesCount = Math.ceil(usersCount / USERS_PER_PAGE);
        return { pagesCount, users };
    } catch {
        return null;
    }
}
exports.getUserById = async (_id) => {
    const _db = getDb();
    try {
        const collection = _db.collection('users');
        const user = await collection.findOne({ "_id": ObjectID(_id) });
        return user;
    } catch {
        return null;
    }
}

exports.getUserByEmail = async (email) => {
    const _db = getDb();
    try {
        const collection = _db.collection('users');
        const user = await collection.findOne({ "email": email });
        return user;
    } catch {
        return null;
    }
}

exports.updateUserItems = async (userId, userItems) => {
    const _db = getDb();
    try {
        const collection = _db.collection('users');
        const user = await collection.updateOne({ "_id": ObjectID(userId) }, { $set: { items: userItems } });
        return user;
    } catch {
        return null;
    }
}

exports.addFavoriteItemFromUser = async (userId, itemId) => {
    const _db = getDb();
    try {
        const collection = _db.collection('users');
        const user = await collection.updateOne({ '_id': ObjectID(userId) }, { $push: { favoriteItems: `${itemId}` } });
        return user;
    } catch (error) {
        return null;
    }
}

exports.removeFavoriteItemFromUser = async (userId, itemId) => {
    const _db = getDb();
    try {
        const collection = _db.collection('users');
        const user = await collection.updateOne({ _id: ObjectID(userId) }, { $pull: { favoriteItems: `${itemId}` } });
        return user;

    } catch (error) {
        return null;
    }
}

exports.getUserFilter = async (id, type) => {
    const _db = getDb();
    try {
        const usersCollection = _db.collection('users');
        const itemsCollection = _db.collection('items');
        const purchasedItemsCollection = _db.collection('purchased items');
        const itemsArray = await itemsCollection.find().toArray();
        const purchasedItemsArray = await purchasedItemsCollection.find().toArray();
        const user = await usersCollection.findOne({ _id: ObjectID(id) })
        if (type === 'favorites') { //HERE --> I'm trying to get all items that are in the user's favorites array. 
            const userFavoriteItems = user.favoriteItems;
            const myArray = [];
            const filteredItems = userFavoriteItems.map(async (id) => {
                itemsArray.map(item => console.log(id))
            });
            return filteredItems;
        }
        else if (type === 'selling') { //HERE --> I'm trying to get all items that are in the user's items array.
            const userSellingItems = user.items;
            const filteredItems = itemsArray.filter(item => userSellingItems.includes(`${item._id}`));
            return filteredItems;
        } else if (type === 'purchased') { //HERE --> I'm trying to get all items that are in the user's purchased array.
            const userPurchasedItems = user.purchasedItems;
            const filteredItems = purchasedItemsArray.filter(item => userPurchasedItems.includes(`${item._id}`));
            return filteredItems;
        } else if (type === 'sold') { //HERE --> I'm trying to get all items that are in the user's sold array.
            const userSoldItems = user.soldItems;
            const filteredItems = purchasedItemsArray.filter(item => userSoldItems.includes());
            return filteredItems;
        }
    } catch {
        return null;
    }
}