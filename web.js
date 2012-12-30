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
  
  // serve json from mongodb
  else if(endsWith(req.url, ".json")) {
    var Db = require('mongodb').Db;
    var uri = process.env['MONGOLAB_URI']; 
    if(uri == null) { 
      uri = 'mongodb://localhost:27017/razfaz';
    }

    console.log("Connecting to " + uri);
    Db.connect(uri, function(err, db) {
      if(err) { // connection pooling might help to avoid this error
        console.log(err);
        serve404(res);
        return;
      }
      db.collection('schedules', function(err, collection) {
        var teamId = 20160;
        collection.findOne({"team.id":teamId}, function(err,result) {
          if (err) {
            serve404(res);
            return;
          }

          console.log("serve schedule for team %d", teamId);
          res.writeHead(200, {'Content-Type': "application/json"});
          res.end(JSON.stringify(result));
          db.close();
        });
      });
    });
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
}).listen(port, '0.0.0.0');

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
