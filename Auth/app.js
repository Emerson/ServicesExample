#!/usr/bin/env node

var bodyParser = require('body-parser')
var express = require('express')
var app = express()

require('./lib/routes')(app)
app.use(bodyParser.json())

var server = app.listen(3030, function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})