#!/usr/bin/env node

var bodyParser = require('body-parser')
var program = require('commander')
var express = require('express')
var app = express()

program
  .version('0.0.1')
  .option('-p, --port [port]', 'Specify the port this app should listen on')
  .parse(process.argv)

var port = 3030;
if(program.port) {
  port = program.port
}

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
require('./lib/routes')(app)

var server = app.listen(port, function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})