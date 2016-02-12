/**
 * Created by rhett on 1/26/16.
 */
'use strict';

/**
 * Log Message body or other
 *
 * -- Log the msg using msg.inspect() --
 * #log
 *
 * -- Log the msg.raw --
 * #log raw
 *
 * -- Log msg.body, then msg.raw --
 * #log body raw
 *
 * @param {Command} cmd Command which activated this function
 * @param {Message} msg Message where command was found
 *
 */
module.exports = function(cmd, msg){
  // If there are arguments
  if (cmd.args.length > 0) {
    cmd.args.forEach(function(param){
      if (typeof msg[param] !== 'undefined') {
        console.log(msg[param]); // eslint-disable-line no-console
      }
    });
  } else {
    console.log(msg); // eslint-disable-line no-console
  }
};
