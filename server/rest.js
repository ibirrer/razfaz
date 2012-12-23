var http = require('http');
http.createServer(function (req, res) {
  
  var team = {
    'team': {
      'id':"20160",
      'name': "Raz Faz"
    }
  }

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(team));
}).listen(1337, '127.0.0.1');
