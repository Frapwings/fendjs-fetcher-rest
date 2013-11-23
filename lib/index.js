/**
 * Module(s)
 */

var proto = require('./proto');
var static = require('./static');
var Fetcher = require('./fetcher').Fetcher;

/**
 * Expose
 */

module.exports = function RESTfulable () {
  return function (Model) {
    // static
    Model._base = '/' + Model.modelName.toLowerCase() + 's';
    Model._headers = {};
    Model.createFetcher = function () { return new Fetcher(); };
    Model.fetcher = new Fetcher();
    for (var key in static) {
      Model[key] = static[key];
    }

    // prototype
    for (var key in proto) {
      Model.prototype[key] = proto[key];
    }
  };
}
