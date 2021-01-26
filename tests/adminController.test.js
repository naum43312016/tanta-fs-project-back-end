const {connectToDbServer,getDb,closeConnection} = require('../config/dbConnection');
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');


describe('Admin endpoints', () => {
  let adminToken;

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // most important - it clears the cache
    process.env = { ...OLD_ENV }; // make a copy
  });

  beforeAll(async () => {
    process.env.TOKEN_SECRET="0DFD0D2E450CB5789011D2B5CE6EB16B364A92EA3FCCEE61D0E511E2CBE7F751";//Not real secret, only for testing
    await connectToDbServer();
    const insertedUser = await addAdminToTestDb();
    adminToken = jwt.sign(
      {
          _id: insertedUser._id
      },
      process.env.TOKEN_SECRET);
  });

  test('Admin getAllUsers /admin/users without token', async () => {
    const res = await request(app).get('/admin/users');
    //Should get status code 403 no token
    expect(res.statusCode).toEqual(403);
  })

  test('Admin getAllUsers /admin/users with token', async () => {
    const res = await request(app).get('/admin/users').set({"Authorization":"Bearer " + adminToken});
    //Should get status code 200 valid token
    expect(res.statusCode).toEqual(200);
  })

  afterAll(async () => {
    const _db = getDb();
    //Just to be sure is test db
    if(_db.databaseName == "test_tanta"){
      const collection = getDb().collection('users');
      await collection.remove({});
    }
    await closeConnection();
  })
})

const addAdminToTestDb = async () => {
  const _db = getDb();
  try {
    const user = {
      email: "admin@gmail.com",
      password: "admin1",
      firstName: "admin",
      lastName: "admin",
      phone: "0548380915",
      userName: "admin",
      address: "admin address",
      role: "admin"
    }
    const collection = _db.collection('users');
    const result = await collection.insertOne(user);
    const insertedUser = result.ops[0];
    return insertedUser;
  } catch {
    return null;
  }
}