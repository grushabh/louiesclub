import Router from 'koa-router'
import matchServices from '../services/match'

const router = new Router({
  prefix: '/user'
})


/**
 * @api {get} /match/:userId/dogs  matchd dogs
 * @apiVersion 1.0.0
 * @apiName match dogs
 * @apiGroup match
 *
 * @apiSuccess {Object}  user
 * @apiSuccessExample Success-Response:
 *
 * {
 *  "user":{},
 *  "matches":[]
 * }
 *
 */
router.get('/:userId/dogs', async ctx => {
  const { userId } = ctx.params
  const user = await matchServices.match(userId)
  ctx.body = user
})


export default router

