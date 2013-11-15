/**
 * module(s)
 */

var Collection = require('fendjs-collection');
var request = require('superagent');
var noop = function () {};

/**
 * export(s)
 */
exports.Fetcher = Fetcher;


/**
 * Fetcher
 */
function Fetcher () {
}

Fetcher.prototype.destroy = function (model, fn) {
  var self = model;
  var url = model.url();

  model.Model.emit('destroying', model);
  model.emit('destroying');

  request.del(url)
    .set(model.Model._headers)
    .end(function (res) {
      if (res.error) {
        return fn(error(res), res);
      }
      self.destroyed = true;

      self.Model.emit('destroy', self, res);
      self.emit('destroy');
      fn(null, res);
    });
};

Fetcher.prototype.save = function (model, fn) {
  var self = model;
  var url = model.Model.url();
  var key = model.Model.primaryKey;
  fn = fn || noop;

  if (!model.isValid()) {
    return fn(new Error('validation failed'));
  }

  model.Model.emit('saving', model);
  model.emit('saving');

  request.post(url)
    .set(model.Model._headers)
    .send(self)
    .end(function (res) {
      if (res.error) {
        return fn(error(res), res);
      }
      if (res.body) {
        self.primary(res.body[key]);
      }

      self.dirty = {};
      self.Model.emit('save', self, res);
      self.emit('save');
      fn(null, res);
    });
};

Fetcher.prototype.update = function (model, fn) {
  var self = model;
  var url = model.url();
  fn = fn || noop;

  if (!model.isValid()) {
    return fn(new Error('validation failed'));
  }

  model.Model.emit('saving', model);
  model.emit('saving');

  request.put(url)
    .set(model.Model._headers)
    .send(self)
    .end(function(res){
      if (res.error) {
        return fn(error(res), res);
      }

      self.dirty = {};
      self.Model.emit('save', self, res);
      self.emit('save');
      fn(null, res);
    });
};

Fetcher.prototype.destroyAll = function (Model, fn) {
  var url = Model.url('');

  request.del(url)
    .set(Model._headers)
    .end(function (res) {
      if (res.error) {
        return fn(error(res), null, res);
      }

      fn(null, [], res);
    });
};

Fetcher.prototype.all = function (Model, fn) {
  var url = Model.url('');

  request.get(url)
    .set(Model._headers)
    .end(function (res) {
      if (res.error) {
        return fn(error(res), null, res);
      }

      var col = new Collection;
      for (var i = 0, len = res.body.length; i < len; ++i) {
        col.push(new Model(res.body[i]));
      }
      fn(null, col, res);
    });
};

Fetcher.prototype.get = function (Model, id, fn) {
  var url = Model.url(id);

  request.get(url)
    .set(Model._headers)
    .end(function (res) {
      if (res.error) {
        return fn(error(res), null, res);
      }

      var model = new Model(res.body);
      fn(null, model, res);
    });
};


/**
 * Response error helper.
 *
 * @param {Response} er
 * @return {Error}
 * @api private
 */

function error (res) {
  return new Error('got ' + res.status + ' response');
}
