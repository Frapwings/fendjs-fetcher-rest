/**
 * Module(s)
 */

var proto = require('./lib/proto');
var static = require('./lib/static');
var Fetcher = require('./lib/fetcher').Fetcher;

/**
 * Expose
 */

module.exports = function RESTfulable () {
  return function (Model) {
    var fetcher = new Fetcher();

    // static
    Model._base = '/' + Model.modelName.toLowerCase() + 's';
    Model._headers = {};
    Model.fetcher = fetcher;
    for (var key in static) {
      Model[key] = static[key];
    }

    // prototype
    Model.prototype.fetcher = fetcher;
    for (var key in proto) {
      Model.prototype[key] = proto[key];
    }
  };
}
