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
  updateWindowHeight();
}

// updates the height of the overall site to the height of the content
function updateWindowHeight() {
  var height = $("#content").height();
  $("#wrapper").css("height", height);
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

function initNavigation() {
  var clickEvent = 'click';
  if (Modernizr.touch){
    clickEvent = 'touchstart';
  }


  var inProgress = false;
  var content = $("#content");

  content.bind(clickEvent, function(){});
    
  var callback = function() {
    // callback is called even if this callback was just added in the touchstart event of the menu-button.
    // Check 'inProgress' to avoid closing the menu when this first event fires
    if(content.hasClass("collapsed") && !inProgress) {
      content.removeClass("collapsed");
      content.unbind(clickEvent, callback);
    }
    inProgress = false;
  };


  $("#menu-button").bind(clickEvent, function() {
    if(content.hasClass("collapsed")) {
      content.unbind(clickEvent, callback);
      content.removeClass("collapsed");
    } else {
      inProgress = true;
      content.addClass("collapsed");
      content.bind(clickEvent, callback);
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
      
      content.unbind(clickEvent, callback);
      content.removeClass("collapsed");
    };


    // disable default click event that would cause a reload of the page
    $("a").click(function(){
      return false;
    });

    $("a").on(clickEvent, function() {
      var path = $(this).attr('href');
      var state = { teamId: getTeamId("/" + path)};
      var title = path;
      
      if(document.location.protocol.match("http[s]?:")) {
        history.pushState(state, title, path);
      } else {
        history.pushState(state, title, '#' + path);
      }
      renderCurrentTeam(state);

      return true;
    });

    $(window).on('popstate', function(event) {
      renderCurrentTeam(event.originalEvent.state);
    });
  }
}

