import combineRouters from 'koa-combine-routers'
import _ from 'lodash'


import logger from '../logger'

import userRouter from './user'

let routerList = [
  userRouter
]

logger.info("======================routers=============================")
for (let router of routerList) {
  router.stack.map(it => {
    logger.info("methods:%s : %s", _.without(it.methods, 'HEAD', 'OPTIONS'), it.path)
  })
}
logger.info("======================routers=============================")

const routers = combineRouters(routerList)

export default routers
