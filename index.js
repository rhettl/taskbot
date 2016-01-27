/**
 * Created by rhett on 1/23/16.
 */
'use strict';

var Command = require('./lib/command');
var Message = require('./lib/message');
var Registry = require('./lib/command-registry')(); // already initialized

module.exports = Registry;
module.exports.Message = Message;
module.exports.Command = Command;
