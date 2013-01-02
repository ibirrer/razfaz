$(document).ready(function() {
  getSchedule(20160, function(schedule) {
    var template = $("article#template").remove();
    for(i in schedule.games) {
      $('#games').append(renderGame(template, schedule.games[i]));
    }
  });
});

function getSchedule(teamId, callback) {
  if (Modernizr.localstorage) {
    var localSchedule = localStorage["schedules." + teamId];
    if(localSchedule) {
      // FIXME: check if version is correct
      // schedule available locally
      console.log("serve from local");
      callback(JSON.parse(localSchedule));
      return;
    } else {
      // schedule not available locally -> store it
      loadSchedule(teamId, function(schedule) {
        console.log("save and serve");
        localStorage["schedules." + teamId] = JSON.stringify(schedule);
        callback(schedule);
      });
    }


  } else {
    // local storate not supported by browser -> load from remote
    loadSchedule(teamId, callback);
  }
}

function loadSchedule(teamId, callback) {
  // FIXME: check if schedule for team is available
  $.get('razfaz.json', function(schedule) {
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



