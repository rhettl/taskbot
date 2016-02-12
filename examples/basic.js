/**
 * Created by rhett on 1/26/16.
 */
'use strict';

var fs = require('fs');

var taskbot = require('../index');

taskbot.register('log', require('./commands/log'));
taskbot.register('pause', require('./commands/pause'));

/*
  body
 */
var text   = '#log\nbody';
var buffer = fs.readFileSync('./messages/example_1.txt');
var stream = fs.createReadStream('./messages/example_2.txt');

var msgText   = taskbot.Message(text);
var msgBuffer = taskbot.Message(buffer);
var msgStream = taskbot.Message(stream);

taskbot.call(msgText.commands, msgText, function (err, msg) { // eslint-disable-line no-unused-vars
  if (err) {
    throw err;
  }
  console.log('Text command is done.'); // eslint-disable-line no-console
});

taskbot.call(msgBuffer.commands, msgBuffer, function (err, msg) { // eslint-disable-line no-unused-vars
  if (err) {
    throw err;
  }
  console.log('Buffer command is done.'); // eslint-disable-line no-console
});

// streams have to complete before processing,
// all Messages have a promise, streams resolve when ready
// non-streams, complete immediately.
msgStream.promise.done(function(){

  taskbot.call(msgStream.commands, msgStream, function (err, msg) { // eslint-disable-line no-unused-vars
    if (err) {
      throw err;
    }
    console.log('Stream command is done.'); // eslint-disable-line no-console
  });

});
