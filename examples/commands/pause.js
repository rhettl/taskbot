/**
 * Created by rhett on 1/26/16.
 */
'use strict';

/**
 * Pause execution for a number of milliseconds
 *
 * -- Pause for 2 seconds --
 * #pause
 *
 * -- Pause for 5 seconds --
 * #pause 5000
 *
 * -- Pause for 200ms --
 * #pause 200
 *
 * @param {Command} cmd Command which activated this function
 * @param {Message} msg Message where command was found
 * @param {Function} done Callback on completion `(Error, Message)`
 */
module.exports = function(cmd, msg, done){
  setTimeout(function(){
    done(null, msg);
  }, +cmd.args[0] || 2000);
};
