$(document).ready(function() {
  $.get('razfaz.json', function(data) {
    var template = $("article#template").remove();
    for(i in data.games) {
      $('#games').append(renderGame(template, data.games[i]));
    }
  });
});

function renderGame(tpl, game) {
  var template = tpl.clone();
  $(".venue", template).text(game.venue);
  $(".date", template).text(game.date);
  $(".time", template).text(game.time);
  $(".opponent", template).text(game.opponent);
  $(".result", template).text(game.result);
  return template;
}
