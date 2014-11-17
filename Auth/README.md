# Upsurge Auth

A basic node http service that manages user creation and authentication.

## Requirements

* A recent version of Node
* Postgres

## Setup

* `npm install`
* `npm install db-migrate -g`
* `db-migrate up --config config/database.json` _(creates the users table in an Postgres database)_

## Running the Tests

* `db-migrate up --config ./config/database.json -e test`
* `mocha`