/**
 * Created by rhett on 1/23/16.
 */
'use strict';

var Message = require('./lib/message');
var Registry = require('./lib/command-registry')();
var fs      = require('fs');

var txt = fs.readFileSync('./test/message.txt').toString();

var a = Message(fs.readFileSync('./test/message.txt'));
var b = Message(fs.createReadStream('./test/message.txt'));
var c = Message(txt);

Registry.register('log', function(args, m){
  console.log(m);
  return m;
});

a.commands.forEach(function (cmd) {
  a = Registry.call(cmd, a);
});

//.done(function(){
//  console.log(a);
//})
;
