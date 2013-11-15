var Modeler = require('fendjs-model');
var assert = require('assert');
var request = require('superagent');
var RESTfulable = require('fendjs-model-restful');

Modeler.use(RESTfulable());

var User = Modeler('User')
  .attr('id', { type: 'number' })
  .attr('name', { type: 'string' })
  .attr('age', { type: 'number' })
  .headers({'X-API-TOKEN': 'token string'});

function required (attr) {
  return function (Model) {
    Model.validate(function (model) {
      if (!model.has(attr)) {
        model.error(attr, 'field required');
      }
    });
  }
}

var Pet = Modeler('Pet')
  .attr('id')
  .attr('name')
  .attr('species')
  .use(required('name'))
  .headers({'X-API-TOKEN': 'token string'});

function reset(fn) {
  request.del('/', function(res){
    fn();
  });
}

describe('Model#destroy()', function(){
  describe('when new', function(){
    it('should error', function(done){
      var pet = new Pet;
      pet.destroy(function(err){
        assert('not saved' == err.message);
        done();
      });
    })
  })

  describe('when old', function(){
    it('should DEL /:model/:id', function(done){
      var pet = new Pet({ name: 'Tobi' });
      pet.save(function(err){
        assert(!err);
        pet.destroy(function(err){
          assert(!err);
          assert(pet.destroyed);
          done();
        });
      });
    })

    it('should emit "destroy"', function(done){
      var pet = new Pet({ name: 'Tobi' });
      pet.save(function(err){
        assert(!err);
        pet.on('destroy', done);
        pet.destroy();
      });
    })

    it('should emit "destroying" on the constructor', function(done){
      var pet = new Pet({ name: 'Tobi' });
      pet.save(function(err){
        assert(!err);
        Pet.once('destroying', function(obj){
          assert(pet == obj);
          done();
        });
        pet.destroy();
      });
    })

    it('should emit "destroy"', function(done){
      var pet = new Pet({ name: 'Tobi' });
      pet.save(function(err){
        assert(!err);
        pet.on('destroy', done);
        pet.destroy();
      });
    })

    it('should emit "destroy" on the constructor', function(done){
      var pet = new Pet({ name: 'Tobi' });
      pet.save(function(err){
        assert(!err);
        Pet.once('destroy', function(obj){
          assert(pet == obj);
          done();
        });
        pet.destroy();
      });
    })
    
    it('should emit "destroy" and pass response', function(done){
      var pet = new Pet({ name: 'Tobi' });
      pet.save(function(err){
        assert(!err);
        Pet.once('destroy', function(obj, res){
          assert(pet == obj);
          assert(res);
          assert(res.req.header['X-API-TOKEN'] == 'token string');
          done();
        });
        pet.destroy();
      });
    });
  })
})

describe('Model#save(fn)', function(){
  beforeEach(reset);

  describe('when new', function(){
    describe('and valid', function(){
      it('should POST to /:model', function(done){
        var pet = new Pet({ name: 'Tobi', species: 'Ferret' });
        pet.save(function(){
          assert(0 == pet.id());
          done();
        });
      })

      it('should emit "saving"', function(done){
        var pet = new Pet({ name: 'Tobi', species: 'Ferret' });
        pet.on('saving', function(){
          assert(pet.isNew());
          done();
        });
        pet.save();
      })

      it('should emit "saving" on the constructor', function(done){
        var pet = new Pet({ name: 'Tobi', species: 'Ferret' });
        Pet.once('saving', function(obj){
          assert(pet == obj);
          done();
        });
        pet.save();
      })

      it('should emit "save"', function(done){
        var pet = new Pet({ name: 'Tobi', species: 'Ferret' });
        pet.on('save', done);
        pet.save();
      })

      it('should emit "save" on the constructor', function(done){
        var pet = new Pet({ name: 'Tobi', species: 'Ferret' });
        Pet.once('save', function(obj){
          assert(pet == obj);
          done();
        });
        pet.save();
      })
    })

    describe('and invalid', function(){
      it('should error', function(done){
        var pet = new Pet;
        pet.save(function(err){
          assert('validation failed' == err.message);
          assert(1 == pet.errors.length);
          assert('name' == pet.errors[0].attr);
          assert('field required' == pet.errors[0].message);
          assert(null == pet.id());
          done();
        });
      })
    })
  })

  describe('when old', function(){
    describe('and valid', function(){
      it('should PUT to /:model/:id', function(done){
        var pet = new Pet({ name: 'Tobi', species: 'Ferret' });
        pet.save(function(){
          assert(0 == pet.id());
          pet.name('Loki');
          pet.save(function(){
            assert(0 == pet.id());
            Pet.get(0, function(err, pet){
              assert(0 == pet.id());
              assert('Loki' == pet.name());
              done();
            });
          });
        });
      })

      it('should emit "saving"', function(done){
        var pet = new Pet({ name: 'Tobi', species: 'Ferret' });
        pet.save(function(err){
          assert(!err);
          pet.on('saving', done);
          pet.save();
        });
      })

      it('should emit "saving" on the constructor', function(done){
        var pet = new Pet({ name: 'Tobi', species: 'Ferret' });
        pet.save(function(){
          Pet.once('saving', function(obj){
            assert(pet == obj);
            done();
          });
          pet.save();
        });
      })

      it('should emit "save"', function(done){
        var pet = new Pet({ name: 'Tobi', species: 'Ferret' });
        pet.save(function(err){
          assert(!err);
          pet.on('save', done);
          pet.save();
        });
      })

      it('should emit "save" on the constructor', function(done){
        var pet = new Pet({ name: 'Tobi', species: 'Ferret' });
        pet.save(function(err){
          assert(!err);
          Pet.once('save', function(obj){
            assert(pet == obj);
            done();
          });
          pet.save();
        });
      })
    })

    describe('and invalid', function(){
      it('should error', function(done){
        var pet = new Pet({ name: 'Tobi' });
        pet.save(function(err){
          assert(!err);
          pet.name(null);
          pet.save(function(err){
            assert('validation failed' == err.message);
            assert(1 == pet.errors.length);
            assert('name' == pet.errors[0].attr);
            assert('field required' == pet.errors[0].message);
            assert(0 == pet.id());
            done();
          });
        });
      })
    })
    
    it('should have headers and return res object', function(done){
      var pet = new Pet({ name: 'Tobi' });
      pet.save(function(err, res){
        assert(!err);
        assert(res);
        assert(res.req.header['X-API-TOKEN'] == 'token string');
        pet.name(null);
        pet.save(function(err, res){
          assert(err);
          assert(!res); // vadiation error req never made
          done();
        });
      })
    })
  })
})

describe('Model#url(path)', function(){
  it('should include .id', function(){
    var user = new User;
    user.id(5);
    assert('/users/5' == user.url());
    assert('/users/5/edit' == user.url('edit'));
  })
})
