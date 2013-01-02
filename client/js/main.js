$(document).ready(function() {
  var teamId = 20160;
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
        console.log("render remote schedlue and save it");
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
  $("section#games").empty();
  var template = $("article#template").clone();
  for(i in schedule.games) {
    $('#games').append(renderGame(template, schedule.games[i]));
  }
}

function loadSchedule(teamId, callback) {
  // FIXME: check if schedule for team is available
  $.get('/api/schedules/' + teamId, function(schedule) {
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

