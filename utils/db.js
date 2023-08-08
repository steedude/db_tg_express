require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const { MongoClient } = require('mongodb')
const uri = process.env.DB_URI
const client = new MongoClient(uri)

module.exports = { client }
