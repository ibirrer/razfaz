var template = cheerio.load('index.html');
var engine = razfaz.engine();


render(tpl, )

data = {
  title: function() {
    return "foobar";
  }
	team: "Raz Faz",
  games: {
    []
  }

};

// presenter
engine.render(template, data, function() {

});




main
  head
  	pagename, team, season
  nav
  	navitem
  		pagename
  	navitem
  		...

  header
  	pagename, team, season

  content
  	games
  		game
        venue, date, time, opponent, result

  abscences
    abscence
      type, venue, date, time, opponent, player
  			
