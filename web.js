var port = process.env.PORT || 5000;

var fs = require('fs');
var http = require('http');

// get application version from package.json
var version = JSON.parse(fs.readFileSync("package.json", "utf8")).version;

http.createServer(function (req, res) {
  console.log("request %s", req.url);

  // serve appcache (html5 cache manifest)
  if(req.url == "/razfaz.appcache") {
    console.log("serve razfaz.appcache");

    fs.readFile("client" + req.url, 'utf8', function (err, data) {
      if (err) {
        console.error(err);
        serve404(res);
        return;
      }

      data = data.replace(/APP_VERSION/g, version);
      res.writeHead(200, {'Content-Type': "text/cache-manifest"});
      res.end(data);
    });
  }  


  // serve css
  else if(endsWith(req.url, ".css")) {
    serveClientFile(res, req.url, "text/css");
  }  
  
  // serve javascript
  else if(endsWith(req.url, ".js")) {
    serveClientFile(res, req.url, "text/javascript");
  }  
  
  // serve json from mongodb
  else if(req.url == "/api/schedules/20160") {
    getSchedule(20160, function(err, result){
      if(err) {
        serve404(res);
        return;
      }
      res.writeHead(200, {'Content-Type': "application/json"});
      res.end(JSON.stringify(result));
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
  
  // serve ico
  else if(endsWith(req.url, ".ico")) {
    serveClientFile(res, req.url, "image/x-icon");
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

function getSchedule(teamId, callback) {
  var Db = require('mongodb').Db;
  var uri = process.env['MONGOLAB_URI']; 
  if(uri == null) { 
    uri = 'mongodb://localhost:27017/razfaz';
  }

  console.log("Connecting to " + uri);
  Db.connect(uri, function(err, db) {
    if(err) {
      // happens if too many connections are opened in parallel (ab -c 200 -n 1000).
      // Connection pooling might help to avoid this error.
      // Consider https://github.com/coopernurse/node-pool
      console.error(err);
      callback(err,null);
      return;
    }

    db.collection('schedules', function(err, collection) {
      collection.findOne({"team.id":teamId}, function(err,result) {
        callback(err,result);
        db.close();
      });
    });
  });
}
