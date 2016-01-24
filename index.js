/**
 * Created by rhett on 1/23/16.
 */
'use strict';

var Message = require('./lib/message');
var fs      = require('fs');

var txt = fs.readFileSync('./test/message.txt').toString();

var a = Message(fs.readFileSync('./test/message.txt'));
var b = Message(fs.createReadStream('./test/message.txt'));
var c = Message(txt);

//console.log(a.promise)
a.then(function(){
  console.log('a', a);
});
b.then(function(){
  console.log('b', b);
});
c.then(function(){
  console.log('c', c);
});
