const {getDb} = require('../config/dbConnection');
const ObjectID = require('mongodb').ObjectID;

exports.add = async (category) => {
    const _db = getDb();
    try{
        const collection = _db.collection('categories');
        const result = await collection.insertOne(category);
        return result;
    }catch{
        return null;
    }
}

exports.getAll = async () => {
    const _db = getDb();
    try{
        const collection = _db.collection('categories');
        const result = await collection.find({}).toArray();
        return result;
    }catch{
        return null;
    }
}

exports.getById = async (_id) => {
    const _db = getDb();
    try{
        const collection = _db.collection('categories');
        const result = await collection.findOne({"_id" :ObjectID(_id)})
        return result;
    }catch{
        return null;
    }
}

exports.getCategoryByName = async (name) => {
    const _db = getDb();
    try{
        const collection = _db.collection('categories');
        const result = await collection.findOne({"name" :name})
        return result;
    }catch{
        return null;
    }
}