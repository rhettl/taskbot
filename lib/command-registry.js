/**
 * Created by rhett on 1/24/16.
 */
'use strict';

var Command = require('./command');
var q       = require('q');

function Registry () {
  if (!(this instanceof Registry)) {
    return new Registry();
  }

  this._reg = {};
}
Registry.prototype = {
  register: function (name, funcs) {
    funcs = Array.prototype.slice.call(arguments, 1);
    name  = name.toLowerCase();

    if (!this.has(name)) {
      this._reg[name] = [];
    }
    this._reg[name] = this._reg[name].concat(funcs);
  },
  has     : function (name) {
    return !!this._reg[name];
  },
  call    : function (cmd, msg, done) {
    // if given a set of commands, follow them in order
    if (cmd instanceof Array) {
      // when there are no more commands, exit by calling the done function
      if (cmd.length <= 1) {
        // tack on last command and done at the end.
        return this.call(cmd[0], msg, done);
      } else {
        var self = this;

        // Call the first Command without completing the done function
        return this.call(cmd[0], msg)
          // Tack the rest of the chain after recursively.
          // pass on done
          // Wrapped in function to prevent immediate call
          .then(function() {
            return self.call(cmd.slice(1), msg, done);
          });
      }
    }

    // If this thing we have isn't a Command, make it one
    if (!(cmd instanceof Command)) {
      cmd = Command(cmd);
    }

    var prom = q(msg); // initial load with promise
    this
      .command(cmd.name)
      .forEach(function (func) {

        // Stack promises
        prom = prom.then(function (msg) {
          var deferred = q.defer();

          //Allow callback or promise
          var cb = deferred.makeNodeResolver();

          // Check for thrown errors
          try {
            // offer function the command arguments, message, and callbacks
            var funcReturn = func(cmd, msg, cb);
            //console.log(cmd, funcReturn, func.length);
          } catch (err) {
            cb(err);
          }

          // if there is a return directly from the function
          // and that return is a promise or has value
          if (
            q.isPromise(funcReturn)
            || funcReturn
            || (typeof funcReturn !== 'undefined' && funcReturn !== null)
          ) {
            // return it as the returned value for next promise
            cb(null, funcReturn);
          } else if (func.length < 3) { // if not calling callback
            // else something went wrong here and nothing was returned
            // todo: not sure if I should return error or cb(null, null);
            cb(new Error('Nothing was returned and callback not requested'));
          }

          // else callback will be used, hopefully
          return deferred.promise;
        });

      });
    // done is properly being called AFTER delay
    return prom.nodeify(done);
  },
  command : function (name) {
    return this.has(name) ? this._reg[name] : [];
  }
};


module.exports = Registry;
