// scraper that reads a schedule from http://www.r-v-z.ch/index.php?id=73&nextPage=2&team_ID=20160 
// and inserts that schedule into the mongodb schedules collection

var teamId = 20160;
scrape(teamId, function(err, schedule) {
  var Db = require('mongodb').Db;
  var uri = process.env['MONGOLAB_URI']; 
  if(uri == null) { 
    uri = 'mongodb://localhost:27017/razfaz';
  }

  console.log("Connecting to " + uri);
  Db.connect(uri, {native_parser:true}, function(err, db) {
    db.collection('schedules', function(err, collection) {
      collection.update({"team.id":teamId}, schedule.team.id, {upsert:true, w:1}, function(err, result) {
        if(err) {
          console.log("Failed to insert schedule. Error: %s", err);
          return;
        }
        console.log("Inserted schedule: %s", JSON.stringify(schedule));
        db.close();
      });
    });
  });
});


function scrape(teamId, callback) {
  var http = require('http');
  var moment = require('moment');
  moment.weekdaysShort = ["SO","MO","DI","MI","DO","FR","SA"];
  http.get("http://www.r-v-z.ch/index.php?id=73&nextPage=2&team_ID=" + teamId, function(rvz) {
    var body = ''
    rvz.on('data', function (chunk) {
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
      
      var schedule = {};
      schedule.team = {
        "id": teamId,
        "name": "Raz Faz"
      };

      schedule.games = [];

      for(var i in games) {
        if(i==0) {
          continue;
        }

        var dateTime = moment(games[i][0], "DD.MM.YY hh:mm");
        var date = dateTime.format("ddd D.M")
        var time = dateTime.format("HH:mm");
        var home = games[i][3];
        var away = games[i][5];

        var venue = "A";
        var opponent = home;
        if(home == "Raz Faz") {
          venue = "H";
          opponent = away;
        }

        var result = games[i][6];

        if(result == "") {
          result = "...";
        }
        
        if(venue == "A") {
          result = result[2] + result[1] + result[0];
        }

        schedule.games[i-1] = {
          "venue": venue,
          "date": date,
          "time": time,
          "opponent": opponent,
          "result": result
        };
      } 

      callback(null,schedule);
    });

  }).on('error', function(e) {
    callback(e, null);
  });

}
