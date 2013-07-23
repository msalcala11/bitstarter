var express = require('express');

var app = express.createServer(express.logger());

app.use(express.static(process.env.PWD + '/'));

app.get('/', function(request, response) {
  var fs = require("fs");
  var buffer = new Buffer(fs.readFileSync("index.html"));
  var indexStr = buffer.toString("utf-8",0,buffer.length);
  response.send(indexStr);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
