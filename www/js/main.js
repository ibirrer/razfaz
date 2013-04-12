$(document).ready(function() {
  var teamId = 'razfaz';//getTeamId(window.location.pathname);

  if (Modernizr.localstorage) {
    var localScheduleAsString = localStorage["schedules." + teamId];
    localSchedule = localScheduleAsString == null ? null : JSON.parse(localScheduleAsString);
    if(localSchedule) {
      // schedule available locally
      console.log("render local schedule");
      renderGames(localSchedule);
      
      // check latest version
      if(navigator.onLine) {
        loadSchedule(teamId, function(remoteSchedule){
          if(remoteSchedule.version != localSchedule.version) {
            console.log("remote schedule is different. local: %d, remote: %d)", localSchedule.version, remoteSchedule.version);
            console.log("render remote schedule and save it");
            localStorage["schedules." + teamId] = JSON.stringify(remoteSchedule);
            renderGames(remoteSchedule);
          } else {
            console.log("remote schedule has the same version as local schedule: local: %d, remote: %d", 
              localSchedule.version, remoteSchedule.version);
          }
        }); 
      }
      return;
    } else {
      // schedule not available locally -> load and store it
      loadSchedule(teamId, function(schedule) {
        console.log("render remote schedule and save it");
        localStorage["schedules." + teamId] = JSON.stringify(schedule);
        renderGames(schedule);
      });
    }
  } else {
    // local storate not supported by browser
    loadSchedule(teamId, function(schedule){
      renderGames(schedule);
    });
  }
});


function renderGames(schedule) {
  $("#team").text(schedule.team.name);
  $("section#games").empty();
  var template = $("article#template").clone();
  for(i in schedule.games) {
    $('#games').append(renderGame(template, schedule.games[i]));
  }
}

function loadSchedule(teamId, callback) {
  // FIXME: check if schedule for team is available
  $.getJSON('http://razfaz.there.ch/' + teamId + '/schedule.json', function(schedule) {
    callback(schedule);
  });
}

function renderGame(tpl, game) {
  var template = tpl.clone();
  $(".venue", template).text(game.venue);
  $(".date", template).text(game.date);
  $(".time", template).text(game.time);
  $(".opponent", template).text(game.opponent);
  $(".result", template).text(game.result);
  return template;
}

function getTeamId(path) {
  var primaryPath;
  
  // serve razfaz as default team
  if(path == "/") {
    return 20160; 
  }
  
  // get first part of path
  primaryPath = path.split('/')[1];

  // razfaz has a readable path synonym
  if(primaryPath == "razfaz") {
    return 20160;
  }

  return primaryPath;
}
