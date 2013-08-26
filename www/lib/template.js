(function () {
  "use strict";


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

  exports.template = {};
  exports.template.render = render;
})();