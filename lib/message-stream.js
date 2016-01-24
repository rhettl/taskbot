/**
 * Created by rhett on 1/23/16.
 */
'use strict';


var Message = require('./message');

//const StringDecoder = require('string_decoder').StringDecoder;
const util      = require('util');
const Transform = require('stream').Transform;
util.inherits(MessageStream, Transform);

function MessageStream () {
  if (!(this instanceof MessageStream)) {
    return new MessageStream();
  }

  Transform.call(this, {readableObjectMode: true});
}

MessageStream.prototype._transform = function (data, encoding, done) {
  try {
    var msg = Message(data);
    //console.log(msg);
  } catch (er) {
    this.emit('error', er);
    return;
  }
  // push the parsed object out to the readable consumer
  this.push(msg);
  done();
};

module.exports = MessageStream;
