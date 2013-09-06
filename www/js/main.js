$(document).ready(function() {

  var service = require("service");
  var template = require("template");

  initNavigation();

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
    // local storage not supported by browser
    loadSchedule(teamId, function(schedule){
      renderGames(schedule);
    });
  }

}

function renderGames(schedule) {
  var data = {};
  data.game = schedule.games;
  data.team = schedule.team.name;
  template.render(data, $(":root"));
}

function loadSchedule(teamId, callback) {
  // FIXME: check if schedule for team is available
  $.getJSON('http://razfaz.there.ch/' + teamId + '/schedule.json', function(schedule) {
    callback(schedule);
  });
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
    $("nav a").click(function() {
      return false;
    });

    $("nav a").on(clickEvent, function() {
      var path, state, title;
      // paths are abolute if served from server, relative if local (phonegap)
      // normalize to relative
      path = $(this).attr('href');

      if(document.location.protocol.match("http[s]?:")) {
        // if site is served by http, absolute urls are used
        state = { teamId: service.getTeamId(path)};
        title = path.substring(1);
        history.pushState(state, title, path);
      } else {
        // local urls are relative (phonegap compatibility)
        state = { teamId: service.getTeamId("/" + path)};
        title = path;
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
      teamId = service.getTeamId(document.location.pathname);
    } else {
      teamId = service.getTeamId("/" + document.location.hash.substr(1));
    }
    console.log("teamId: " + teamId);
    renderCurrentTeam({'teamId': teamId});
  }
}
});

