/**
 * Created by rhett on 1/23/16.
 */
'use strict';

var assert = require('assert');
var path   = require('path');
var fs     = require('fs');
var q      = require('q');

var Message           = require('../lib/message');
var testFile          = './message.txt';
var testFilePath      = path.normalize(path.join(__dirname, testFile));
var testMessageBuffer = fs.readFileSync(testFilePath);
var testMessageString = testMessageBuffer.toString();

describe('Message', function () {

  describe('Message', function () {

    function cleanBody (txt) {
      return txt
        .split(/[\r\n]+/g)
        .map(function (i) {
          return i.replace(/(^\s*#.+)/, '');
        })
        .join('\n')
        .trim();
    }

    it('Message() == new Message()', function () {
      var m1 = Message('message');
      var m2 = new Message('message');

      // don't need promises to equal.
      delete m1.promise;
      delete m2.promise;

      assert.deepEqual(m1, m2);
    });

    it('should accept String type argument', function () {
      assert.equal(
        cleanBody(testMessageString),
        Message(testMessageString).body.trim()
      );
    });

    it('should accept Buffer type argument', function () {
      assert.equal(
        cleanBody(testMessageString),
        Message(testMessageBuffer).body.trim()
      );
    });

    it('should accept Stream type argument', function (done) {
      var msg = Message(fs.createReadStream(testFilePath));
      msg.promise.done(function () {
        assert.equal(
          cleanBody(testMessageString),
          msg.body.trim()
        );
        done();
      });
    });

    it('should parse String, Buffer, and Stream the same', function (done) {
      var m1 = Message(testMessageString);
      var m2 = Message(testMessageBuffer);
      var m3 = Message(fs.createReadStream(testFilePath));

      assert.equal(m1.body, m2.body);
      assert.deepEqual(m1.commands, m2.commands);

      m3.promise.done(function () {
        assert.equal(m1.body, m3.body);
        assert.deepEqual(m1.commands, m3.commands);
        done();
      });
    });

    it('should allow promising from non-Stream inputs', function () {
      assert(q.isPromise(Message(testMessageString).promise));
      assert(q.isPromise(Message(testMessageBuffer).promise));
    });
  });

  describe('#_separateCommands', function () {

    var mockup;
    beforeEach(function () {
      //noinspection JSAccessibilityCheck
      mockup = {
        body             : testMessageString,
        raw              : testMessageString,
        commands         : [],
        _separateCommands: Message.prototype._separateCommands,
        addCommand       : Message.prototype.addCommand
      };
    });

    /**
     * @rhettl: I feel like this test is weak. I would love a more solid way of checking this.
     */
    it('should remove all commands from message body', function () {
      mockup._separateCommands();
      assert.equal(
        mockup.raw
          // break by line
          .split(/[\r\n]+/g)
          // get rid of commands
          .map(function (i) {
            return i.replace(/(^\s*#.+[\r\n]*)/g, '');
          })
          //filter empty lines
          .filter(function (i) {
            return i.length;
          })
          // join by new line
          .join('\n')
          // trim trailing/leading lines
          .trim(),
        mockup.body.trim()
      );
    });

    it('should populate #commands', function () {
      // has no commands
      assert.equal(0, mockup.commands.length);

      // do separate
      mockup._separateCommands();

      // check number commands there should be
      var numCommand = mockup.raw
        .split(/[\r\n]+/g)
        .filter(function (i) {
          return /(^\s*#.+[\r\n]*)/g.test(i);
        })
        .length;

      // check separate made correct number of commands
      assert.equal(mockup.commands.length, numCommand);
    });

  });

  describe('#inspect\\#toString', function () {
    it('should produce a string', function () {
      var msg = Message(testMessageString);
      assert.equal('string', typeof msg.inspect());
      assert.equal('string', typeof msg.toString());
    });
  });

  describe('#addCommand', function () {
    it('should add command to the Message.commands stack', function () {
      var msg = Message('');
      assert.equal(0, msg.commands.length);

      msg.addCommand('test 123');
      assert.equal(1, msg.commands.length);

      msg.addCommand('log');
      assert.equal(2, msg.commands.length);
    });
    it('should add same command with or without # char', function () {
      var msg = Message('');
      assert.equal(0, msg.commands.length);

      msg.addCommand('log');
      assert.equal(1, msg.commands.length);

      msg.addCommand('#log');
      assert.equal(2, msg.commands.length);

      // raw will inherently be different, don't check it
      assert.equal(msg.commands[0].name, msg.commands[1].name);
      assert.deepEqual(msg.commands[0].args, msg.commands[1].args);
    });
  });

  describe('#_bufferMessageStream', function () {
    /**
     * Todo: more complete testing here
     * I feel this testing is lacking greatly
     */

    it('should return an empty Message immediately', function () {
      //noinspection JSAccessibilityCheck
      assert.equal('', Message._bufferMessageStream(fs.createReadStream(testFilePath)).body);
    });
    it('should create a promise at Message.promise', function () {
      //noinspection JSAccessibilityCheck
      assert(q.isPromise(Message._bufferMessageStream(fs.createReadStream(testFilePath)).promise));
    });
    it('should replace empty message with content after done buffering', function (done) {
      //noinspection JSAccessibilityCheck
      var msg = Message._bufferMessageStream(fs.createReadStream(testFilePath));

      assert.equal('', msg.body);
      msg.promise.done(function () {
        assert.notEqual('', msg.body);
        done();
      });
    });
  });



});
