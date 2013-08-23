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
    return $('<div><div>' + fixture + '</div></div>').children();
  }
}

var assert = buster.assert;

buster.testCase("template", {
  "simple by class": function () {
    var dom = createFixture('<div class="name"></div>');
    template.render({ name: "razfaz"}, dom);
    assert.equals('<div class="name">razfaz</div>', dom.html());
  },

  "simple by id": function () {
    var dom = createFixture('<div id="name"></div>');
    template.render({ name: "razfaz"}, dom);
    assert.equals('<div id="name">razfaz</div>', dom.html());
  }
})