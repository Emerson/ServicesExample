#!/usr/bin/env node

var express = require('express')
var _ = require('lodash')
global._ = _
var app = express()

require('./lib/routes')(app)

var server = app.listen(3000, function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})