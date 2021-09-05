const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const log4js = require('./utils/log4j') 
const users = require('./routes/users')
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')


const router = require('koa-router')()

// error handler
onerror(app)

//mongoose
require('./config/db')



// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  log4js.info(`get params:${JSON.stringify(ctx.request.query )}`)
  log4js.info(`post params:${JSON.stringify( ctx.request.body)}`)
  await next().catch((err)=>{
    if(err.status == '401'){
      ctx.status = 200;
      ctx.body = util.fail('Token认证失败',util.CODE.AUTH_ERROR);
    }else{
      throw err;
    }
  })
 
})
//拦截
app.use(koajwt({secret:'lwq'}).unless({
  path:[/^\/api\/users\/login/]
}))
//一级路由
router.prefix("/api")

//加载二级路由
router.use(users.routes(), users.allowedMethods())
//加载全局的router
app.use(router.routes(),router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
