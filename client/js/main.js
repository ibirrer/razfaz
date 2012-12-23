var template = $("article#template").remove();

var game1 = {
  'venue': "H",
  'date': "Di 18.1",
  'time': "20:15",
  'opponent': "Hydra",
  'result': "0:3"
}

var game2 = {
  'venue': "A",
  'date': "MO 22.11",
  'time': "20:30",
  'opponent': "Volley Grüningen",
  'result': "1:3"
}


$('#games').append(renderGame(template, game1));
$('#games').append(renderGame(template, game2));



function renderGame(tpl, game) {
  var template = tpl.clone();
  $(".venue", template).text(game.venue);
  $(".date", template).text(game.date);
  $(".time", template).text(game.time);
  $(".opponent", template).text(game.opponent);
  $(".result", template).text(game.result);
  return template;
}
