var port = process.env.PORT || 5000;

var fs = require('fs');
var http = require('http');
http.createServer(function (req, res) {
  console.log("request %s", req.url);

  // serve css
  if(endsWith(req.url, ".css")) {
    serveClientFile(res, req.url, "text/css");
  }  
  
  // serve javascript
  else if(endsWith(req.url, ".js")) {
    serveClientFile(res, req.url, "text/javascript");
  }  
  
  // serve json
  else if(endsWith(req.url, ".json")) {
    serveClientFile(res, req.url, "application/json");
  }  

  // serve html
  else if(endsWith(req.url, ".html") || endsWith(req.url, "/")) {
    var file = req.url;
    if(req.url == "/") {
      file = "/index.html"
    } 
    serveClientFile(res, file, "text/html");
  }
  
  // serve png
  else if(endsWith(req.url, ".png")) {
    serveClientFile(res, req.url, "image/png");
  }

  // 404 if request cannot be served
  else {
    serve404(res);
  }
}).listen(port, 'localhost');

console.log('Server running at port %d', port);


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function serveClientFile(res, file, mimeType) {
  console.log("serve client file %s", file);
  fs.readFile("client" + file, function (err, data) {
    if (err) {
      serve404(res);
      return;
    }
    res.writeHead(200, {'Content-Type': mimeType});
    res.end(data);
  });
}

function serve404(res) {
  fs.readFile("client/404.html", function (err, data) {
    if (err) throw err;
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end(data);
  });
}
