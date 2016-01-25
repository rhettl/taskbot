/**
 * Created by rhett on 1/23/16.
 */
'use strict';

var Command = require('./lib/command');
var Message = require('./lib/message');
var Registry = require('./lib/command-registry')();
var fs      = require('fs');

var txt = fs.readFileSync('./test/message.txt').toString();

var a = Message(fs.readFileSync('./test/message.txt'));
//var b = Message(fs.createReadStream('./test/message.txt'));
//var c = Message(txt);

Registry.register('log', function(args, m){
  console.log(m);
  return m;
});
Registry.register('duplicate', function(args, m){
  var tmp = m.body;

  for (var i = +args[0] || 0; i > 0; i --) {
    m.body += tmp;
  }

  return m;
});
Registry.register('pause', function(args, m, done){
  setTimeout(function(){
    console.log('calling');
    done(null, m);
  }, +args[0] || 0);
});


//Registry.call(a.commands, a, function(){
//  console.log('Done.');
//});

Registry.call(Command('#pause 2000'), a, function(err, data){
  console.log('done.');
});

//b.promise.done(function(){
//  console.log(b);
//})
