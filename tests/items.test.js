const {connectToDbServer,getDb,closeConnection} = require('../config/dbConnection');
const request = require('supertest');
const app = require('../app');
const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const User = require('../queries/User');

describe('Item endpoints', () => { 
    const OLD_ENV = process.env;
    let item;
    let user;
    beforeEach(() => {
      jest.resetModules() // most important - it clears the cache
      process.env = { ...OLD_ENV }; // make a copy
    });
  
    beforeAll(async () => {
      process.env.TOKEN_SECRET="0DFD0D2E450CB5789011D2B5CE6EB16B364A92EA3FCCEE61D0E511E2CBE7F751";//Not real secret, only for testing
      await connectToDbServer();
      user = await addMockUser();
      item = await addMockItem(user._id);
    });
  
    test('Add Favorite Item To User /item/:id/favorite', async () => {
        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.TOKEN_SECRET);
        const res = await request(app).post(`/item/${item._id}/favorite`).set({"Authorization":"Bearer " + token}).send();
        expect(res.statusCode).toEqual(200);
        const favorites = await User.getAllUserFavorites(user._id);
        const itemid = item._id;
        let isExist = false;
        for(let i =0;i<favorites.length;i++){
            if(itemid.toString()==favorites[i].toString()){
                isExist=true;
            }
        }
        expect(isExist).toEqual(true);
    })
  
    afterAll(async () => {
      const _db = getDb();
      //Just to be sure is test db
      if(_db.databaseName == "test_tanta"){
        const collection = _db.collection('items');
        await collection.remove({});
        const usersCollection = _db.collection('users');
        await usersCollection.remove({});
      }
      await closeConnection();
    })
})

async function addMockItem(userId){
    const _db = getDb();
    const item = {
        category:"Furniture",
        imageUrl:"http://res.cloudinary.com/noamas1/image/upload/",
        price:23,
        name:"dw",
        description:"Doggo",
        condition:"likeNew",
        status:"available",
        sellerId: ObjectID(userId)
    }
    const collection = _db.collection('items');
    const result = await collection.insertOne(item);
    return result.ops[0];
}

async function addMockUser(){
    const _db = getDb();
    const user = {
        email: "test@gmail.com",
        password: "test11",
        firstName: "test",
        lastName: "test",
        phone: "0548380915",
        userName: "test",
        address: "test address",
        role: "user",
        coins: 10,
        items: [],
        purchasedItems: [],
        favoriteItems: [],
        countUploads: 0
    }
    const collection = _db.collection('users');
    const result = await collection.insertOne(user);
    return result.ops[0];
}
