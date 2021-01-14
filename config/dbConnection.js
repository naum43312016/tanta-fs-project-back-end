const { MongoClient } = require("mongodb")

const url = process.env.DATABASE_URL
const client = new MongoClient(url, { useUnifiedTopology: true,useNewUrlParser: true})
const dbName = "Tanta"
let _db;

async function connectToDbServer() { 
    try {
        await client.connect()
        _db = client.db(dbName)
        console.log('Connected to Database')

    } catch (err) { 
        console.log(err)

    }
}

function getDb() { 
    return _db
}

module.exports = {connectToDbServer, getDb}



