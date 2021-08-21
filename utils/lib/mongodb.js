require('dotenv').config;
const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGODB_UN}:${process.env.MONGODB_PASS}@{process.env.MONGODB_URL}`;

const Client = new MongoClient(uri, { useUnifiedTopology: true });

export default Client;
//want logic to do handler here. looked at https://codeconqueror.com/blog/using-a-database-with-next-js/
