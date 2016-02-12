/**
 * Created by rhett on 1/23/16.
 */
'use strict';

var assert = require('assert');

var Command = require('../lib/command');

describe('Command', function () {

  describe('Command#', function () {

    it('Command() == new Command()', function () {
      assert.deepEqual(Command('#command'), new Command('#command'));
    });

    it('maintains raw version of original text in command.raw', function () {
      assert.equal('#command', Command('#command').raw);
    });

    it('trims command before processing', function () {
      var cmdRaw = '  #command ';
      var cmd = Command(cmdRaw);
      assert.equal(cmd.raw, cmdRaw);
      assert.equal(cmd.name, Command('#command').name);
    });

    it('First argument is command.name', function () {
      assert.equal('command', Command('#command').name);
    });

    it('rest arguments is command.args', function () {
      assert.deepEqual(['is', 'a', 'command'], Command('#this is a command').args);
    });

    it('command.args is array', function () {
      assert(Command('#this is a command').args instanceof Array);
    });

    it('command.args is empty array if only command name given', function () {
      assert.equal(0, Command('#command').args.length);
    });

    it('doesn\'t require # to make a command', function () {
      var cmd1 = Command('#command');
      var cmd2 = Command('command');
      assert.equal(cmd1.name, cmd2.name);
      assert.deepEqual(cmd1.args, cmd2.args);
    });

    it('throws an error when provided with empty string/undefined', function () {
      assert.throws(function () {
        Command();
      }, /invalid/);
      assert.throws(function () {
        Command('');
      }, /invalid/i);
    });

    it('throws an error when provided with empty string/undefined', function () {
      assert.throws(function () {
        Command({length: 2}); // some object, not string or array, with length
      }, /string.+array/i);
    });

  });

  describe('#isCommand', function () {

    it('should recognize a command by preceding #', function () {
      assert.equal(true, Command.isCommand('#command'));
    });

    it('should not recognize a command without preceding #', function () {
      assert.equal(false, Command.isCommand('not a command'));
    });

  });

  describe('#toString', function () {

    it('should produce a string', function () {
      assert.equal('string', typeof Command('#command arg1 arg2').toString());
    });

    it('is not formatted like original command text', function () {
      var cmd = '#command arg1 arg2';
      assert.notEqual(cmd, Command(cmd).toString());
    });

  });

});
