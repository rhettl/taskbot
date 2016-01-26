/**
 * Created by rhett on 1/23/16.
 */
'use strict';

var assert = require('assert');
//var path   = require('path');
//var fs     = require('fs');
var q = require('q');

var Registry = require('../lib/command-registry');
var Command  = require('../lib/command');
//var Message      = require('../lib/message');
//var testFile     = './message.txt';
//var testFilePath = path.normalize(path.join(__dirname, testFile));
//var testMessage  = fs.readFileSync(testFilePath).toString();

describe('CommandRegistry', function () {

  describe('Registry', function () {
    it('Registry() == new Registry()', function () {
      assert.deepEqual(Registry(), new Registry());
    });

    it('initializes an empty registry at Registry._reg', function () {
      assert.deepEqual({}, Registry()._reg);
    });
  });

  describe('#register', function () {
    var reg;
    beforeEach(function () {
      reg = Registry();
    });

    it('names a registry set if not existed', function () {
      assert(!reg._reg['unnamed']);

      reg.register('unnamed', function noop () {
        return 1;
      });
      assert(reg._reg['unnamed']);
    });

    it('should take multiple functions as arguments', function () {
      assert(!reg._reg['unnamed']);

      reg.register('unnamed',
        function noop1 () {
          return 1;
        }, function noop2 () {
          return 2;
        });
      assert.equal(2, reg._reg['unnamed'].length);
    });

    it('should concatenate new functions in order', function () {
      assert(!reg._reg['unnamed']);

      reg.register('unnamed', function noop () {
        return 0;
      });

      reg.register('unnamed',
        function noop1 () {
          return 1;
        }, function noop2 () {
          return 2;
        });

      assert.equal(3, reg._reg['unnamed'].length);

      // Added in order
      assert.equal(0, reg._reg['unnamed'][0]());
      assert.equal(2, reg._reg['unnamed'][2]());
    });

    it('should store registry names case insensitive (lower case)', function () {
      assert(!reg._reg['unnamed']);

      reg.register('uNnAmEd', function noop () {
        return 0;
      });

      assert(reg._reg['unnamed']);
      assert(!reg._reg['uNnAmEd']);
    });
  });

  describe('#has', function () {
    var reg;
    beforeEach(function () {
      reg = Registry();
      reg.register('named', function noop () {
        return 1;
      });
    });

    it('produces boolean values', function () {
      assert.strictEqual(true, reg.has('named'));
      assert.strictEqual(false, reg.has('unnamed'));
    });
  });

  describe('#_callArray', function () {
    var reg;
    var counter;
    beforeEach(function () {
      reg     = Registry();
      counter = 0;
    });

    it('Calls Registry.call when one item in Command Array', function () {
      reg.call = function () {
        counter++;
      };
      reg._callArray([1]);
      assert(counter, 'Registry.call not called');
    });

    it('recursively calls self when more than one command in array', function (done) {
      /*
       This test badly needs reworking.
       I think I need spies, but I am not really sure
       */

      var mockup = {
        call      : function () {
          // increment counter by one when call() is called
          counter += 1;
          return q(1);
        },
        _callArray: function (arr) {
          // increment by ten when _callArray()
          counter += 10;

          // continue to call _callArray()
          // that WOULD have been called if not for mockup
          return reg._callArray.call(mockup, arr.slice(1));
        }
      };
      reg._callArray.call(mockup, [1, 2]).done(function () {
        assert.equal(12, counter);
        done();
      });
    });

    it('passes done() to final call() function call', function (cb) {
      /*
       This test badly needs reworking.
       I think I need spies, but I am not really sure
       */
      var d = function done () {
        assert(1);
        cb();
      };

      var mockup = {
        call: function (_, __, done) {
          done();
        }
      };
      reg._callArray.call(mockup, [1], '', d);
    });

    it('passes done() recursively to _callArray()', function (cb) {
      /*
       This test badly needs reworking.
       I think I need spies, but I am not really sure
       */
      var d = function done () {
        return 1;
      };

      var mockup = {
        call      : function () {
          return q(1);
        },
        _callArray: function (_, __, done) {
          done();
          cb();
        }
      };
      reg._callArray.call(mockup, [1, 2], '', d);
    });
  });

  /*
   Still working on this one. This is the hardest function to test. :(
   */
  describe('#call', function () {
    var reg;
    beforeEach(function () {
      reg = Registry();
    });

    it('passes to _callArray when first argument is an Array', function (done) {
      var mockup = {
        _callArray: function () {
          assert(1);
          done();
        }
      };
      reg.call.call(mockup, [1, 2]);
    });

    it('returns a promise if no done() provided', function () {
      assert(q.isPromise(
        reg.call('name')
      ));
    });

    it('returns a undefined if done() provided', function () {
      assert.strictEqual(
        'undefined',
        typeof reg.call('name', '', function () {
        })
      );
    });

    it('returns a undefined if done() provided', function () {
      assert.strictEqual(
        'undefined',
        typeof reg.call('name', '', function () {
        })
      );
    });

    it('calls a registered function', function (done) {
      reg.register('done', function () {
        assert(1);
        done();
      });
      reg.call('done');
    });

    it('calls registered functions sequentially', function (done) {
      var string = '';
      reg.register('done', function () {
        string += 'first'; // first should be called first
      });
      reg.register('done', function () {
        string += 'second'; // second should be called second
      });

      assert.equal(2, reg.command('done').length);

      reg.call('done', '', function () {
        assert.equal('firstsecond', string);
        done();
      });
    });

    it('waits for first to finish before second starts', function (done) {
      var string    = '';
      var startTime = Date.now();
      var delayTime = 100; // ms
      this.slow(3 * delayTime); // prevent "slow" message from appearing
      reg.register('done', function (_, __, cb) {
        string += 'one'; // run one

        // start delay
        setTimeout(function () {
          // run two
          string += 'two';
          cb(); // callback for Register function
        }, delayTime);
      });
      reg.register('done', function () {
        // run three
        string += 'three';
      });

      assert.equal(2, reg.command('done').length);

      reg.call('done', '', function () {
        // check run order
        assert.equal('onetwothree', string);
        // check for pause
        assert(Date.now() - startTime >= delayTime);
        // callback for it()
        done();
      });
    });

    it('converts string commands to Command before calling', function (done) {
      reg.register('done', function (commandObject) {
        assert.strictEqual('string', typeof commandString);
        assert.strictEqual('object', typeof commandObject);
        assert(commandObject instanceof Command);
        done();
      });

      var commandString = 'done';
      reg.call(commandString);
    });
  });

  describe('#command', function () {
    var reg;
    beforeEach(function () {
      reg = Registry();
      reg.register('named', function noop () {
        return 1;
      });
    });

    it('gets empty array of no registered functions', function () {
      assert(!reg.has('unnamed'));
      assert.deepEqual([], reg.command('unnamed'));
    });

    it('gets array of registered functions when they are present', function () {
      assert(reg.has('named'));
      assert.equal(1, reg.command('named').length);
    });

    it('is case insensitive', function () {
      assert(reg.has('named'));
      assert.equal(1, reg.command('named').length);
      assert.equal(1, reg.command('nAmEd').length);
    });
  });

});
