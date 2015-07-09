'use strict';

var express = require('express');
var harp    = require('harp');

var app, PORT;

app = express();

app.use(express.static(__dirname + '/public'));
app.use(harp.mount(__dirname + '/public'));

PORT = process.env.PORT || 8000;

app.listen(PORT, function onListen () {
  console.log('Listening on port', PORT);
});
