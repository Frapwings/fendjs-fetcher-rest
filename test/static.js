var Modeler = require('fendjs-model');
var assert = require('assert');
var RESTfulable = require('fendjs-fetcher-rest');

Modeler.use(RESTfulable());

var User = Modeler('User')
  .attr('id', { type: 'number' })
  .attr('name', { type: 'string' })
  .attr('age', { type: 'number' })
  .headers({'X-API-TOKEN': 'token string'})

describe('Model.url()', function(){
  it('should return the base url', function(){
    assert('/users' == User.url());
  })
})

describe('Model.url(string)', function(){
  it('should join', function(){
    assert('/users/edit' == User.url('edit'));
  })
})

describe('Model.all(fn)', function(){
  beforeEach(function(done){
    var tobi = new User({ name: 'tobi', age: 2 });
    var loki = new User({ name: 'loki', age: 1 });
    var jane = new User({ name: 'jane', age: 8 });
    tobi.save(function(){
      loki.save(function(){
        jane.save(done);
      });
    });
  })

  afterEach(function(done){
    User.destroyAll(done);
  });

  it('should respond with a collection of all', function(done){
    User.all(function(err, users, res){
      assert(!err);
      assert(res);
      assert(res.req.header['X-API-TOKEN'] == 'token string')
      assert(3 == users.length());
      assert('tobi' == users.at(0).name());
      assert('loki' == users.at(1).name());
      assert('jane' == users.at(2).name());
      done();
    });
  })
})

describe('Model.get(id, fn)', function () {
  it('should error', function (done) {
    User.get('foo', function (err, model, res) {
      assert(err);
      assert(null == model);
      assert(res);
      done();
    });
  });

  it('should get a model', function (done) {
    var tobi = new User({ name: 'tobi', age: 2 });
    tobi.save(function () {
      User.get(tobi.id(), function (err, model, res) {
        assert(!err);
        assert(res);
        assert(tobi.name() === model.name());
        done();
      });
    });
  });
});

describe('Model.route(string)', function(){
  it('should set the base path for url', function(){
    User.route('/api/u');
    assert('/api/u/edit' == User.url('edit'));
  })
})
