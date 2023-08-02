const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://root:zScrKdLNPrsjBbUG@cluster123.tkzqvza.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

module.exports = { client };