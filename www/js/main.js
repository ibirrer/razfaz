$(document).ready(function() {
  initNavigation();
});

function loadAndRenderGames(teamId) {
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

}


function renderGames(schedule) {
  var template = $("article.game").first().clone();
  $("#team").text(schedule.team.name);
  $("section#games").empty();
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
    return 22069; 
  }

  // get first part of path
  primaryPath = path.split('/')[1];

  // razfaz has a readable path synonym
  if(primaryPath == "razfaz") {
    return 22069;
  }

  return primaryPath;
}

function initNavigation() {
  var slidOpen = false;
  var slidable = $(".slidable");

  var clickEvent = 'click';
  if (Modernizr.touch){
    clickEvent = 'touchend';
  }

  $("#hamburger-button, nav a").bind(clickEvent, function() {
    if(slidOpen) { 
      slidable.removeClass("slid-open");
      slidOpen = false;
    } else {
      slidable.addClass("slid-open");
      slidOpen = true;
    }
  });

  // TODO: Make it work if history is not supported
  if (Modernizr.history) {
    var renderCurrentTeam = function(state) {
      if(state && state.teamId) {
        loadAndRenderGames(state.teamId);
      } else {
        loadAndRenderGames('razfaz');
      }
    };


    // disable default click event that would cause a reload of the page
    $("nav a").click(function(){
      return false;
    });

    $("nav a").on(clickEvent, function() {
      var path = $(this).attr('href');
      var state = { teamId: getTeamId("/" + path)};
      var title = path;

      if(document.location.protocol.match("http[s]?:")) {
        history.pushState(state, title, "/" + path);
      } else {
        history.pushState(state, title, '#' + path);
      }
      renderCurrentTeam(state);

      return true;
    });

    $(window).on('popstate', function(event) {
      // chrome fires popstate on refresh but others not
      if(event.originalEvent.state == null) {
        return;
      }
      renderCurrentTeam(event.originalEvent.state);
    });

    // get current path
    var teamId;
    if(document.location.protocol.match("http[s]?:")) {
      teamId = getTeamId(document.location.pathname);
    } else {
      teamId = getTeamId("/" + document.location.hash.substr(1));
    }
    console.log("teamId: " + teamId);
    renderCurrentTeam({'teamId': teamId});
  }
}

