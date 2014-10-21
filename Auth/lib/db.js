var sqlite3 = require('sqlite3').verbose();
var dbConfig = require('../config/database.json')

module.exports = new sqlite3.Database(dbConfig[process.env.NODE_ENV].filename, 'OPEN_READWRITE')