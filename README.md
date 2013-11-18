# fendjs-model-restful

[![Build Status](https://travis-ci.org/Frapwings/fendjs-model-restful.png?branch=master)](https://travis-ci.org/Frapwings/fendjs-model-restful) [![Coverage Status](https://coveralls.io/repos/Frapwings/fendjs-model-restful/badge.png)](https://coveralls.io/r/Frapwings/fendjs-model-restful) [![NPM version](https://badge.fury.io/js/fendjs-model-restful.png)](http://badge.fury.io/js/fendjs-model-restful) [![Dependency Status](https://david-dm.org/Frapwings/fendjs-model-restful.png)](https://david-dm.org/Frapwings/fendjs-model-restful)

RESTful model plugin for Fend.js model

# Usage

```js
var Modeler = require('fendjs-model');
var RESTfulable = require('fendjs-model-restful');

Modeler.use(RESTfulable());

var Pet = Modeler('Pet')
  .attr('id')
  .attr('name')
  .attr('species')
  .headers({ 'X-API-TOKEN': 'token string' });

var pet = new Pet({ name: 'Tobi', species: 'Ferret' });
pet.save(function (err, res) {
  if (err) {
    // Error something todo ...
    return;
  }
  // Something todo ...
});
```

# API

## Model.url([path])

Return base url, or url to `path`.

```js
User.url()
// => "/users"

User.url('add')
// => "/users/add"
```

## Model.route(path)

Set base path for urls.
Note this is defaulted to `'/' + modelName.toLowerCase() + 's'`

```js
User.route('/api/u')

User.url()
// => "/api/u"

User.url('add')
// => "/api/u/add"
```
 
## Model.headers({header: value})

Sets custom headers for static and method requests on the model.

```js  
User.headers({
  'X-CSRF-Token': 'some token',
  'X-API-Token': 'api token 
});
```

## Model#url([path])

Return this model's base url or relative to `path`:

```js
var user = new User({ id: 5 });
user.url('edit');
// => "/users/5/edit"
```

# Testing

```
$ npm install
$ make test
```

# License

[MIT license](http://www.opensource.org/licenses/mit-license.php).

See the `LICENSE`.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Frapwings/fendjs-fetcher-rest/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

