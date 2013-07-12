var port = process.env.PORT || 5000;

var fs = require('fs');
var http = require('http');

// config
var appcacheDisabled = process.env.RAZFAZ_APPCACHE 
    && process.env.RAZFAZ_APPCACHE == 'false';

// get application version from package.json
var version = JSON.parse(fs.readFileSync("package.json", "utf8")).version;

http.createServer(function (req, res) {
  console.log("request %s", req.url);

  // serve appcache (html5 cache manifest)
  if(req.url == "/razfaz.appcache") {
    if(appcacheDisabled) {
      serve404(res);
      return;
    }

    fs.readFile("www" + req.url, 'utf8', function (err, data) {
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

  // serve fonts
  else if(endsWith(req.url, ".woff")) {
    serveClientFile(res, req.url, "application/x-font-woff");
  }  
  
  // serve json from mongodb
  else if(endsWith(req.url, "schedule.json")) {
    // URLs must be in the following format: /teamId/schedule.json
    var teamId = getTeamId(req.url); 

    console.log("teamId: %s", teamId);

    getSchedule(teamId, function(err, result){
      if(err || result == null) {
        serve404(res);
        return;
      }
      res.writeHead(200, 
      {
        'Content-Type': "application/json",
        'Access-Control-Allow-Origin': "*"
      });
      res.end(JSON.stringify(result));
    });
  }

  // serve ics
  else if(req.url == "/razfaz/schedule.ics") {
    serveClientFile(res, "/razfaz-schedule.ics", "text/calendar");
  }

  // serve png
  else if(endsWith(req.url, ".png")) {
    serveClientFile(res, req.url, "image/png");
  }

  // serve ico
  else if(endsWith(req.url, ".ico")) {
    serveClientFile(res, req.url, "image/x-icon");
  }  

  // serve html
  else if(req.url == "/" || (req.url.split('/').length == 3 && endsWith(req.url, "schedule"))) {
    serveClientFile(res, "/index.html", "text/html");
  }

  // serve checkbox
  else if(req.url == "/checkbox.html") {
    serveClientFile(res, "/checkbox.html", "text/html");
  }

  // serve absences
  else if(req.url == "/absences.html") {
    serveClientFile(res, "/absences.html", "text/html");
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
  // console.log("serve client file %s", file);
  fs.readFile("www" + file, function (err, data) {
    if (err) {
      serve404(res);
      return;
    }
    res.writeHead(200, {'Content-Type': mimeType});
    res.end(data);
  });
}

function serve404(res) {
  fs.readFile("www/404.html", function (err, data) {
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

function getTeamId(path) {
  // get first part of path
  var primaryPath = path.split('/')[1];

  // razfaz has a readable path synonym
  if(primaryPath == "razfaz") {
    return 20160;
  }

  return parseInt(primaryPath);
}
