SRC = $(wildcard lib/*.js)
COMPONENT = ./node_modules/.bin/component

build: components $(SRC)
	@$(COMPONENT) build --dev --use component-jscoverage -o ./test

components: component.json
	@$(COMPONENT) install --dev

test: build
	node ./test/server & ./node_modules/.bin/mocha-phantomjs http://localhost:4000
	@kill -9 `cat ./test/pid.txt`
	@rm ./test/pid.txt

test-coveralls: build
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	node ./test/server & ./node_modules/.bin/mocha-phantomjs -R json-cov http://localhost:4000 | ./node_modules/.bin/json2lcov | ./node_modules/.bin/coveralls
	@kill -9 `cat ./test/pid.txt`
	@rm ./test/pid.txt

clean:
	@rm -fr ./build ./components
	@rm ./test/build.js

.PHONY: clean test test-coveralls
