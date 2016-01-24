/**
 * Created by rhett on 1/23/16.
 */
'use strict';

//const StringDecoder = require('string_decoder').StringDecoder;
const util      = require('util');
const Transform = require('stream').Transform;
util.inherits(toString, Transform);

function toString () {
  if (!(this instanceof toString)) {
    return new toString();
  }

  Transform.call(this, {readableObjectMode: true, writableObjectMode: true});
}

toString.prototype._transform = function (data, encoding, done) {
  try {
    var txt = data.toString();
  } catch (er) {
    this.emit('error', er);
    return;
  }
  // push the parsed object out to the readable consumer
  this.push(txt);
  done();
};

module.exports = toString;
