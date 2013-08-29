if (typeof define !== 'function') {
  var define = function(id, f) {
    f(exports, module.exports);
  }
}


define("service", function(exports, module) {
  "use strict";

  var service = {
    getTeamId: function (path) {
      var primaryPath;

      if(path == "/") {
        path = "/razfaz"
      }

      primaryPath = path.split('/')[1];
      if(primaryPath == "razfaz") {
        return 22069;
      }

      return primaryPath;
    }
  }

  module.exports = service;
});
