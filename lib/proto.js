/**
 * Extend RESTful feature for Fend.js prototype method of Model
 */

/**
 * Return a url for `path` relative to this model.
 *
 * Example:
 *
 *    var user = new User({ id: 5 });
 *    user.url('edit');
 *    // => "/users/5/edit"
 *
 * @param {String} path
 * @return {String}
 * @api public
 */

exports.url = function (path) {
  var Model = this.Model;
  var url = Model._base;
  var id = this.primary();
  if (0 == arguments.length) {
    return url + '/' + id;
  }
  return url + '/' + id + '/' + path;
};
