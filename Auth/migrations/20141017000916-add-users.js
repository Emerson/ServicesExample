var dbm = require('db-migrate')
var type = dbm.dataType

exports.up = function(db, callback) {
  db.createTable('users', {
    id: {type: 'int', primaryKey: true, autoIncrement: true},
    email: 'string',
    first_name: 'string',
    last_name: 'string',
    encrypted_password: 'string',
    auth_token: 'string',
    auth_token_expires_at: {type: 'bigint'},
    created_at: {type: 'datetime'},
    updated_at: {type: 'datetime'}
  }, callback)
}

exports.down = function(db, callback) {
  db.dropTable('users', callback);
}
