var createFixture;

if (typeof require == "function" && typeof module == "object") {
  // node
  var buster = require("buster");
  var template = require("../lib/template");
  var cheerio = require("cheerio");

  createFixture = function(fixture) {
    $ = cheerio.load(fixture);
    return $('div').parent();
  }

} else {
  // browser
  createFixture = function(fixture) {
    var html = $.parseHTML('<div id="fixture">' + fixture + '</div>');
    $(':root').append(html);
    return $('#fixture');
  }
}

var assert = buster.assert;

buster.testCase("template", {
  "simple by class": function () {
    var dom = createFixture('<div class="name"></div>');
    template.render({ name: "Raz Faz"}, dom);
    assert.equals('<div class="name">Raz Faz</div>', dom.html());
  }
})