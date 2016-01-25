/**
 * Created by rhett on 1/23/16.
 */
'use strict';

var Command = require('./lib/command');
var Message = require('./lib/message');
var Registry = require('./lib/command-registry')();
var fs      = require('fs');
var q       = require('q');

var txt = fs.readFileSync('./test/message.txt').toString();

var a = Message(fs.readFileSync('./test/message.txt'));
//var b = Message(fs.createReadStream('./test/message.txt'));
//var c = Message(txt);

Registry.register('log', function(args, m){
  console.log(m);
  return m;
});
Registry.register('log', function(args, m){
  console.log(m.commands);
  return m;
});
Registry.register('duplicate', function(args, m){
  var tmp = m.body;

  for (var i = +args[0] || 1; i > 0; i --) {
    m.body += tmp;
  }

  return m;
});
Registry.register('pause', function(args, m, done){
  setTimeout(function(){
    done(null, m);
  }, +args[0] || 0);
});


Registry.call(a.commands, a, function(){
  console.log('Done.');
});

///*
//Works as expected
// */
//Registry.call(Command('#pause 2000'), a, function(err, data){
//  console.log('done.1');
//});
//Registry.call(Command('#duplicate'), a, function(err, data){
//  console.log('done.2');
//});


//Registry.call(Command('#pause 2000'), a).then(function () {
//  return Registry.call(Command('#duplicate'), a, function(err, data){
//    console.log('done.2');
//  });
//});


//b.promise.done(function(){
//  console.log(b);
//})
