'use strict'

const Koa = require('koa')
const route = require('koa-route')
const assets = require('koa-static')
const app = new Koa()
const fs = require('fs')

const about = ctx => {
	ctx.response.type = 'html'
	ctx.response.code = 200
	ctx.response.body = '<a href="/">Index Page</a>'
}

const main = async ctx => {
	ctx.response.type = 'html'
	ctx.response.code = 200
	ctx.response.body = fs.readFileSync('/code/dist/index.html')
}

app.use(route.get('/', main))
app.use(route.get('/about', about))
app.use(assets('/code/dist'))

module.exports = app
