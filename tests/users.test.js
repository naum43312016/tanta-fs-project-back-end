const {connectToDbServer,getDb,closeConnection} = require('../config/dbConnection');
const request = require('supertest');
const app = require('../app');

describe('Auth endpoints', () => { 
    const OLD_ENV = process.env;
  
    beforeEach(() => {
      jest.resetModules() // most important - it clears the cache
      process.env = { ...OLD_ENV }; // make a copy
    });
  
    beforeAll(async () => {
      process.env.TOKEN_SECRET="0DFD0D2E450CB5789011D2B5CE6EB16B364A92EA3FCCEE61D0E511E2CBE7F751";//Not real secret, only for testing
      await connectToDbServer();
    });
  
    test('Signup add user good data', async () => {
      const res = await request(app).post('/signup').send(getMockUser());
      expect(res.statusCode).toEqual(200);
    })

    test('Signup user already exist', async () => {
        const res = await request(app).post('/signup').send(getMockUser());
        expect(res.statusCode).toEqual(409);
      })
  
    test('Signup invalid data', async () => {
      const res = await request(app).post('/signup').send({email: "testgmail.com",password: "222"});
      expect(res.statusCode).toEqual(409);
    })

    test('Login valid user', async () => {
      const res = await request(app).post('/login').send({email: "test@gmail.com",password: "test11"});
      expect(res.statusCode).toEqual(200);
    })

    test('Login invalid user', async () => {
      const res = await request(app).post('/login').send({email: "test@gmail.com",password: "invalidpassword"});
      expect(res.statusCode).toEqual(409);
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

function getMockUser(){
    return {
        email: "test@gmail.com",
        password: "test11",
        confirmPassword: "test11",
        firstName: "test",
        lastName: "test",
        phone: "0548380915",
        userName: "test",
        address: "test address"
    }
}