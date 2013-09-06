var fixture;
var template;

if (typeof require == "function" && typeof module == "object") {
  // node
  var buster = require("buster");
  template = require("../lib/template");
  var cheerio = require("cheerio");

  fixture = function(fixture) {
    $ = cheerio.load('<div>' + fixture + '</div>');
    return $('div');
  }

} else {
  // browser
  template = require("template");
  fixture = function(fixture) {
    return $('<div><div>' + fixture + '</div></div>').children();
  }
}

var assert = buster.assert;

buster.testCase("template", {
  "relativeToAbsoluteUrls": function () {
    var dom = fixture('<div href="bar"></div>');
    template.relativeToAbsoluteUrls($);
    assert.equals('<div href="/bar"></div>', dom.html());
  },

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
    expected =  ''
    + '<ul><li class="items"><span class="name">1</span></li>'
    + '<li class="items"><span class="name">2</span></li>'
    + '<li class="items"><span class="name">3</span></li></ul>';

    dom = fixture('<ul><li class="items"><span class="name"></span></li></ul>');
    template.render(data, dom);
    assert.equals(expected, dom.html());
  },

  "nested": function () {
    var data, dom, expected, tpl;
    data = {
        outer: { inner: "value" }
    }

    tpl =      '<div class="outer"><div class="inner"></div></div>\n';
    expected = '<div class="outer"><div class="inner">value</div></div>\n';

    dom = fixture(tpl);
    template.render(data, dom);
    assert.equals(expected, dom.html());
  },

  "nested list": function () {
    var data, dom, expected, tpl;
    data = {
      item: [
      {
        v1: "v1a", 
        v2: { l2: "n1a" }
      },
      {
        v1: "v1b", 
        v2: { l2: "n2b" }
      }
      ]
    }


    tpl = ''
    + '<div class="item">\n'
    + '<div class="v1"></div>\n'
    + '<div class="v2"><span class="l2"></span></div>\n'
    + '</div>';



    expected = ''
    + '<div class="item">\n'
    + '<div class="v1">v1a</div>\n'
    + '<div class="v2"><span class="l2">n1a</span></div>\n'
    + '</div>'
    + '<div class="item">\n'
    + '<div class="v1">v1b</div>\n'
    + '<div class="v2"><span class="l2">n2b</span></div>\n'
    + '</div>';

    dom = fixture(tpl);
    template.render(data, dom);
    assert.equals(expected, dom.html());
    console.log(dom.html);
  }
})