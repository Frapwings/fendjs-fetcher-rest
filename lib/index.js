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
