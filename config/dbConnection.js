const { MongoClient } = require("mongodb")

let url;
let dbName;
if(process.env.NODE_ENV=="test"){
    url = "mongodb+srv://test_user:test123456@cluster0.om7py.mongodb.net/<dbname>?retryWrites=true&w=majority";
    dbName = "test_tanta";//Test database
}else{
    url = process.env.DATABASE_URL;
    dbName = "Tanta";
}
const client = new MongoClient(url, { useUnifiedTopology: true,useNewUrlParser: true})
let _db;
let connection;
async function connectToDbServer() {
    try {
        connection = await client.connect();
        _db = client.db(dbName);
        console.log('Connected to Database ' + dbName);
    } catch (err) { 
        console.log(err);
    }
}

function getDb() { 
    return _db;
}

function getConnection(){
    return connection;
}

async function closeConnection(){
    try{
        await client.close();
    }catch{
        console.log("Can't close connection");
    }

}

module.exports = {connectToDbServer, getDb, getConnection,closeConnection}



