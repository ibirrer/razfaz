if(!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}

if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function(fn, scope) {
    for(var i = 0, len = this.length; i < len; ++i) {
      if (i in this) {
        fn.call(scope, this[i], i, this);
      }
    }
  };
}


// commonjs shim
(function() {
  var modules = {};

  // global functions
  define = function(moduleId, f) {
    var module = {};
    module.exports = {};
    modules[moduleId] = module;

    f(module.exports, module);
  }

  require = function(moduleId) {
    return modules[moduleId].exports;
  }
})();
