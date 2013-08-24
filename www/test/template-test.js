var fixture;

if (typeof require == "function" && typeof module == "object") {
  // node
  var buster = require("buster");
  var template = require("../lib/template");
  var cheerio = require("cheerio");

  fixture = function(fixture) {
    $ = cheerio.load('<div>' + fixture + '</div>');
    return $('div');
  }

} else {
  // browser
  fixture = function(fixture) {
    return $('<div><div>' + fixture + '</div></div>').children();
  }
}

var assert = buster.assert;

buster.testCase("template", {
  "simple by class": function () {
    var dom = fixture('<div class="name"></div>');
    template.render({ name: "razfaz"}, dom);
    assert.equals('<div class="name">razfaz</div>', dom.html());
  },

  "simple by id": function () {
    var dom = fixture('<div id="name"></div>');
    template.render({ name: "razfaz"}, dom);
    assert.equals('<div id="name">razfaz</div>', dom.html());
  },

  "two occurences": function () {
    var dom = fixture('<div class="name"></div><div class="name"></div>');
    template.render({ name: "razfaz"}, dom);
    assert.equals('<div class="name">razfaz</div><div class="name">razfaz</div>', dom.html());
  },

  "simple list": function () {
    var data, dom, expected;
    data = {
      items: [
      {name:"1"},
      {name:"2"},
      {name:"3"}]
    };
    expected =   '<ul><li class="items"><span class="name">1</span></li>'
               + '<li class="items"><span class="name">2</span></li>'
               + '<li class="items"><span class="name">3</span></li></ul>';

    dom = fixture('<ul><li class="items"><span class="name"></span></li></ul>');
    template.render(data, dom);
    assert.equals(expected, dom.html());
  }
})