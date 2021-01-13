const { MongoClient } = require("mongodb");
const urlDB = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

module.exports.mongo =new MongoClient(urlDB, { useUnifiedTopology: true});
    