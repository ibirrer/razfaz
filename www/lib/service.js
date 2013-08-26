(function () {
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

  exports.service = service;
})();