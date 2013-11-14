SRC = $(wildcard lib/*.js)
COMPONENT = ./node_modules/.bin/component

build: components $(SRC)
	@$(COMPONENT) build --dev -o ./test

components: component.json
	@$(COMPONENT) install --dev

test-phantomjs: build
	node ./test/server & ./node_modules/.bin/mocha-phantomjs http://localhost:4000
	@kill -9 `cat ./test/pid.txt`
	@rm ./test/pid.txt

clean:
	@rm -fr ./build ./components
	@rm ./test/build.js

.PHONY: clean test-phantomjs
