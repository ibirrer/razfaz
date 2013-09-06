if (typeof define !== 'function') {
  var define = function(id, f) {
    f(exports, module.exports);
  }
}


define("template", function(exports, module) {
  "use strict";

  function relativeToAbsoluteUrls($) {
    $('[href]').each(function(i, elem) {
      var path = $(elem).attr('href');
      $(elem).attr('href', '/' + path)
    });

    $('[src]').each(function(i, elem) {
      var path = $(elem).attr('src');
      $(elem).attr('src', '/' + path)
    });
  }

  function render(data, dom) {
    Object.keys(data).forEach(function (key) {
      var value = data[key];
      renderValue(key, value, dom);
    });

    function renderValue(key, value, path) {
      var tag, item, parent;

      tag = getTag(key, path);
      if (typeof value === 'string') {
        tag.text(value);
      } else if (Array.isArray(value)) {
        item = tag.first().clone();
        parent = tag.parent();
        parent.empty();
        value.forEach(function (element, index) {
          if (typeof element === 'object') {
            item = item.clone();
            parent.append(item);
            // recursion
            render(element, item);
          }
        });
      } else if (typeof value === 'object') {
        render(value, tag);
      }
    }

    function getTag(key, path) {
      var tag = path.find('#' + key);
      if (tag.length === 0) {
        tag = path.find('.' + key);
      }
      return tag;
    }
  }

  exports.render = render;
  exports.relativeToAbsoluteUrls = relativeToAbsoluteUrls;
});