/**
 * Created by rhett on 1/24/16.
 */
'use strict';

var q = require('q');

function Registry () {
  if (!(this instanceof Registry)) {
    return new Registry();
  }

  this._reg = {};
}
Registry.prototype = {
  register: function (name, funcs) {
    funcs = Array.prototype.slice.call(arguments, 1);

    if (!this.has(name)) {
      this._reg[name] = [];
    }
    this._reg[name] = this._reg[name].concat(funcs);
  },
  has     : function (name) {
    return !!this._reg[name];
  },
  call    : function (cmd, msg) {
    return this
      .command(cmd.name)
      .reduce(function (msg, func) {
        return func(cmd.args, msg);
      }, msg);
  },
  command : function (name) {
    return this.has(name) ? this._reg[name] : [];
  }

};


module.exports = Registry;
