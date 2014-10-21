# Upsurge Auth

A basic node http service that manages user creation and authentication.

## Requirements

* A recent version of Node
* sqlite

## Setup

* `npm install`
* `npm install db-migrate -g`
* `npm install sqlite3 -g`
* `db-migrate up` _(creates the users table in an sqlite database)_
