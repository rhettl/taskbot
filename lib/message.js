/**
 * Created by rhett on 1/23/16.
 */
'use strict';
var Command = require('./command');
var q = require('q');
const StringDecoder = require('string_decoder').StringDecoder;


var defaults = {};


var bufferMessageStream = function bufferMessageStream (stream) {
  // Make temporary message
  var deferredMsg = new Message('');
  // prep promise
  var deferred = q.defer();
  // Add add promise to temp message
  deferredMsg.promise = deferred.promise;

  // Decode/convert Stream data to string/buffer
  var buffer = '';
  var decoder = new StringDecoder('utf8');
  stream.on('data', function (data) {
    // Store chunks
    buffer += decoder.write(data);
  });
  stream.on('end', function () {
    // Make new message out of buffered data
    var bufferedMsg = Message(buffer);
    // Copy from new message onto deferred message,
    // replacing values in opd memory position with new values
    Object.keys(bufferedMsg).forEach(function (k) {
      deferredMsg[k] = bufferedMsg[k];
    });

    // tell any listeners to
    deferred.resolve(bufferedMsg);
  });

  return deferredMsg;
};

/**
 * Make new Message
 *
 * @param {String|Message} newMsg raw body of the new message. If Message, return copy.
 * @return {Message} the new Message
 */
function Message (newMsg) {
  if (!(this instanceof Message)) {
    return new Message(newMsg);
  }

  //// if already a Message, return as is;
  //if (newMsg.prototype === Message || Object.getPrototypeOf(newMsg) === Message) {
  //  return newMsg;
  //}

  // if is stream
  if (newMsg.readable && newMsg.pipe) {
    return bufferMessageStream(newMsg);
  }

  //// make a Message out of the incoming value
  //var msg = Object.create(Message);

  this.raw = newMsg;
  this.body = this.raw.toString
    ? this.raw.toString()
    : this.raw;
  this.commands = [];

  // must be a string by this point
  if (typeof this.body !== 'string') {
    throw new Error('Given message cannot be converted to String');
  }

  // init operations
  //noinspection JSAccessibilityCheck <= This is intended to be accessed HERE, not later
  this._separateCommands();
  this.promise = q.fcall(function () {
    return this;
  });
  //console.log(this.promise);

  // factory return
  //return this;
}

Message.prototype = {
  /**
   * Inspect function for console.log
   *
   * Showing all the object's properties is not beneficial.
   * Function shows Body message and commands
   *
   * @return {string} text for console.log, etc.
   */
  inspect: function () {
    return 'Body: "' + this.body + '"' +
      '\r\nCommands: ' + this.commands.length +
      '\r\n\t' + this.commands.join('\r\n\t');
  },
  toString: Message.prototype.inspect,

  /**
   * Adds commands to the command stack for later analysis
   *
   * @param {String|Array} cmd command, should be String or .join-able
   * @return {String} the command added
   */
  addCommand: function addCommand (cmd) {
    // remove command tag and save for later parsing phase
    this.commands.push(Command(cmd));

    // for chainablity
    return this;
  },

  /**
   * separate commands from the body text and put them into this.commands array
   *
   * this function is called after instantiation and before factory hand-off.
   * It isn't intended to be called more than once.
   *
   * This function modifies the body.
   *
   * @return {Message} <= this, for chainability
   * @private
   */
  _separateCommands: function separateCommands () {
    this.body = this.body
      // search for line endings
      .replace(/([^\r\n]*)([\r\n]+)/g, (line, text) => { // regex: get line and line-return(s)
        // if the line is a command
        if (Command.isCommand(text)) {
          // remove it from the body and put into the commands array
          this.addCommand(text);
          return '';
        } else {
          // but keep the body lines
          return line;
        }
      });

    // chainable
    return this;
  },
  then: function(){
    return this.promise.then.apply(this.promise, arguments);
  }

};

Object.setPrototypeOf(Message, Message.prototype);

module.exports = Message;
module.exports.defaults = defaults;

