var Sequelize = require('sequelize')

var dbConfig = require('../config/database.json')
var username = dbConfig[process.env.NODE_ENV].username
var password = dbConfig[process.env.NODE_ENV].password
var database = dbConfig[process.env.NODE_ENV].database
var host = dbConfig[process.env.NODE_ENV].host

console.log('connecting to', database)
module.exports = new Sequelize(database, username, password, {
  host: host,
  logging: false,
  dialect: 'postgres',
  define: {
    underscored: true
  }
})