'use strict'
const serverless = require('@serverless-devs/fc-http')
const app = require('./src')
exports.handler = serverless(app)
