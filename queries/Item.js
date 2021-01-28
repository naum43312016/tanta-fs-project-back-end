const { getDb, getConnection } = require('../config/dbConnection');
const ObjectID = require('mongodb').ObjectID;
const User = require('./User');
const ITEMS_PER_PAGE = 12;

exports.add = async (item) => {
    const _db = getDb();
    try {
        const collection = _db.collection('items');
        const result = await collection.insertOne(item);
        if (result) {
            return result.ops[0];
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

exports.addItemToUser = async (item, userId) => {
    const user = await User.getUserById(userId);
    if (user) {
        const userCountUploads = user.countUploads + 1;
        const userCoins = user.coins;
        const userItems = user.items;
        userItems.push(ObjectID(item._id))
        const result = await User.updateUserItems(userId, userItems, userCountUploads, userCoins);
        if (result) {
            return true;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

exports.getAllItems = async () => {
    const _db = getDb();
    try {
        const collection = _db.collection('items');
        const result = await collection.find({}).toArray();
        return result;
    } catch {
        return null;
    }
}

exports.getAllPurchasedItems = async () => {
    const _db = getDb();
    try {
        const collection = _db.collection('purchased items');
        const result = await collection.find({}).toArray();
        return result;
    } catch {
        return null;
    }
}

exports.getItemById = async (_id) => {
    const _db = getDb();
    try {
        const collection = _db.collection('items');
        const item = await collection.findOne({ '_id': ObjectID(_id) });
        return item;

    } catch {
        return null;
    }

}

exports.getItemsByQuery = async (query, page) => {
    const _db = getDb();
    try {
        page = page - 1;
        const collection = _db.collection('items');
        const itemsCount = await collection.find(query).count();
        const items = await collection.find(query).skip(page * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).toArray();
        const pagesCount = Math.ceil(itemsCount / ITEMS_PER_PAGE);
        return { pagesCount, items };
    } catch {
        return null;
    }
}

exports.addFavoriteItemToUser = async (itemId, userId) => {
    const user = await User.getUserById(userId);
    if (user) {
        const result = await User.addFavoriteItemFromUser(userId, itemId);
        if (result) {
            return true;
        } else {
            return null;
        }
    }
    else {
        return null;
    }
}

exports.removeFavoriteItemFromUser = async (itemId, userId) => {
    const user = await User.getUserById(userId);
    if (user) {
        const result = await User.removeFavoriteItemFromUser(userId, itemId);
        if (result) {
            return true;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

exports.removeItem = async (user, item) => {
    try {
        const connection = getConnection();
        const _db = getDb();
        const session = connection.startSession();
        session.startTransaction();
        user.items = user.items.filter((id) => { if (id.toString() !== item._id.toString()) return id; })
        const usersCollection = _db.collection('users');
        const itemsCollection = _db.collection('items');
        await usersCollection.updateOne({ "_id": user._id }, { $set: { items: user.items } });
        await itemsCollection.deleteOne({ _id: item._id });
        await session.commitTransaction();
        session.endSession();
        return true;
    } catch {
        await session.abortTransaction();
        session.endSession();
        return false;
    }
}

exports.purchaseItem = async (item, buyer, seller) => {
    try {
        const connection = getConnection();
        const _db = getDb();
        const session = connection.startSession();
        session.startTransaction();
        const usersCollection = _db.collection('users');
        const itemsCollection = _db.collection('items');
        const purchasedItemsCollection = _db.collection('purchased items');
        await usersCollection.updateOne({_id: ObjectID(buyer._id)}, {$inc: {coins: -item.price}, $push: {purchasedItems: ObjectID(item._id)}});
        await usersCollection.updateOne({_id: ObjectID(seller._id)}, {$inc: {coins: item.price}, $push: {soldItems: ObjectID(item._id)}});
        await itemsCollection.updateOne({_id: ObjectID(item._id)}, {$set: {status: 'sold'}});
        await purchasedItemsCollection.insertOne(item);
        await itemsCollection.deleteOne({_id: ObjectID(item._id)});
        await session.commitTransaction();
        session.endSession();
        return true;
    }
    catch {
        await session.abortTransaction();
        session.endSession();
        return false;
    }
}