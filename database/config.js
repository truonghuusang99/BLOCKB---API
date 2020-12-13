const { MongoClient } = require("mongodb");
const urlDB = "mongodb://localhost:27017/localhost";

module.exports.mongo =new MongoClient(urlDB, { useUnifiedTopology: true });
    