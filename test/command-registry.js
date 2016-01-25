/**
 * Created by rhett on 1/23/16.
 */
'use strict';

var assert = require('assert');
//var path   = require('path');
//var fs     = require('fs');
//var q      = require('q');

var Registry = require('../lib/command-registry');
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
    beforeEach(function(){
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
    beforeEach(function(){
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

  describe('#call', function () {
    it('t', function () {
      assert(true);
    });
  });

  describe('#command', function () {
    var reg;
    beforeEach(function(){
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
