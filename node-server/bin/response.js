var http = require('http');
http.ServerResponse.prototype.respond = function(content, status) {
  if ('undefined' == typeof status) { // only one parameter found
    status = 200;
  }
  if (status != 200) { // error
    content = {
      "code": status,
      "status": http.STATUS_CODES[status],
      "message": content && content.toString() || null
    };
  }
  var respondData = {
    "result": content
  };
  // respond with JSON data
  this.setHeader('Content-Type', 'application/json');
  this.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  this.setHeader("Pragma", "no-cache");
  this.setHeader("Expires", 0);
  this.send(JSON.stringify(respondData) + "\n", status);
};