var http = require('http');
var moment = require('moment');
moment.weekdaysShort = ["SO","MO","DI","MI","DO","FR","SA"];
teamId = 20160;
http.get("http://www.r-v-z.ch/index.php?id=73&nextPage=2&team_ID=" + teamId, function(rvz) {
  // console.log("Got response: " + rvz.statusCode);

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

      schedule.games[i-1] = {
        "venue": venue,
        "date": date,
        "time": time,
        "opponent": opponent,
        "result": result
      };
    } 

    console.log(JSON.stringify(schedule,null,2));
  });

}).on('error', function(e) {
  console.log("Got error: " + e.message);
});


