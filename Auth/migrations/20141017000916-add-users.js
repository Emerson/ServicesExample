var dbm = require('db-migrate')
var type = dbm.dataType

exports.up = function(db, callback) {
  db.createTable('users', {
    id: {type: 'int', primaryKey: true, autoIncrement: true},
    email: 'string',
    first_name: 'string',
    last_name: 'string',
    encrypted_password: 'string'
  })
}

exports.down = function(db, callback) {
  db.dropTable('users', callback);
}
