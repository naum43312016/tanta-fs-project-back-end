const { MongoClient } = require("mongodb")

const url = "mongodb+srv://tanta-admin:admin@cluster0.om7py.mongodb.net/<dbname>?retryWrites=true&w=majority"
const client = new MongoClient(url, { useUnifiedTopology: true,useNewUrlParser: true})
const dbName = "Tanta"

async function connectToDbServer() { 
    try {
        await client.connect()
        client.db = dbName
        console.log('Connected to Database')

    } catch (err) { 
        console.log(err)

    }
}

function getDb() { 
    return dbName
}

module.exports = {connectToDbServer, getDb}



