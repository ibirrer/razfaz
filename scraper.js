// scrapes schedule from http://www.svrt.ch/index.php?id=73&nextPage=2&team_ID=TEAM_ID
// and inserts that schedule into the mongodb collection schedules

var teamIds = [
22069, // Raz Faz
22244, // Gay Sport 2
22192, // Dübi Volley
22114, // Obfelden Volley
22173, // Einsiedeln
22167  // Kanti Limmattal
];

for(i in teamIds) {
  var teamId = teamIds[i];
  console.log("get schedule for team " + teamId);
  scrape(teamId, function(err, schedule) {
    if(err) {console.log("ERROR: " + err); return;}
    saveSchedule(schedule);
  });
}

setTimeout(function() { 
        console.log("quick fix that this script does not always end -> kill after 60 seconds");  
        process.exit(1);
      }, 60 * 1000);

function saveSchedule(schedule) {
  var Db = require('mongodb').Db;
  var uri = process.env['MONGOLAB_URI']; 
  if(uri == null) { 
    uri = 'mongodb://localhost:27017/razfaz';
  }

  console.log("Connecting to " + uri);
  Db.connect(uri, function(err, db) {
    if(err) {console.log("ERROR: " + err); return;}
    db.collection('schedules', function(err, collection) {
      if(err) {console.log("ERROR: " + err); db.close(); return;}
      // check if schedule already exists or has changed
      collection.findOne(schedule, function(err, doc) {
        if(err) {console.log("ERROR: " + err); db.close(); return;}

        if(doc != null) {
          console.log("Skip schedule because it is already stored and has not changed since the last update");
          db.close();
          return;
        }

        // schedule either not yet saved or changed -> upsert it
        collection.update({"team.id":schedule.team.id}, 
          {"$set": {"team": schedule.team, "games": schedule.games}, 
            "$inc": {"version":1}},
          {upsert:true}, function(err, result) {

          if(err) {console.log("ERROR: " + err); db.close(); return;}
          console.log("Inserted schedule: %s", schedule.team.id);
          db.close();
        });
      });
    });
  });
}


function scrape(teamId, callback) {
  var http = require('http');
  var moment = require('moment');
  moment.lang('en', {
    weekdaysShort : ["SO","MO","DI","MI","DO","FR","SA"]
  });
  var url ="http://www.svrz.ch/index.php?id=73&nextPage=2&team_ID=" + teamId;
  http.get(url, function(rvz) {
    var body = ''
    rvz.on('data', function (chunk) {
      body += chunk;
    });

    rvz.on('end', function() {
      var cheerio = require('cheerio'),
      $ = cheerio.load(body);

      var teamName = $('table.tx_clicsvws_pi1_mainTableGroup tr td').eq(1).text();
      console.log("teamName: %s", teamName);

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
        "name": teamName
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
        if(home == teamName) {
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

      if(games.length <= 0) {
        callback("no scheduled games found on " + url, null);
        return;
      }

      callback(null,schedule);
    });

  }).on('error', function(e) {
    callback(e, null);
  });

}
