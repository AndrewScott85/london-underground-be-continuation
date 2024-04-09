const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const dbName = 'tubulardb';

const connectToDb = async () => {
    console.log(`In connect`);
    await client.connect();
    console.log(`MongoDB client is connected`);
    const db = client.db(dbName);
    console.log(`Database is ${dbName}`);
    return db;
}

module.exports.connectToDb = connectToDb;

