import Koa from 'koa'
import bodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import mount from 'koa-mount'
import serve from 'koa-static'
import path from 'path'

import logger from './logger'


// logic
import routers from './routers'

const api = new Koa()

api.use(koaLogger())

api.use(async(ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error(err, err.stack.split("\n"));
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message
    };
  }
})

api.use(bodyParser())
api.use(routers)


// api doc
const staticApp = new Koa()
const apidocDir = path.resolve(path.join(path.dirname(__dirname), 'apidoc'))

staticApp.use(serve(apidocDir))

const app = new Koa()

app.use(mount('/api/v1', api))
app.use(mount('/apidoc/', staticApp))




export default app

