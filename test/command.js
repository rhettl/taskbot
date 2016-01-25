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
      assert.equal(Command('#command').raw, '#command');
    });

    it('trims command before processing', function () {
      var cmdRaw = '  #command ';
      var cmd = Command(cmdRaw);
      assert.equal(cmd.raw, cmdRaw);
      assert.equal(cmd.name, Command('#command').name);
    });

    it('First argument is command.name', function () {
      assert.equal(Command('#command').name, 'command');
    });

    it('rest arguments is command.args', function () {
      assert.deepEqual(Command('#this is a command').args, ['is', 'a', 'command']);
    });

    it('command.args is array', function () {
      assert(Command('#this is a command').args instanceof Array);
    });

    it('command.args is empty array if only command name given', function () {
      assert.equal(Command('#command').args.length, 0);
    });

    it('doesn\'t require # to make a command', function () {
      var cmd1 = Command('#command');
      var cmd2 = Command('command');
      assert.equal(cmd1.name, cmd2.name);
      assert.deepEqual(cmd1.args, cmd2.args);
    });

  });

  describe('#isCommand', function () {

    it('should recognize a command by preceding #', function () {
      assert.equal(Command.isCommand('#command'), true);
    });

    it('should not recognize a command without preceding #', function () {
      assert.equal(Command.isCommand('now a command'), false);
    });

  });

  describe('#toString', function () {

    it('should produce a string', function () {
      assert(Command('#command arg1 arg2').toString(), 'string');
    });

    it('is not formatted like original command text', function () {
      var cmd = '#command arg1 arg2';
      assert.notEqual(Command(cmd).toString(), cmd);
    });

  });

});
