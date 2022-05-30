/*
if you open the initializer feature, please implement the initializer function, as below:
module.exports.initializer = function(context, callback) {
  console.log('initializing');
  callback(null, ''); 
};
*/

'use strict';
const { Server } = require('@webserverless/fc-express')
const app = require('./src')
let server

module.exports.initializer = function(context, cb) {
  if (!server) { 
    console.info('start init server');
    server = new Server(app.callback(), () => {
      console.info('finish init');
      cb(null, 'finish init'); 
    })
  
    server.startServer() 
  }
};

module.exports.handler = function(event, context, callback) { 
  server.proxy(event, context, callback);
};