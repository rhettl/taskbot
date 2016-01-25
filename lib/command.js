/**
 * Created by rhett on 1/23/16.
 */
'use strict';

var defaults = {
  cmdChar: '#' // character to denote
};


/**
 * Make a new Command
 *
 * @param {String|Array} txt cand or set of command arguments
 * @return {Command} produced Command
 */
function Command(txt) {
  if (!(this instanceof Command)) {
    return new Command(txt);
  } else if (!txt.split && !txt.join) {
    throw new Error('Command Raw must be String or Args Array, received: ' + txt);
  } else if (!txt.length) { //String and Array both have prototype.length
    throw new Error('Command is invalid, command empty');
  //} else if (txt.split && !Command.isCommand(txt)) {
  //  throw new Error('Given command is not valid, received: ' + txt);
  }

  this.raw = txt;

  if (txt.split) {
    txt = txt
      .replace(new RegExp('^' + Command._cmdChar), '')
      .trim()
      .split(/\s+/);
  }

  this.name = txt.shift().toLowerCase();
  this.args = txt;

}

Command.prototype = {
  /**
   * Character denoting command
   * @private
   */
  _cmdChar: defaults.cmdChar,

  toString: function () {
    return this.name + ': [' + this.args.join(', ') + ']';
  },

  /**
   * Checks for a command character to determin of the line is a command
   *
   * @param {String} line the line to check for command character
   * @return {boolean} is command
   */
  isCommand: function isCommand (line) {
    // regex: begins with command character (may include whitespace)
    return new RegExp('^\s*' + this._cmdChar + '.+')
      .test(line);
  }
};
Object.setPrototypeOf(Command, Command.prototype);


module.exports = Command;
module.exports.defaults = defaults;
