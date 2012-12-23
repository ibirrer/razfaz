var http = require('http');
http.createServer(function (req, res) {
  teamId = 20160;
  http.get("http://www.r-v-z.ch/index.php?id=73&nextPage=2&team_ID=" + teamId, function(rvz) {
    console.log("Got response: " + rvz.statusCode);

    var body = ''
    rvz.on('data', function (chunk) {
      console.log('chunk');
      body += chunk;
    });

    rvz.on('end', function() {
      var cheerio = require('cheerio'),
      $ = cheerio.load(body);
      var games = $('a[title="Definitives Datum"]')
        .parent() // td
        .parent() // tr
        .parent() // tbody
        .children().map(function(i,elem) { // tr's
          return $(this).children().map(function(j,e) { // td's
            return $(this).text();
          });
        });
      

      console.log(games.join('\n'));

      console.log("end");
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end("foo");
    });



  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

